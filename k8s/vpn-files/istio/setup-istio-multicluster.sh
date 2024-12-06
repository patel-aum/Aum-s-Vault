#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Logger function
log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# Validate prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check kubectl
    kubectl version --client || error "kubectl not found"
    
    # Check istioctl
    istioctl version || error "istioctl not found"
    
    # Check contexts
    kubectl config get-contexts cluster1 || error "cluster1 context not found"
    kubectl config get-contexts cluster2 || error "cluster2 context not found"
    
    # Check cluster connectivity
    kubectl --context cluster1 get nodes || error "Cannot connect to cluster1"
    kubectl --context cluster2 get nodes || error "Cannot connect to cluster2"
    
    log "Prerequisites check passed ✓"
}

# Generate certificates
generate_certs() {
    log "Generating certificates..."
    
    mkdir -p certs
    cd certs
    
    # Generate root CA
    openssl req -x509 -newkey rsa:4096 -nodes \
        -keyout root-key.pem -out root-cert.pem -days 365 \
        -subj "/CN=Root CA" || error "Failed to generate root CA"
    
    # Generate intermediate CA for each cluster
    for cluster in cluster1 cluster2; do
        openssl req -newkey rsa:4096 -nodes \
            -keyout "${cluster}-key.pem" -out "${cluster}-cert.csr" \
            -subj "/CN=${cluster} Intermediate CA" || error "Failed to generate ${cluster} cert"
        
        openssl x509 -req -in "${cluster}-cert.csr" \
            -CA root-cert.pem -CAkey root-key.pem -CAcreateserial \
            -out "${cluster}-cert.pem" -days 365 || error "Failed to sign ${cluster} cert"
    done
    
    cd ..
    log "Certificates generated successfully ✓"
}

# Install Istio on primary cluster (EKS)
install_primary_cluster() {
    log "Installing Istio on primary cluster (cluster1)..."
    
    kubectl config use-context cluster1
    
    # Create istio-system namespace
    kubectl create namespace istio-system --dry-run=client -o yaml | kubectl apply -f -
    
    # Create secret with certificates
    kubectl create secret generic cacerts -n istio-system \
        --from-file=certs/root-cert.pem \
        --from-file=certs/cluster1-cert.pem \
        --from-file=certs/cluster1-key.pem \
        --dry-run=client -o yaml | kubectl apply -f -
    
    # Install Istio with ambient mode
    cat << EOF > primary-cluster-config.yaml
apiVersion: install.istio.io/v1alpha1
kind: IstioOperator
metadata:
  name: primary-cluster
spec:
  profile: ambient
  values:
    global:
      meshID: mesh1
      multiCluster:
        clusterName: cluster1
      network: network1
  components:
    pilot:
      k8s:
        env:
          - name: PILOT_ENABLE_AMBIENT_WAYPOINTS
            value: "true"
EOF
    
    istioctl install -f primary-cluster-config.yaml --verify || error "Failed to install Istio on primary cluster"
    log "Primary cluster setup complete ✓"
}

# Install Istio on remote cluster (Minikube)
install_remote_cluster() {
    log "Installing Istio on remote cluster (cluster2)..."
    
    kubectl config use-context cluster2
    
    # Create istio-system namespace
    kubectl create namespace istio-system --dry-run=client -o yaml | kubectl apply -f -
    
    # Create secret with certificates
    kubectl create secret generic cacerts -n istio-system \
        --from-file=certs/root-cert.pem \
        --from-file=certs/cluster2-cert.pem \
        --from-file=certs/cluster2-key.pem \
        --dry-run=client -o yaml | kubectl apply -f -
    
    # Install Istio with ambient mode
    cat << EOF > remote-cluster-config.yaml
apiVersion: install.istio.io/v1alpha1
kind: IstioOperator
metadata:
  name: remote-cluster
spec:
  profile: ambient
  values:
    global:
      meshID: mesh1
      multiCluster:
        clusterName: cluster2
      network: network1
  components:
    pilot:
      enabled: false
EOF
    
    istioctl install -f remote-cluster-config.yaml --verify || error "Failed to install Istio on remote cluster"
    log "Remote cluster setup complete ✓"
}

# Setup cross-cluster service discovery
setup_cross_cluster() {
    log "Setting up cross-cluster service discovery..."
    
    # Get cluster1 API server address
    kubectl config use-context cluster1
    CLUSTER1_API=$(kubectl config view --minify -o jsonpath='{.clusters[].cluster.server}')
    
    # Create remote secret in cluster1
    kubectl config use-context cluster2
    istioctl x create-remote-secret \
        --name=cluster2 \
        --server="${CLUSTER1_API}" \
        --context=cluster2 | \
        kubectl apply -f - --context=cluster1
    
    log "Cross-cluster setup complete ✓"
}

# Deploy test applications
deploy_test_apps() {
    log "Deploying test applications..."
    
    # Deploy test app in cluster1
    kubectl config use-context cluster1
    cat << EOF | kubectl apply -f -
apiVersion: v1
kind: Namespace
metadata:
  name: test-apps
  labels:
    istio.io/dataplane-mode: ambient
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello-cluster1
  namespace: test-apps
spec:
  replicas: 1
  selector:
    matchLabels:
      app: hello-cluster1
  template:
    metadata:
      labels:
        app: hello-cluster1
    spec:
      containers:
      - name: hello
        image: gcr.io/google-samples/hello-app:1.0
        ports:
        - containerPort: 8080
---
apiVersion: v1
kind: Service
metadata:
  name: hello-cluster1
  namespace: test-apps
spec:
  selector:
    app: hello-cluster1
  ports:
  - port: 8080
    targetPort: 8080
EOF
    
    # Deploy test app in cluster2
    kubectl config use-context cluster2
    cat << EOF | kubectl apply -f -
apiVersion: v1
kind: Namespace
metadata:
  name: test-apps
  labels:
    istio.io/dataplane-mode: ambient
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello-cluster2
  namespace: test-apps
spec:
  replicas: 1
  selector:
    matchLabels:
      app: hello-cluster2
  template:
    metadata:
      labels:
        app: hello-cluster2
    spec:
      containers:
      - name: hello
        image: gcr.io/google-samples/hello-app:2.0
        ports:
        - containerPort: 8080
---
apiVersion: v1
kind: Service
metadata:
  name: hello-cluster2
  namespace: test-apps
spec:
  selector:
    app: hello-cluster2
  ports:
  - port: 8080
    targetPort: 8080
EOF
    
    log "Test applications deployed ✓"
}

# Validate setup
validate_setup() {
    log "Validating setup..."
    
    # Check istio installation
    for context in cluster1 cluster2; do
        kubectl config use-context $context
        istioctl verify-install || warn "Istio verification failed for $context"
    done
    
    # Check test pods
    for context in cluster1 cluster2; do
        kubectl config use-context $context
        kubectl wait --for=condition=ready pod -l app=hello-$context -n test-apps --timeout=120s || \
            error "Test pods not ready in $context"
    done
    
    # Test cross-cluster communication
    kubectl config use-context cluster1
    kubectl run -n test-apps test-pod --rm -i --tty --image=curlimages/curl -- \
        curl hello-cluster2.test-apps.svc.cluster.local:8080 || \
        error "Cross-cluster communication failed"
    
    log "Validation complete ✓"
}

# Main execution
main() {
    log "Starting Istio multicluster ambient mode setup..."
    
    check_prerequisites
    generate_certs
    install_primary_cluster
    install_remote_cluster
    setup_cross_cluster
    deploy_test_apps
    validate_setup
    
    log "Setup completed successfully! 🎉"
    log "You can now access services across clusters using their cluster.local DNS names"
}

# Run main function
main
