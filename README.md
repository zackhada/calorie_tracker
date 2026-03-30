# Calorie Tracker

A voice-powered calorie tracking web app. Speak what you ate and get instant AI-estimated calorie counts. Track your daily intake against a 2,200 kcal goal with automatic date detection and multi-user support.

## How It Works

1. **Sign in** with your Google account
2. **Tap the microphone** and describe what you ate (e.g., "I had a tuna sandwich and a bag of chips")
3. **Claude AI** parses your description and estimates calories, protein, carbs, and fat for each food item
4. **Track your progress** with a visual progress bar toward your 2,200 kcal daily limit
5. **Review history** to see past days' intake at a glance

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + TypeScript + Vite + Tailwind CSS |
| Voice Input | Web Speech API (browser-native, Chrome/Edge) |
| Backend | Node.js + Express + TypeScript |
| AI | Claude API (Anthropic) via `@anthropic-ai/sdk` |
| Database | Firestore (Google Cloud) |
| Auth | Firebase Auth (Google Sign-In) |
| Hosting | Cloud Run (backend) + Firebase Hosting (frontend) |

## Project Structure

```
calorie_tracker/
├── frontend/                  # React SPA
│   ├── src/
│   │   ├── components/        # UI components (Dashboard, VoiceInput, etc.)
│   │   ├── hooks/             # Custom hooks (speech recognition, meals, auth)
│   │   ├── contexts/          # Auth context provider
│   │   ├── types/             # TypeScript interfaces
│   │   └── styles/            # Tailwind global styles
│   ├── vite.config.ts
│   └── package.json
├── backend/                   # Express API server
│   ├── src/
│   │   ├── services/          # Claude AI + Firestore services
│   │   ├── middleware/        # Auth + error handling
│   │   ├── routes/            # API endpoints
│   │   └── types/             # TypeScript interfaces
│   ├── Dockerfile
│   └── package.json
├── firebase.json              # Firebase Hosting config
├── firestore.rules            # Firestore security rules
├── firestore.indexes.json     # Firestore composite indexes
└── .github/workflows/         # CI/CD pipeline
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/log-food` | Submit a food description, get AI calorie estimate, save to database |
| GET | `/api/meals?date=YYYY-MM-DD` | Get all meals for a specific day |
| GET | `/api/daily-summary?date=YYYY-MM-DD` | Get calorie/macro totals for a day |
| GET | `/api/history?startDate=...&endDate=...` | Get daily summaries for a date range |
| DELETE | `/api/meals/:id` | Remove a logged meal |

## Features

- **Voice Input**: Speak naturally about what you ate. The Web Speech API converts speech to text in real-time, with a text input fallback for unsupported browsers.
- **AI Calorie Estimation**: Claude parses vague descriptions ("a big bowl of pasta with some chicken") into structured food items with calorie and macro estimates.
- **Daily Progress Bar**: Visual indicator that changes from green to yellow to red as you approach and exceed your 2,200 kcal limit.
- **Multi-User**: Each user signs in with Google and sees only their own data. Firestore security rules enforce isolation.
- **Automatic Date Detection**: The app uses your browser's local date, so meals are always logged to the correct day regardless of timezone.
- **30-Day History**: Review past days with color-coded calorie totals and meal counts.

## Setup

### Prerequisites

- Node.js 20+
- A Google Cloud project with Firebase enabled
- An Anthropic API key

### 1. Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Add Firebase to your Google Cloud project
3. Enable **Google** sign-in under Authentication > Sign-in method
4. Create a **Firestore** database in Native mode
5. Copy your web app config values

### 3. Set environment variables

**backend/.env**
```
PORT=8080
ANTHROPIC_API_KEY=your-anthropic-api-key
GOOGLE_CLOUD_PROJECT=your-project-id
```

**frontend/.env**
```
VITE_API_URL=http://localhost:8080
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
```

### 4. Run locally

```bash
# Terminal 1 - backend
cd backend && npm run dev

# Terminal 2 - frontend
cd frontend && npm run dev
```

Open http://localhost:5173 in Chrome or Edge.

### 5. Deploy to Google Cloud

```bash
# Backend -> Cloud Run
cd backend
gcloud builds submit --tag gcr.io/PROJECT_ID/calorie-tracker-api
gcloud run deploy calorie-tracker-api \
  --image gcr.io/PROJECT_ID/calorie-tracker-api \
  --platform managed --region us-central1 \
  --allow-unauthenticated \
  --set-secrets "ANTHROPIC_API_KEY=anthropic-api-key:latest"

# Frontend -> Firebase Hosting
cd ../frontend
npm run build
firebase deploy --only hosting
```

## Google Cloud Project

- **Project ID**: `calorie-tracker-zh-2026`
- **Billing**: Linked
- **Enabled APIs**: Firebase, Firestore, Identity Toolkit, Cloud Run, Cloud Build, Artifact Registry

## License

MIT
