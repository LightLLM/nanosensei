# NanoSensei Frontend Architecture

## Current Frontend: Mobile App (React Native)

**Location:** `mobile/` directory

NanoSensei currently has a **mobile app frontend** built with React Native and Expo. This is the primary user interface.

### Frontend Screens

The mobile app has 4 main screens located in `mobile/src/screens/`:

1. **HomeScreen.tsx** - Main entry point
   - App title and description
   - "Start Coaching Session" button
   - "View Progress" button

2. **SessionSetupScreen.tsx** - Skill selection
   - Choose skill type (Drawing, Yoga, Punching, Guitar)
   - Start session button

3. **CameraSessionScreen.tsx** - Main coaching interface
   - Live camera preview
   - Capture frame button
   - Display score and feedback
   - Save session functionality

4. **ProgressScreen.tsx** - User progress tracking
   - Session history
   - Statistics (total sessions, average score)
   - Progress by skill type

### How to View/Run the Frontend

**Option 1: Mobile Device (Recommended)**
```bash
cd mobile
npm install
npx expo start
```
- Scan QR code with Expo Go app (iOS/Android)
- App runs on your phone

**Option 2: iOS Simulator**
```bash
cd mobile
npm install
npx expo start
# Press 'i' for iOS simulator
```

**Option 3: Android Emulator**
```bash
cd mobile
npm install
npx expo start
# Press 'a' for Android emulator
```

**Option 4: Web Browser (Limited)**
```bash
cd mobile
npm install
npx expo start
# Press 'w' for web
```
⚠️ **Note:** Web version has limited functionality (camera may not work)

## Backend API Documentation (Web Interface)

**Location:** Backend provides a web interface for API testing

When the backend is running, visit:
- **API Docs:** http://localhost:8000/docs (Swagger UI)
- **ReDoc:** http://localhost:8000/redoc

This is a **developer interface** for testing the API, not a user-facing frontend.

## No Web Frontend for End Users

Currently, there is **no web-based frontend** for end users. The application is designed as a mobile-first experience.

## If You Want a Web Frontend

If you'd like to add a web frontend for end users, you could:

1. **Build a React Web App** (recommended)
   - Create `web/` directory
   - Use React + TypeScript
   - Share API client with mobile app
   - Deploy to Vercel/Netlify

2. **Build a Next.js App**
   - Full-stack React framework
   - Server-side rendering
   - API routes

3. **Build a Vue.js App**
   - Alternative to React
   - Similar structure

4. **Use the Mobile App on Web**
   - Expo supports web builds
   - Limited camera functionality
   - Good for demos

## Current Architecture

```
┌─────────────────────────────────┐
│   Mobile App (React Native)     │  ← USER FRONTEND
│   - HomeScreen                  │
│   - SessionSetupScreen          │
│   - CameraSessionScreen         │
│   - ProgressScreen              │
└──────────────┬──────────────────┘
               │ HTTP API
               ▼
┌─────────────────────────────────┐
│   FastAPI Backend               │
│   - REST API                    │
│   - /docs (Swagger UI)          │  ← DEVELOPER INTERFACE
│   - Database                    │
└─────────────────────────────────┘
```

## Quick Start to See the Frontend

1. **Start Backend:**
   ```bash
   docker-compose up --build
   ```

2. **Start Mobile App:**
   ```bash
   cd mobile
   npm install
   npx expo start
   ```

3. **View on Device:**
   - Install Expo Go app on your phone
   - Scan the QR code
   - App loads on your device

## File Locations

- **Frontend Code:** `mobile/src/screens/`
- **Navigation:** `mobile/src/navigation/AppNavigator.tsx`
- **Entry Point:** `mobile/App.tsx`
- **Styling:** Inline styles in each screen component

## Summary

✅ **Frontend exists:** Mobile app (React Native)  
❌ **Web frontend:** Not built (mobile-first design)  
✅ **API docs:** Available at `/docs` (developer tool)  

The mobile app IS the frontend - it's just not a web app, it's a native mobile app!

