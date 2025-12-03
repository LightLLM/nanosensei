# Quick Start: Deploy to AWS Graviton

This is a simplified, step-by-step guide to get NanoSensei running on AWS Graviton in under 10 minutes.

## Prerequisites Checklist

- [ ] AWS account with EC2 access
- [ ] SSH key pair (or create one in AWS)
- [ ] Basic terminal/SSH knowledge

## Step 1: Launch EC2 Graviton Instance (5 minutes)

### Via AWS Console:

1. **Go to EC2 Console** → Click "Launch Instance"

2. **Name your instance:**
   - Name: `nanosensei-backend`

3. **Choose AMI (Application and OS Images):**
   - Search for: `Ubuntu Server 22.04 LTS`
   - **IMPORTANT:** Select the one marked **"64-bit (Arm)"** or **"arm64"**
   - Architecture should show: `64-bit (Arm)`

4. **Choose Instance Type:**
   - Filter by: `Graviton`
   - Select: **`t4g.small`** (cheapest, good for testing)
   - Or **`t4g.medium`** for production

5. **Key Pair:**
   - Select existing key pair OR create new one
   - **Download the .pem file** if creating new
   - Save it securely (you'll need it to SSH)

6. **Network Settings:**
   - Click "Edit"
   - **Security Group:** Create new security group
   - **Inbound Rules:**
     - Type: SSH, Port: 22, Source: My IP
     - Type: Custom TCP, Port: 8000, Source: 0.0.0.0/0 (or My IP for testing)

7. **Storage:**
   - Keep default (8 GB) or increase to 20 GB

8. **Launch:**
   - Click "Launch Instance"
   - Wait for instance to be "Running" (green checkmark)

9. **Note the Public IP:**
   - Copy the **Public IPv4 address** (e.g., `54.123.45.67`)

## Step 2: Connect to Your Instance (1 minute)

### On Windows (PowerShell):
```powershell
# Navigate to where your .pem file is
cd C:\path\to\your\key

# Set correct permissions (if needed)
icacls nanosensei-key.pem /inheritance:r

# Connect
ssh -i nanosensei-key.pem ubuntu@<YOUR_PUBLIC_IP>
```

### On macOS/Linux:
```bash
# Set correct permissions
chmod 400 nanosensei-key.pem

# Connect
ssh -i nanosensei-key.pem ubuntu@<YOUR_PUBLIC_IP>
```

**Replace `<YOUR_PUBLIC_IP>` with the IP from Step 1.**

## Step 3: Install Docker (2 minutes)

Once connected, run:

```bash
# Update system
sudo apt-get update

# Install Docker
sudo apt-get install -y docker.io docker-compose

# Start Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add your user to docker group
sudo usermod -aG docker $USER

# Verify installation
docker --version
docker run --rm arm64v8/hello-world
```

**If the hello-world test works, Docker is installed correctly!**

## Step 4: Deploy NanoSensei (2 minutes)

### Option A: Using Git (Recommended)

```bash
# Clone the repository
git clone <YOUR_REPO_URL> nanosensei
cd nanosensei

# Make deploy script executable
chmod +x infra/deploy.sh

# Run deployment script
./infra/deploy.sh
```

### Option B: Using Docker Compose

```bash
# Clone the repository
git clone <YOUR_REPO_URL> nanosensei
cd nanosensei

# Build and run
docker-compose -f infra/docker-compose.prod.yml up -d

# Check status
docker ps
docker logs nanosensei-backend
```

### Option C: Manual Deployment

```bash
# Clone the repository
git clone <YOUR_REPO_URL> nanosensei
cd nanosensei

# Build image
docker build -f infra/Dockerfile.backend.arm64 -t nanosensei-backend .

# Run container
docker run -d \
  --name nanosensei-backend \
  -p 8000:8000 \
  --restart unless-stopped \
  -v nanosensei-db:/app/data \
  nanosensei-backend

# Check logs
docker logs -f nanosensei-backend
```

## Step 5: Verify Deployment (1 minute)

### On the EC2 instance:
```bash
# Check container is running
docker ps

# Test health endpoint
curl http://localhost:8000/health
```

You should see: `{"status":"ok","message":"NanoSensei backend is running"}`

### From your local machine:
```bash
# Replace with your EC2 public IP
curl http://<YOUR_PUBLIC_IP>:8000/health
```

**If this works, your deployment is successful! 🎉**

## Step 6: Update Mobile App

Edit `mobile/src/api/BackendClient.ts`:

```typescript
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:8000'  // Local development
  : 'http://<YOUR_PUBLIC_IP>:8000'; // Production - use your EC2 IP
```

## Troubleshooting

### Can't connect via SSH?
- Check security group allows port 22 from your IP
- Verify you're using the correct key file
- Ensure instance is "Running" (not "Pending")

### Can't access API from outside?
- Check security group allows port 8000
- Verify container is running: `docker ps`
- Check logs: `docker logs nanosensei-backend`

### Container won't start?
- Check logs: `docker logs nanosensei-backend`
- Verify port 8000 is free: `sudo netstat -tulpn | grep 8000`
- Try rebuilding: `docker build -f infra/Dockerfile.backend.arm64 -t nanosensei-backend .`

## Next Steps

- [ ] Set up domain name and DNS
- [ ] Configure Nginx reverse proxy (see `infra/DEPLOY_AWS_GRAVITON.md`)
- [ ] Add SSL with Let's Encrypt
- [ ] Set up automated backups
- [ ] Configure CloudWatch monitoring

## Cost Estimate

- **t4g.small:** ~$0.0168/hour (~$12/month)
- **t4g.medium:** ~$0.0336/hour (~$24/month)
- **Storage (20 GB):** ~$2/month
- **Data transfer:** First 100 GB free, then ~$0.09/GB

**Total for t4g.small:** ~$14-15/month

## Support

For detailed documentation, see:
- `infra/DEPLOY_AWS_GRAVITON.md` - Full deployment guide
- `README.md` - Project overview

