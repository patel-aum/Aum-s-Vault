# Create Istio namespace
kubectl create namespace istio-system --context cluster2

# Create secrets for certificates
kubectl create secret generic cacerts -n istio-system \
  --context cluster2 \
  --from-file=root-cert.pem=./root-cert.pem \
  --from-file=cert-chain.pem=./minikube-cert.pem \
  --from-file=key.pem=./minikube-key.pem \
  --from-file=root-key.pem=./root-key.pem

# Generate remote cluster configuration
cat << EOF > remote-cluster-config.yaml
apiVersion: install.istio.io/v1alpha1
kind: IstioOperator
metadata:
  name: istio-remote
spec:
  profile: ambient
  values:
    global:
      meshID: mesh1
      multiCluster:
        clusterName: cluster2
      network: network1
      remotePilotAddress: 10.0.0.1  # EKS cluster IP
EOF

istioctl install -f remote-cluster-config.yaml --context cluster2
