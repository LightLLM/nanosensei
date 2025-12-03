# Deploy NanoSensei Backend to AWS Graviton

This guide walks you through deploying the NanoSensei FastAPI backend to an AWS EC2 Graviton instance (arm64).

## Prerequisites

- AWS account with EC2 access
- SSH key pair for EC2 access
- Basic familiarity with AWS EC2 and Docker

## Quick Start

For a faster deployment experience, see [`DEPLOY_QUICKSTART.md`](DEPLOY_QUICKSTART.md) for a streamlined guide.

## Step-by-Step Deployment

### 1. Launch AWS EC2 Graviton Instance

1. Go to AWS EC2 Console → Launch Instance
2. **Name:** `nanosensei-backend`
3. **AMI:** Choose an arm64-compatible image:
   - **Ubuntu Server 22.04 LTS (arm64)** (recommended)
   - Or **Amazon Linux 2023 (arm64)**
4. **Instance type:** `t4g.small` or `t4g.medium` (Graviton2/3)
   - Graviton instances offer ~40% better price/performance vs x86
5. **Key pair:** Select or create an SSH key pair
6. **Security group:** Create or select a group with:
   - **Inbound rule:** Port 22 (SSH) from your IP
   - **Inbound rule:** Port 8000 (HTTP) from 0.0.0.0/0 (or restrict to your IP)
7. **Storage:** 20 GB should be sufficient
8. Click **Launch Instance**

### 2. Connect to Your Instance

```bash
ssh -i /path/to/your-key.pem ubuntu@<EC2_PUBLIC_IP>
```

For Amazon Linux:
```bash
ssh -i /path/to/your-key.pem ec2-user@<EC2_PUBLIC_IP>
```

### 3. Install Docker

**For Ubuntu:**
```bash
sudo apt-get update
sudo apt-get install -y docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
# Log out and back in for group changes to take effect
```

**For Amazon Linux 2023:**
```bash
sudo yum update -y
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ec2-user
# Log out and back in
```

Verify Docker installation:
```bash
docker --version
docker run --rm arm64v8/hello-world
```

### 4. Clone the Repository

```bash
git clone <your-repo-url> nanosensei
cd nanosensei
```

Or if you need to upload files manually:
```bash
# On your local machine, create a tarball
tar -czf nanosensei.tar.gz nanosensei/

# Upload to EC2
scp -i /path/to/your-key.pem nanosensei.tar.gz ubuntu@<EC2_PUBLIC_IP>:~/

# On EC2, extract
tar -xzf nanosensei.tar.gz
cd nanosensei
```

### 5. Build the Docker Image

```bash
docker build -f infra/Dockerfile.backend.arm64 -t nanosensei-backend .
```

This will build the image optimized for arm64 architecture.

### 6. Run the Container

```bash
docker run -d \
  --name nanosensei-backend \
  -p 8000:8000 \
  --restart unless-stopped \
  nanosensei-backend
```

Or use docker-compose:
```bash
docker-compose up -d
```

### 7. Verify Deployment

Check if the container is running:
```bash
docker ps
docker logs nanosensei-backend
```

Test the health endpoint:
```bash
curl http://localhost:8000/health
```

Or from your local machine:
```bash
curl http://<EC2_PUBLIC_IP>:8000/health
```

### 8. Update Security Group (if needed)

If you can't access the API from outside:
1. Go to EC2 Console → Security Groups
2. Select your instance's security group
3. Edit inbound rules
4. Add rule: Port 8000, Source: 0.0.0.0/0 (or your IP)

### 9. Configure Mobile App

Update `mobile/src/api/BackendClient.ts` to use your EC2 public IP:

```typescript
const API_BASE_URL = 'http://<EC2_PUBLIC_IP>:8000';
```

For production, consider:
- Using a domain name with DNS
- Setting up Nginx as a reverse proxy
- Adding SSL/TLS with Let's Encrypt
- Using an Application Load Balancer (ALB)

## Optional: Production Enhancements

### Use Nginx as Reverse Proxy

1. Install Nginx:
```bash
sudo apt-get install -y nginx
```

2. Configure Nginx:
```bash
sudo nano /etc/nginx/sites-available/nanosensei
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

3. Enable and restart:
```bash
sudo ln -s /etc/nginx/sites-available/nanosensei /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Set Up SSL with Let's Encrypt

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Use Docker Compose for Production

Create `docker-compose.prod.yml`:
```yaml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: infra/Dockerfile.backend.arm64
    restart: always
    ports:
      - "8000:8000"
    volumes:
      - nanosensei-db:/app/data
    environment:
      - ENV=production
```

Run:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Monitoring

### View Logs
```bash
docker logs -f nanosensei-backend
```

### Check Resource Usage
```bash
docker stats nanosensei-backend
```

### Restart Container
```bash
docker restart nanosensei-backend
```

## Troubleshooting

**Container won't start:**
- Check logs: `docker logs nanosensei-backend`
- Verify port 8000 is not in use: `sudo netstat -tulpn | grep 8000`

**Can't access from outside:**
- Verify security group allows port 8000
- Check EC2 instance firewall rules
- Ensure container is binding to 0.0.0.0, not 127.0.0.1

**Database issues:**
- Check volume mount: `docker volume inspect nanosensei-db`
- Verify file permissions

## Cost Optimization

- **Graviton instances** are ~40% cheaper than equivalent x86 instances
- Use `t4g.small` for development/testing
- Consider Reserved Instances for production workloads
- Monitor CloudWatch metrics to right-size your instance

## Next Steps

- Set up automated deployments with GitHub Actions
- Configure CloudWatch logging
- Add health checks and auto-scaling
- Implement backup strategy for database

