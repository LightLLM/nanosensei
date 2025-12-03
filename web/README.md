# NanoSensei Web Frontend

Next.js web application for NanoSensei - an on-device AI skill coach.

## Features

- **Modern Web Interface** built with Next.js 14 and React
- **Camera-based skill analysis** with real-time feedback
- **Session tracking** with backend integration
- **Progress visualization** with statistics and history
- **Responsive design** optimized for desktop and mobile browsers
- **Tailwind CSS** for modern, responsive styling

## Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running (see main README)

## Installation

1. Install dependencies:
```bash
cd web
npm install
```

## Configuration

### Backend API URL

Create a `.env.local` file in the `web/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

For production, set this to your deployed backend URL:
```env
NEXT_PUBLIC_API_URL=http://your-ec2-ip:8000
```

Or update `web/lib/api.ts` directly.

## Running the Application

### Development Mode

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
web/
├── app/
│   ├── page.tsx              # Home page
│   ├── session/
│   │   ├── setup/page.tsx    # Session setup page
│   │   └── camera/page.tsx   # Camera session page
│   ├── progress/page.tsx     # Progress page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── lib/
│   ├── api.ts                # Backend API client
│   └── ai.ts                 # AI inference engine (simulated)
├── components/               # Reusable components (optional)
└── public/                   # Static assets
```

## Pages

1. **Home (`/`)** - Main landing page with navigation
2. **Session Setup (`/session/setup`)** - Select skill type
3. **Camera Session (`/session/camera?skill=...`)** - Main coaching interface
4. **Progress (`/progress`)** - View session history and statistics

## Features

### Camera Functionality

- Uses browser's `getUserMedia` API
- Captures frames from webcam
- Processes images with simulated AI inference
- Displays results in real-time

### Backend Integration

- Connects to FastAPI backend
- Creates and retrieves sessions
- Fetches user progress and statistics
- Error handling for offline/connection issues

### Responsive Design

- Mobile-first approach
- Works on desktop, tablet, and mobile
- Tailwind CSS for consistent styling

## Development

### Adding New Features

1. Create new pages in `app/` directory
2. Add API functions in `lib/api.ts`
3. Update navigation in `app/page.tsx`

### Styling

- Uses Tailwind CSS utility classes
- Custom colors defined in `tailwind.config.js`
- Global styles in `app/globals.css`

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variable: `NEXT_PUBLIC_API_URL`
4. Deploy

### Other Platforms

- **Netlify:** Similar to Vercel
- **AWS Amplify:** For AWS integration
- **Docker:** Build and deploy container

## Troubleshooting

### Camera Not Working

- Ensure HTTPS (required for camera access)
- Check browser permissions
- Try different browser (Chrome recommended)

### API Connection Issues

- Verify backend is running
- Check `NEXT_PUBLIC_API_URL` environment variable
- Check CORS settings in backend

### Build Errors

- Clear `.next` directory: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

## Future Enhancements

- User authentication
- Real-time video streaming
- WebAssembly-based AI models
- Progressive Web App (PWA) support
- Dark mode
- More skill types

## License

Apache-2.0

