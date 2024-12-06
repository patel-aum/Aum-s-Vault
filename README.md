
# Vaultify Banking Application

Vaultify is a secure, modern banking application built on a microservices architecture that implements hybrid cloud deployment using Amazon EKS and on-premises infrastructure. The system follows banking industry standards and zero-trust security principles.

## Architecture Overview
![AumsVault drawio (1)](https://github.com/user-attachments/assets/b77f1852-ab5d-4a79-953f-e68dc225b335)
### Infrastructure Design
- **Hybrid Cloud Setup**
  - Amazon EKS for non-essential workloads
  - On-premises servers for critical banking operations
  - Secure WireGuard VPN for inter-network communication
  - Zero-trust policy implementation across all services

### Core Microservices
1. **Authentication Service (On-premises)**
   - Centralized authentication system
   - Session management using JWT token 
   - User role and permission management

2. **Transaction Service**
   - Real-time money transfer processing in seconds
   - Transaction logging
   - Integration with Benificairy api to send money to others
3. **Card Authorization Service**
   - Card issuance and management
   - Authorization processing
   - Card lifecycle management

4. **Account Management Service**
   - Account creation and maintenance
   - Automatic account number generation
   - Balance management
   - Account status monitoring

## Security Features

### Data Protection
- Encryption at rest using industry-standard algorithms
- Data encryption using bcrypt 
- Secure key management system
- used secrets to store confedential informations

### Network Security
- WireGuard VPN for secure communication
- Network segmentation, Namespace segmentations 

### Database Security
- On-premises database deployment for sensitive customer data
- Role-based access control
- Database encryption
- database quering using adminer only of onprem

## Key Features

### Performance
- Sub-second transaction processing
- High availability design
- Scalable architecture
- Load balancing across services

### User Experience
- Streamlined login/signup process
- Automatic account number generation
- Instant card issuance
- Real-time transaction notifications

### Administrative Features
- Adminer interface for database management (on-premises only)
- Comprehensive logging and monitoring
- Advanced reporting capabilities
- User activity tracking

## Future Roadmap

### Service Mesh Implementation
- Istio ambient mesh integration planned
- Enhanced mTLS security
- Advanced traffic management
- Reduced overhead compared to traditional service mesh

## Technical Stack

### Infrastructure
- Kubernetes (EKS + On-premises (minikube))
- ECR Private Registry
- Github Actions for CI
- WireGuard VPN
- Docker containerization

### Backend Services
- Microservices architecture
- RESTful APIs
- Event-driven architecture
- NodeJS

### Frontend Services
- Vite (REACT) for frontend
- Tailwind css for UI
