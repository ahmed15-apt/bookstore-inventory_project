# Security & Compliance Documentation

This project implements a "Security-by-Design" approach, specifically hardened for the **OpenShift Restricted SCC (Security Context Constraint)**.

## 🛡 Container Hardening

### 1. Non-Privileged Execution
- **Non-Root**: All containers are strictly forbidden from running as root. 
- **UID Mapping**: The Backend runs as UID `1001`, and the Frontend as `101`. On OpenShift, these are dynamically remapped while maintaining group membership to `GID 0`.
- **Privilege Escalation**: Explicitly disabled via `allowPrivilegeEscalation: false`.

### 2. Filesystem Immutability
- **Read-Only Root**: The root filesystem of every container is mounted as **Read-Only** (`readOnlyRootFilesystem: true`).
- **Writable Paths**: Only essential temporary directories are writable via `emptyDir` volumes:
  - `/tmp` (All tiers)
  - `/var/cache/nginx` (Frontend)
  - `/var/run/mysqld` (Database)

### 3. Attack Surface Reduction
- **Capability Dropping**: All Linux kernel capabilities are dropped (`capabilities: drop: ["ALL"]`).
- **Seccomp**: Uses the `RuntimeDefault` seccomp profile to restrict system calls.

## 🔌 Network Security

### Micro-segmentation
We implement a namespace-wide NetworkPolicy (`allow-all-bookstore`):
- **Intra-Namespace traffic**: Allowed for all pods (e.g., Backend can reach MySQL on 3306).
- **Ingress Controller**: Only the OpenShift Ingress Router is permitted to send external traffic to the pods via the `network.openshift.io/policy-group: ingress` label.

## 🔍 Vulnerability Management

### Automated Scanning (Trivy)
The CI/CD pipeline integrates **Trivy** to scan images in the internal OpenShift registry.
- **Command**: `trivy image --severity CRITICAL --exit-code 1 --ignore-unfixed <image>`
- **The Gate**: The pipeline will fail if any critical vulnerabilities with a known fix are detected in the backend image.

## 🔑 Secret Management
- **Encryption**: All database and cache credentials reside in Kubernetes **Opaque Secrets**.
- **Lifecycle**: Database passwords are set only during the first volume initialization, ensuring persistent security even across pod restarts.
