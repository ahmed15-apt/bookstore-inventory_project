# Bookstore Inventory System (4-Tier Enterprise)

An enterprise-grade Bookstore Inventory application designed for high availability, security, and automation on **OpenShift 4.18**.

## 🏗 System Architecture
The application is architected into four isolated tiers to ensure maximum scalability and fault tolerance:

1.  **Frontend Tier**: 
    - **Engine**: Nginx 1.24 (Alpine)
    - **Port**: 8080 (Non-root)
    - **Function**: Serves the static web UI and proxies API requests to the backend.
2.  **Backend Tier**: 
    - **Engine**: Node.js 18-alpine3.20
    - **Port**: 3000
    - **Function**: RESTful API handling business logic, database orchestration, and Redis caching.
3.  **Cache Tier**: 
    - **Engine**: Redis 7-alpine
    - **Port**: 6379
    - **Function**: In-memory data store for frequently accessed inventory items.
4.  **Database Tier**: 
    - **Engine**: MariaDB 10.11
    - **Port**: 3306
    - **Function**: Persistent storage for bookstore data with automated schema initialization.

## 📂 Project Structure
```text
├── backend/            # Node.js source code & Dockerfile (Multi-stage)
├── frontend/           # HTML/CSS/JS assets, Nginx.conf & Dockerfile
├── database/           # MariaDB Dockerfile & init.sql schema
├── redis/              # Redis Dockerfile optimized for OpenShift
├── openshift/          
│   └── base/           # Kustomize Manifests
│       ├── kustomization.yaml       # Orchestrates all resources
│       ├── backend-deployment.yaml  # API Deployment & Service
│       ├── frontend-deployment.yaml # Web Deployment & Service
│       ├── mysql-statefulset.yaml   # Persistent DB with PVC
│       ├── redis-statefulset.yaml   # Persistent Cache with PVC
│       ├── route.yaml               # OpenShift Route for Frontend
│       ├── backend-ingress.yaml     # K8s Ingress for API
│       ├── network-policy.yaml      # Tier-to-tier isolation
│       └── builds.yaml              # ImageStreams & Binary BuildConfigs
└── pipelines/          
    ├── bookstore-pipeline.yaml      # Tekton Pipeline definition
    ├── pipeline-pvc.yaml            # Shared workspace storage
    └── pipelinerun.yaml             # Execution trigger
