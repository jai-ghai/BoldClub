# Local Run Guide

This document explains how to run the BoldClub frontend and backend locally, what external accounts you should prepare, and which flows are already live.

## Current Repo Status

The app now has a real local path for the main account lifecycle:

- Expo mobile calls the live FastAPI backend for bootstrap, email auth, phone auth, OTP verification, onboarding save and skip actions, onboarding completion, pause account, resume account, delete account, and logout.
- FastAPI uses PostgreSQL-backed persistence for users, OTP challenges, and auth sessions.
- Local CORS is configured for common Expo web ports through `BACKEND_CORS_ORIGINS`.

Current frontend gap to keep in mind:

- Google and Apple auth are supported in the backend contract, but the mobile screen still needs real provider credentials and client-side sign-in wiring for those two flows.

## Accounts You Should Prepare

### Minimum for local development

These are enough to boot the repo and work on it locally:

- local PostgreSQL instance
- local Redis instance
- a recent Node.js LTS release compatible with Expo SDK 55
- Python 3.11 or newer
- Android emulator, iOS simulator, or Expo Go on a real device

### Strongly recommended for real product testing

- OpenAI account
  Used for embeddings, AI chat help, and `gpt-4o-mini` compatibility explanations.
- Google Cloud account
  Needed for Google Sign-In client IDs.
- Apple Developer account
  Needed for Apple Sign-In and proper iOS identity setup.
- Twilio account
  Needed for real phone OTP delivery.
- Resend account
  Needed for real email OTP delivery.
- Stream account
  Needed for real chat sessions.
- Expo account
  Useful for Expo/EAS builds, team workflows, and later deployment.

### Not required yet in the current code, but expected soon

- AWS account or another S3-compatible storage provider
  Needed once media uploads move from planning into implementation.

## Local Prerequisites

Install these on your machine before starting:

- Node.js and npm
- Python 3.11+
- PostgreSQL
- Redis
- Git
- Android Studio or Xcode if you want native emulators

## Backend Setup

### 1. Create backend environment file

From [`services/api/.env.example`](/c:/Users/Minfy/Desktop/AI/Boldclub/services/api/.env.example), create a `.env` file in [`services/api`](/c:/Users/Minfy/Desktop/AI/Boldclub/services/api).

At minimum, set:

- `POSTGRES_DSN`
- `REDIS_URL`
- `JWT_SECRET_KEY`
- `BACKEND_CORS_ORIGINS`

For a fast local start, you can keep:

- `OTP_EMAIL_PROVIDER=development`
- `OTP_SMS_PROVIDER=development`
- `DEMO_OTP_CODE=123456`

That lets you test email and phone verification locally without Twilio or Resend.

### 2. Create Python environment and install dependencies

From [`services/api`](/c:/Users/Minfy/Desktop/AI/Boldclub/services/api):

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -e .
```

### 3. Start PostgreSQL and Redis

Make sure both services are running before starting the API.

Examples:

- PostgreSQL database name: `boldclub`
- Redis default local URL: `redis://localhost:6379/0`

### 4. Run the FastAPI server

From [`services/api`](/c:/Users/Minfy/Desktop/AI/Boldclub/services/api):

```powershell
uvicorn app.main:app --reload
```

Expected local URL:

- API root: `http://127.0.0.1:8000`
- Swagger docs: `http://127.0.0.1:8000/docs`
- Health check: `http://127.0.0.1:8000/health`

### 5. Backend first-run notes

- Tables are auto-created on startup right now because `AUTO_CREATE_TABLES=true`.
- Auth sessions are persisted in the database.
- OTP challenges are persisted in the database.
- Account states now support `pending_verification`, `onboarding_in_progress`, `active`, `paused`, and `deleted`.

## Frontend Setup

### 1. Install mobile dependencies

From [`apps/mobile`](/c:/Users/Minfy/Desktop/AI/Boldclub/apps/mobile):

```powershell
npm install
```

### 2. Create the mobile environment file

Copy [`apps/mobile/.env.example`](/c:/Users/Minfy/Desktop/AI/Boldclub/apps/mobile/.env.example) to `.env` inside [`apps/mobile`](/c:/Users/Minfy/Desktop/AI/Boldclub/apps/mobile).

Set:

- `EXPO_PUBLIC_API_BASE_URL=http://127.0.0.1:8000`

Use a LAN IP instead of `127.0.0.1` if you are testing on a physical device.

### 3. Start Expo

From [`apps/mobile`](/c:/Users/Minfy/Desktop/AI/Boldclub/apps/mobile):

```powershell
npm run dev
```

### 4. Open the app

Use one of these:

- Android emulator
- iOS simulator
- Expo Go on a physical device
- web preview with `npm run web`

## How to Test Right Now

### Backend testing today

Use FastAPI Swagger at `http://127.0.0.1:8000/docs`.

Suggested local flow:

1. `POST /v1/auth/signup`
2. `POST /v1/auth/verify-otp`
3. copy the bearer token
4. call `GET /v1/bootstrap`
5. call onboarding endpoints
6. call `POST /v1/onboarding/complete`
7. call `POST /v1/account/pause`
8. call `POST /v1/account/resume`
9. call `DELETE /v1/account`

### Frontend testing today

Run the Expo app and verify this real flow:

- sign up with `aliya@example.com` or `+15551234567`
- enter the development OTP `123456`
- complete required onboarding steps
- skip optional onboarding steps if desired
- activate the profile
- land in the main tabs
- open profile and pause dating
- resume the account
- delete the account or log out

### Current limitation

The mobile shell is fully connected for email and phone auth plus the main onboarding/account lifecycle, but these client-side flows are still pending:

- Google sign-in UI
- Apple sign-in UI
- real media upload instead of URL placeholders

## Fastest Local Configuration

If you want the quickest working setup with the fewest external accounts:

- use local PostgreSQL
- use local Redis
- keep OTP providers on `development`
- use email or phone auth during testing
- keep Google and Apple for later client-side integration
- leave Stream and OpenAI empty if you are only testing auth, onboarding, pause, and delete flows

## Full Integration Configuration

If you want the most realistic development environment, fill these values in [`services/api/.env.example`](/c:/Users/Minfy/Desktop/AI/Boldclub/services/api/.env.example) and copy them into your real `.env`:

- `OPENAI_API_KEY`
- `STREAM_API_KEY`
- `STREAM_API_SECRET`
- `RESEND_API_KEY`
- `OTP_EMAIL_FROM`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_FROM_NUMBER`
- `GOOGLE_CLIENT_ID`
- `APPLE_CLIENT_ID`

## Suggested Test Accounts

For local development, use simple dedicated test identities:

- email test user: `aliya@example.com`
- phone test user: `+15551234567`
- development OTP code: `123456`

Do not use real production customer accounts during local testing.

## APK and Production Preparation Checklist

Before building a production-ready APK or IPA, you should have:

- OpenAI production key
- Google Sign-In client configuration
- Apple Sign-In configuration
- Twilio SMS setup
- Resend email setup
- Stream chat credentials
- strong `JWT_SECRET_KEY`
- production PostgreSQL
- production Redis
- Expo account and EAS setup
- real object storage for photos and videos
