# RAMA777 Backend

Production-style Node.js + Express + TypeScript backend for the app startup decision flow.

## Deployment

Deployed on Vercel at: https://play-backend.vercel.app

### Vercel Configuration

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Runtime**: Node.js 20.x
- **Memory**: 1024MB
- **Timeout**: 30 seconds
- **Environment**: Auto-loads from Vercel project settings

## Features

- `GET /v1/app/entry-decision`
  - Returns `isQuiz=true` with quiz payload from Open Trivia.
  - Returns `isQuiz=false` with validated redirect URL.
  - **10-second timeout** on Open Trivia API calls to prevent hangs.
- `GET /health` and `GET /api/health` liveness endpoints.
- Protected admin decision APIs:
  - `GET /v1/admin/decision`
  - `POST /v1/admin/decision` with `x-admin-token` header.
- Security basics: Helmet, rate limiting, structured logs, input validation.

## Quick Start (Local)

1. Copy env file:

```bash
cp .env.example .env
```

2. Install dependencies:

```bash
npm install
```

3. Start development server:

```bash
npm run dev
```

Server runs on `http://localhost:8080` by default.

## API Example

### Entry decision (app startup)

```http
GET /v1/app/entry-decision
```

Success response:

```json
{
  "success": true,
  "data": {
    "isQuiz": true,
    "redirectUrl": null,
    "quiz": {
      "title": "Daily Challenge Quiz",
      "questions": [
        {
          "id": "1712759700000-1",
          "question": "What is 2 + 2?",
          "options": ["3", "4", "5", "6"],
          "correctAnswer": "4"
        }
      ]
    },
    "decisionSource": "default",
    "timestamp": "2026-04-10T12:00:00.000Z"
  }
}
```

### Admin toggle decision

```http
POST /v1/admin/decision
x-admin-token: your-token
Content-Type: application/json

{
  "isQuiz": false,
  "redirectUrl": "https://www.google.com"
}
```

## Important Notes

### In-Memory State
- Current implementation uses in-memory state for admin overrides.
- **Limitation**: State resets on cold starts (new deployments, idle periods).
- **Recommendation**: For production, migrate to persistent storage (PostgreSQL, MongoDB, or Vercel KV).

### Environment Variables
- Required: `APP_ADMIN_TOKEN` (must be 8+ characters)
- Required: `DEFAULT_REDIRECT_URL` and `REDIRECT_ALLOWED_HOSTS`
- All environment variables are configured in Vercel project settings.

### Timeouts
- Open Trivia API requests: **10 seconds**
- Vercel function timeout: **30 seconds**
- If Open Trivia is unreachable, the API returns a 504 error after 10 seconds instead of hanging forever.

### Health Checks
- Vercel monitors `/api/health` endpoint
- Local debugging: `GET /health` returns uptime and boot status

