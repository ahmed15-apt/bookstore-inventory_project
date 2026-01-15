---

### 2. `SECURITY.md`
**File Description:** Detailed security hardening and compliance documentation.

```markdown
# Security & Compliance Documentation

This project implements a "Security-by-Design" approach, specifically hardened for the **OpenShift Restricted SCC (Security Context Constraint)**.

## 🔒 Container Hardening

### 1. Non-Privileged Execution
- **Non-Root**: All containers are strictly forbidden from running as root. 
- **UID Mapping**: The Backend runs as UID `1001`, and the Frontend as `101`. On OpenShift, these are dynamically remapped to high-range UIDs while maintaining group membership to `GID 0` for volume access.
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

## 🛡 Network Security

### NetworkPolicy Isolation
We implement a namespace-wide NetworkPolicy (`allow-all-bookstore`):
- **Intra-Namespace traffic**: Allowed for all pods (e.g., Backend can reach MySQL on 3306).
- **Ingress Controller**: Only the OpenShift Ingress Router is permitted to send external traffic to the pods.
- **Default Deny**: Traffic from other namespaces is blocked by default.

## 🔍 Vulnerability Management

### Automated Scanning (Trivy)
The CI/CD pipeline integrates **Trivy** to scan images in the internal OpenShift registry.
- **Scanning Logic**: `trivy image --severity CRITICAL --exit-code 1 --ignore-unfixed <image>`
- **The Gate**: If a critical vulnerability is found, the `deploy-kustomize` task is skipped, preventing insecure code from reaching production.

## 🔑 Secret & Config Management
- **Encryption at Rest**: All database and cache credentials reside in Kubernetes **Opaque Secrets**.
- **First-Boot Init**: Database passwords are set via environment variables only on the first volume initialization, preventing accidental password overrides during pod restarts.

## 📝 Audit & Monitoring
To audit the security status of a running pod:
1. **Logs**: `oc logs deployment/backend` (Checks for unauthorized access attempts).
2. **Scan History**: `tkn pipelinerun logs <run-name> -t scan-backend`.
3. **Permissions**: `oc get rolebindings` (Ensures only the `pipeline` SA has edit rights).
