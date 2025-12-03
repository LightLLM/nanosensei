#!/bin/bash
# Deployment script for NanoSensei backend on AWS Graviton
# Run this script on your EC2 Graviton instance after cloning the repo

set -e  # Exit on error

echo "🚀 NanoSensei AWS Graviton Deployment Script"
echo "=============================================="

# Check if running on arm64
ARCH=$(uname -m)
if [ "$ARCH" != "aarch64" ]; then
    echo "⚠️  Warning: This script is designed for arm64 (Graviton) instances"
    echo "   Current architecture: $ARCH"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Installing Docker..."
    
    # Detect OS
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS=$ID
    else
        echo "❌ Cannot detect OS. Please install Docker manually."
        exit 1
    fi
    
    if [ "$OS" == "ubuntu" ] || [ "$OS" == "debian" ]; then
        sudo apt-get update
        sudo apt-get install -y docker.io docker-compose
        sudo systemctl start docker
        sudo systemctl enable docker
        sudo usermod -aG docker $USER
        echo "✅ Docker installed. Please log out and back in, then run this script again."
        exit 0
    elif [ "$OS" == "amzn" ] || [ "$OS" == "rhel" ] || [ "$OS" == "centos" ]; then
        sudo yum update -y
        sudo yum install -y docker
        sudo systemctl start docker
        sudo systemctl enable docker
        sudo usermod -aG docker $USER
        echo "✅ Docker installed. Please log out and back in, then run this script again."
        exit 0
    else
        echo "❌ Unsupported OS: $OS. Please install Docker manually."
        exit 1
    fi
fi

echo "✅ Docker is installed: $(docker --version)"

# Verify Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Starting Docker..."
    sudo systemctl start docker
    sleep 2
fi

# Check if we're in the right directory
if [ ! -f "infra/Dockerfile.backend.arm64" ]; then
    echo "❌ Error: infra/Dockerfile.backend.arm64 not found"
    echo "   Please run this script from the nanosensei repository root"
    exit 1
fi

# Build the Docker image
echo ""
echo "📦 Building Docker image for arm64..."
docker build -f infra/Dockerfile.backend.arm64 -t nanosensei-backend:latest .

if [ $? -ne 0 ]; then
    echo "❌ Docker build failed"
    exit 1
fi

echo "✅ Docker image built successfully"

# Stop existing container if running
if docker ps -a --format '{{.Names}}' | grep -q "^nanosensei-backend$"; then
    echo ""
    echo "🛑 Stopping existing container..."
    docker stop nanosensei-backend 2>/dev/null || true
    docker rm nanosensei-backend 2>/dev/null || true
fi

# Run the container
echo ""
echo "🚀 Starting NanoSensei backend container..."
docker run -d \
  --name nanosensei-backend \
  -p 8000:8000 \
  --restart unless-stopped \
  -v nanosensei-db:/app/data \
  nanosensei-backend:latest

if [ $? -ne 0 ]; then
    echo "❌ Failed to start container"
    exit 1
fi

# Wait for container to start
echo ""
echo "⏳ Waiting for container to start..."
sleep 3

# Check container status
if docker ps --format '{{.Names}}' | grep -q "^nanosensei-backend$"; then
    echo "✅ Container is running"
else
    echo "❌ Container failed to start. Checking logs..."
    docker logs nanosensei-backend
    exit 1
fi

# Test health endpoint
echo ""
echo "🏥 Testing health endpoint..."
sleep 2
HEALTH_CHECK=$(curl -s http://localhost:8000/health || echo "FAILED")

if echo "$HEALTH_CHECK" | grep -q "ok"; then
    echo "✅ Health check passed!"
    echo "   Response: $HEALTH_CHECK"
else
    echo "⚠️  Health check failed or slow to respond"
    echo "   Response: $HEALTH_CHECK"
    echo "   Checking logs..."
    docker logs nanosensei-backend --tail 20
fi

# Get instance public IP
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo "unknown")

echo ""
echo "=============================================="
echo "✅ Deployment Complete!"
echo ""
echo "📋 Summary:"
echo "   Container: nanosensei-backend"
echo "   Port: 8000"
echo "   Public IP: $PUBLIC_IP"
echo ""
echo "🔗 Access your API:"
echo "   Health: http://$PUBLIC_IP:8000/health"
echo "   Docs: http://$PUBLIC_IP:8000/docs"
echo ""
echo "📝 Useful commands:"
echo "   View logs: docker logs -f nanosensei-backend"
echo "   Stop: docker stop nanosensei-backend"
echo "   Restart: docker restart nanosensei-backend"
echo "   Status: docker ps | grep nanosensei"
echo ""
echo "⚠️  Don't forget to:"
echo "   1. Configure security group to allow port 8000"
echo "   2. Update mobile app API URL to: http://$PUBLIC_IP:8000"
echo "=============================================="

