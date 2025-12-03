# NanoSensei Quick Start Guide

Get NanoSensei up and running in 5 minutes!

## Prerequisites

- **Node.js 18+** and npm
- **Python 3.11+**
- **Docker** and Docker Compose (for backend)
- **Expo Go** app on your phone (optional, for mobile testing)

## Step 1: Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url> nanosensei
cd nanosensei
```

## Step 2: Start Backend

### Option A: Using Docker Compose (Recommended)

```bash
docker-compose up --build
```

The backend will be available at `http://localhost:8000`

### Option B: Local Python Setup

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
python run_local.py
```

## Step 3: Test Backend

Open your browser and visit:
- API: `http://localhost:8000`
- Docs: `http://localhost:8000/docs`

Or test with curl:
```bash
curl http://localhost:8000/health
```

## Step 4: Run Mobile App

```bash
cd mobile
npm install
npx expo start
```

**Options:**
- Scan QR code with Expo Go app (iOS/Android)
- Press `a` for Android emulator
- Press `i` for iOS simulator
- Press `w` for web (limited functionality)

## Step 5: Configure Mobile App (if needed)

If running on a physical device, update the API URL in `mobile/src/api/BackendClient.ts`:

```typescript
const API_BASE_URL = 'http://<YOUR_COMPUTER_IP>:8000';
```

Find your IP:
- **Windows:** `ipconfig` (look for IPv4 Address)
- **macOS/Linux:** `ifconfig` or `ip addr`

## Troubleshooting

### Backend won't start
- Check if port 8000 is available: `netstat -an | grep 8000`
- Try a different port in `docker-compose.yml` or `run_local.py`

### Mobile app can't connect to backend
- Ensure backend is running
- Check firewall settings
- Use your computer's local IP, not `localhost`
- Verify both devices are on the same network

### Camera not working
- Grant camera permissions when prompted
- On iOS Simulator, camera requires a physical device

## Next Steps

- Read the full [README.md](README.md) for architecture details
- Check [infra/DEPLOY_AWS_GRAVITON.md](infra/DEPLOY_AWS_GRAVITON.md) for AWS deployment
- Explore the codebase:
  - `mobile/src/ai/` - On-device AI inference (simulated)
  - `backend/app/api/` - API endpoints
  - `backend/app/models.py` - Database models

## Need Help?

- Check the README files in each directory
- Review API documentation at `http://localhost:8000/docs`
- Open an issue on GitHub

Happy coding! 🔥

