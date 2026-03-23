# API Service

This folder is the FastAPI backend.

## Module Ownership

- `auth` handles account creation, login, token issuance, and verification.
- `account` handles pause, resume, delete, and self-account state.
- `onboarding` handles all first-time profile creation and partial draft saves.
- `profile` handles edits after the account becomes active.
- `discovery` serves ranked profiles and filters.
- `interactions` handles likes, passes, and super likes.
- `matches` creates and returns matches.
- `compatibility` returns post-match compatibility breakdowns.
- `chat` issues chat tokens and match-chat bootstrap data.
- `notifications` handles push and in-app notification orchestration.
- `subscriptions` handles premium state and paid unlocks.
- `safety` handles reports, blocks, and moderation actions.

## Confirmed Backend Direction

- FastAPI is the backend source of truth.
- Gemini handles embeddings and compatibility explanation flows.
- Cloudinary handles photo and video storage metadata plus signed upload preparation.
- Human-to-human real-time chat can still use Stream while Gemini powers the compatibility layer.

## Phase 2 Status

- bearer session flow is scaffolded for authenticated endpoints
- `GET /v1/bootstrap` now resolves from the current session instead of a static response
- auth supports email, phone, Google, and Apple request shapes
- onboarding endpoints are protected and only available while onboarding is in progress
- discovery, matches, compatibility, and chat stubs require an active account
- environment variables are documented in `services/api/.env.example`

## Phase 3 Direction

- PostgreSQL persistence replaces the temporary in-memory store
- JWT access tokens resolve back to persisted auth sessions
- OTP delivery supports real provider configuration with development fallback
- account lifecycle now includes pause, resume, and soft delete

## Important Boundary

Do not let auth write profile details beyond the minimum identity fields required for account creation. Profile data starts in onboarding.
