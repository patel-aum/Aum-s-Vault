mkdir -p certs
cd certs

# Generate root key
openssl genrsa -out root-key.pem 4096

# Generate root certificate
openssl req -x509 -new -nodes -key root-key.pem -days 3650 -out root-cert.pem -subj "/O=Istio/CN=Root CA"

# Generate intermediate certificates for both clusters
for cluster in eks minikube; do
  openssl genrsa -out ${cluster}-key.pem 4096
  openssl req -new -key ${cluster}-key.pem -out ${cluster}-csr.pem -subj "/O=Istio/CN=${cluster} Intermediate CA"
  openssl x509 -req -in ${cluster}-csr.pem -CA root-cert.pem -CAkey root-key.pem -CAcreateserial -out ${cluster}-cert.pem -days 3650
done
