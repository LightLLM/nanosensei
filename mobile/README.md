# NanoSensei Mobile App

React Native (Expo) mobile application for NanoSensei - an on-device AI skill coach optimized for Arm-based mobile devices.

## Features

- **On-device AI inference** (currently simulated, ready for ExecuTorch/ONNX Runtime Mobile)
- **Camera-based skill analysis** with real-time feedback
- **Session tracking** with local storage and backend sync
- **Progress visualization** with statistics and history
- **Multiple skill types** (Drawing, Yoga, Punching, Guitar)

## Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (installed globally or via npx)
- Expo Go app on your phone (for testing) or iOS Simulator / Android Emulator

## Installation

1. Install dependencies:
```bash
cd mobile
npm install
```

## Running the App

### Development Mode

```bash
npx expo start
```

This will:
- Start the Expo development server
- Show a QR code you can scan with Expo Go (iOS/Android)
- Provide options to open in iOS Simulator (`i`) or Android Emulator (`a`)

### Platform-Specific

```bash
# iOS
npm run ios

# Android
npm run android

# Web (limited functionality)
npm run web
```

## Configuration

### Backend API URL

Update the API base URL in `src/api/BackendClient.ts`:

```typescript
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:8000'  // Local development
  : 'http://your-ec2-ip:8000'; // Production
```

**Note:** For local development with a physical device:
- Use your computer's local IP address instead of `localhost`
- Ensure your phone and computer are on the same network
- Example: `http://192.168.1.100:8000`

## Architecture

### On-Device AI Inference

The AI inference is currently **simulated** but structured to easily integrate real on-device models:

- **Location:** `src/ai/LocalInferenceEngine.ts`
- **Current:** Mock inference with deterministic scoring
- **Future:** ExecuTorch, ONNX Runtime Mobile, or TensorFlow Lite

The inference engine:
- Accepts frame metadata (image URI, dimensions, timestamp)
- Returns score (0-100) and feedback text
- All processing happens locally (no cloud calls)

### Data Storage

- **Local:** AsyncStorage for offline-first experience
- **Backend:** FastAPI backend for persistence and analytics
- **Sync:** Automatic sync when backend is available

### Navigation

Uses React Navigation with a stack navigator:
- Home → Session Setup → Camera Session → Progress

## Project Structure

```
mobile/
├── src/
│   ├── ai/              # On-device AI inference engine
│   │   └── LocalInferenceEngine.ts
│   ├── api/             # Backend API client
│   │   └── BackendClient.ts
│   ├── navigation/      # Navigation setup
│   │   └── AppNavigator.tsx
│   ├── screens/         # App screens
│   │   ├── HomeScreen.tsx
│   │   ├── SessionSetupScreen.tsx
│   │   ├── CameraSessionScreen.tsx
│   │   └── ProgressScreen.tsx
│   ├── types/           # TypeScript types
│   │   └── index.ts
│   └── ...
├── App.tsx              # App entry point
└── package.json
```

## Future Integration: ExecuTorch

To integrate ExecuTorch for real on-device inference:

1. **Install ExecuTorch:**
```bash
npm install @pytorch/executorch
```

2. **Update `LocalInferenceEngine.ts`:**
```typescript
import { loadModel, runInference } from '@pytorch/executorch';

// Load model
const model = await loadModel('skill_model.pte');

// Run inference
const tensor = preprocessFrame(frameMeta);
const output = await model.forward(tensor);
const score = postprocessScore(output);
```

3. **Add model file** to `assets/models/` and configure in `app.json`

## Testing

The app works offline with local storage. Backend sync is optional and won't break the app if the backend is unavailable.

## Troubleshooting

**Camera not working:**
- Ensure camera permissions are granted
- Check that `expo-camera` is properly installed
- On iOS Simulator, camera requires a physical device

**Backend connection issues:**
- Verify backend is running: `curl http://localhost:8000/health`
- Check API URL in `BackendClient.ts`
- For physical devices, use your computer's local IP, not `localhost`

**Build errors:**
- Clear cache: `npx expo start -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`

## Arm Optimization Notes

This app is designed for Arm-based mobile devices:
- **iOS:** All modern iPhones/iPads use Arm processors
- **Android:** Most modern Android devices use Arm processors
- **Models:** Future ExecuTorch/ONNX models will be compiled for Arm architecture

## License

MIT

