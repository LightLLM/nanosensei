# AWS Graviton Deployment Checklist

Use this checklist to ensure a smooth deployment.

## Pre-Deployment

- [ ] AWS account created and accessible
- [ ] EC2 service access enabled
- [ ] SSH key pair created/downloaded
- [ ] Repository cloned or ready to upload
- [ ] EC2 instance budget/limits checked

## Instance Launch

- [ ] Selected **Ubuntu 22.04 LTS (arm64)** or **Amazon Linux 2023 (arm64)**
- [ ] Selected **t4g.small** or **t4g.medium** instance type
- [ ] Created/selected SSH key pair
- [ ] Security group configured:
  - [ ] Port 22 (SSH) from your IP
  - [ ] Port 8000 (HTTP) from 0.0.0.0/0 (or your IP)
- [ ] Instance launched and running
- [ ] Public IP address noted

## SSH Connection

- [ ] SSH key permissions set correctly (chmod 400)
- [ ] Successfully connected to instance
- [ ] Verified architecture: `uname -m` shows `aarch64`

## Docker Installation

- [ ] Docker installed (`docker --version`)
- [ ] Docker service running (`sudo systemctl status docker`)
- [ ] User added to docker group
- [ ] Docker test successful (`docker run --rm arm64v8/hello-world`)

## Application Deployment

- [ ] Repository cloned or uploaded to EC2
- [ ] Navigated to repository root
- [ ] Docker image built successfully
- [ ] Container started and running
- [ ] Container logs checked (no errors)

## Verification

- [ ] Health endpoint responds: `curl http://localhost:8000/health`
- [ ] API docs accessible: `curl http://localhost:8000/docs`
- [ ] External access works: `curl http://<PUBLIC_IP>:8000/health`
- [ ] Security group allows external access

## Mobile App Configuration

- [ ] Updated `mobile/src/api/BackendClient.ts` with EC2 IP
- [ ] Tested mobile app connection
- [ ] Verified API calls work from mobile app

## Post-Deployment

- [ ] Container set to auto-restart (`--restart unless-stopped`)
- [ ] Database volume persisted
- [ ] Monitoring/logging configured (optional)
- [ ] Backup strategy planned (optional)

## Optional Enhancements

- [ ] Domain name configured
- [ ] Nginx reverse proxy set up
- [ ] SSL certificate installed (Let's Encrypt)
- [ ] CloudWatch monitoring enabled
- [ ] Automated backups configured

## Troubleshooting Reference

If deployment fails, check:

1. **Container not starting:**
   ```bash
   docker logs nanosensei-backend
   docker ps -a
   ```

2. **Port not accessible:**
   ```bash
   sudo netstat -tulpn | grep 8000
   # Check security group rules in AWS Console
   ```

3. **Build failures:**
   ```bash
   docker build -f infra/Dockerfile.backend.arm64 -t nanosensei-backend . --no-cache
   ```

4. **Permission issues:**
   ```bash
   sudo usermod -aG docker $USER
   # Log out and back in
   ```

## Quick Commands Reference

```bash
# Check deployment health
./infra/check-deployment.sh

# View logs
docker logs -f nanosensei-backend

# Restart container
docker restart nanosensei-backend

# Stop container
docker stop nanosensei-backend

# Remove container
docker rm nanosensei-backend

# Rebuild and redeploy
docker build -f infra/Dockerfile.backend.arm64 -t nanosensei-backend .
docker stop nanosensei-backend && docker rm nanosensei-backend
docker run -d --name nanosensei-backend -p 8000:8000 --restart unless-stopped -v nanosensei-db:/app/data nanosensei-backend
```

