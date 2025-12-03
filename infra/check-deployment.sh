#!/bin/bash
# Health check and deployment verification script

set -e

echo "🔍 NanoSensei Deployment Health Check"
echo "======================================"

# Check if container is running
if docker ps --format '{{.Names}}' | grep -q "^nanosensei-backend$"; then
    echo "✅ Container is running"
    CONTAINER_RUNNING=true
else
    echo "❌ Container is not running"
    CONTAINER_RUNNING=false
fi

# Check container status
if [ "$CONTAINER_RUNNING" = true ]; then
    echo ""
    echo "📊 Container Status:"
    docker ps --filter "name=nanosensei-backend" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
fi

# Check health endpoint
echo ""
echo "🏥 Health Check:"
HEALTH_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" http://localhost:8000/health 2>/dev/null || echo "FAILED")
HTTP_CODE=$(echo "$HEALTH_RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
BODY=$(echo "$HEALTH_RESPONSE" | grep -v "HTTP_CODE")

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Health endpoint responding"
    echo "   Response: $BODY"
else
    echo "❌ Health endpoint failed"
    echo "   HTTP Code: $HTTP_CODE"
    echo "   Response: $BODY"
fi

# Check logs for errors
if [ "$CONTAINER_RUNNING" = true ]; then
    echo ""
    echo "📋 Recent Logs (last 10 lines):"
    docker logs nanosensei-backend --tail 10 2>&1 | tail -10
fi

# Check resource usage
if [ "$CONTAINER_RUNNING" = true ]; then
    echo ""
    echo "💻 Resource Usage:"
    docker stats nanosensei-backend --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"
fi

# Check port binding
echo ""
echo "🔌 Port Binding:"
if netstat -tuln 2>/dev/null | grep -q ":8000"; then
    echo "✅ Port 8000 is listening"
    netstat -tuln 2>/dev/null | grep ":8000"
else
    echo "⚠️  Port 8000 not found in listening ports"
fi

# Get public IP
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo "unknown")
echo ""
echo "🌐 Public IP: $PUBLIC_IP"
echo "   API URL: http://$PUBLIC_IP:8000"
echo "   Docs: http://$PUBLIC_IP:8000/docs"

# Summary
echo ""
echo "======================================"
if [ "$CONTAINER_RUNNING" = true ] && [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Deployment is healthy!"
else
    echo "⚠️  Deployment has issues. Check the details above."
fi
echo "======================================"

