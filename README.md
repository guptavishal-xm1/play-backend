# RAMA777 Backend

Production-style Node.js + Express + TypeScript backend for the app startup decision flow.

## Features

- `GET /v1/app/entry-decision`
  - Returns `isQuiz=true` with quiz payload from Open Trivia.
  - Returns `isQuiz=false` with validated redirect URL.
- `GET /health` liveness endpoint.
- Protected admin decision APIs:
  - `GET /v1/admin/decision`
  - `POST /v1/admin/decision` with `x-admin-token` header.
- Security basics: Helmet, rate limiting, structured logs, input validation.

## Quick Start

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
