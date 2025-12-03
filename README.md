# 🔥 NanoSensei – On-Device AI Skill Coach

[![CI](https://github.com/YOUR_USERNAME/nanosensei/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/nanosensei/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**NanoSensei** is an on-device AI skill coach designed for Arm-based mobile devices. The app uses your phone's camera to analyze your performance and provide real-time coaching feedback. The backend runs on **AWS Graviton (arm64)** for optimal performance and cost efficiency.

## 🎯 Project Overview

NanoSensei lets users point their mobile camera at themselves or an object and receive:
- A **skill score** (0-100)
- Short **coaching feedback** text

The architecture emphasizes:
- **On-device AI inference** (currently simulated, ready for ExecuTorch/ONNX Runtime Mobile)
- **Arm-based mobile devices** (iOS/Android on Arm processors)
- **AWS Graviton backend** (arm64 EC2 instances for cost-effective scaling)

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Mobile App (React Native/Expo)            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Camera Session → Local AI Inference (Simulated)     │   │
│  │  └─> Score + Feedback                                │   │
│  └──────────────────────────────────────────────────────┘   │
│                          │                                    │
│                          │ HTTP API                           │
└──────────────────────────┼──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│         FastAPI Backend (AWS Graviton EC2 - arm64)          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  User Management │ Session Storage │ Analytics        │   │
│  └──────────────────────────────────────────────────────┘   │
│                          │                                    │
│                          ▼                                    │
│                   SQLite Database                             │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start (Local)

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- Docker and Docker Compose

### 1. Start Backend with Docker Compose

```bash
docker-compose up --build
```

The backend will be available at `http://localhost:8000`

API docs: `http://localhost:8000/docs`

### 2. Run Mobile App

```bash
cd mobile
npm install
npx expo start
```

Scan the QR code with Expo Go app on your phone, or press `a` for Android emulator / `i` for iOS simulator.

**Note:** Update `mobile/src/api/BackendClient.ts` to point to your backend URL (default: `http://localhost:8000` for local dev, or your EC2 IP for production).

## 📦 Project Structure

```
nanosensei/
├── mobile/              # React Native (Expo) app
│   ├── src/
│   │   ├── ai/         # On-device AI inference (simulated)
│   │   ├── api/        # Backend API client
│   │   ├── screens/    # App screens
│   │   └── navigation/ # Navigation setup
│   └── README.md
├── backend/            # FastAPI backend
│   ├── app/
│   │   ├── main.py
│   │   ├── api/        # API routes
│   │   ├── db.py       # Database setup
│   │   ├── models.py   # SQLModel models
│   │   └── schemas.py  # Pydantic schemas
│   └── README.md
├── infra/              # Infrastructure files
│   ├── Dockerfile.backend.arm64
│   └── DEPLOY_AWS_GRAVITON.md
├── docker-compose.yml
└── README.md
```

## ☁️ Deploy Backend to AWS Graviton

**Quick Start:** See [`infra/DEPLOY_QUICKSTART.md`](infra/DEPLOY_QUICKSTART.md) for a streamlined 10-minute deployment guide.

**Full Guide:** See [`infra/DEPLOY_AWS_GRAVITON.md`](infra/DEPLOY_AWS_GRAVITON.md) for detailed instructions and production enhancements.

**Quick summary:**
1. Launch an AWS EC2 Graviton instance (e.g., `t4g.small`) with Ubuntu 22.04 LTS (arm64)
2. SSH into the instance
3. Install Docker
4. Clone the repo and run: `./infra/deploy.sh`
5. Update mobile app API URL to your EC2 public IP

For step-by-step instructions, see [`infra/DEPLOY_QUICKSTART.md`](infra/DEPLOY_QUICKSTART.md)

## 🧪 Testing

NanoSensei includes comprehensive unit and integration tests:

**Backend Tests:**
```bash
cd backend
pip install -r requirements-dev.txt
pytest
```

**Mobile Tests:**
```bash
cd mobile
npm install
npm test
```

See [TESTING.md](TESTING.md) for detailed testing documentation.

## 🔮 Future Work

- **Replace mocked AI** with real ExecuTorch / ONNX Runtime Mobile models
- **Add on-device LLM** for dynamic feedback generation
- **Implement user authentication** (OAuth, JWT)
- **Add real-time video analysis** (streaming inference)
- **Expand skill types** with custom model training
- **Add social features** (leaderboards, sharing)

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a PR.

