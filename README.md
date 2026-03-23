# BoldClub

This repository is now organized around one canonical product flow:

`Auth -> Onboarding -> Main App`

The important rule is:

- `Auth` only creates and verifies the account.
- `Onboarding` owns profile creation, media, interests, lifestyle, personality answers, and discovery preferences.
- `Profile` becomes an edit surface only after onboarding is complete.

The source product docs remain in [`docs`](/c:/Users/Minfy/Desktop/AI/Boldclub/docs). The aligned implementation blueprint lives in [`docs/blueprint`](/c:/Users/Minfy/Desktop/AI/Boldclub/docs/blueprint).

## Canonical Stack

- Mobile: React Native with Expo
- API: FastAPI
- Background jobs: Celery workers
- Data: PostgreSQL, Redis, Cloudinary now with an S3-ready storage abstraction
- Real-time chat: Stream
- AI: Gemini embeddings, Gemini-generated compatibility explanations, and backend-owned matching scores

Note: the PRD mentions `Node/Express`, but the final architecture and system breakdown are much more specific around `FastAPI + Celery + PostgreSQL + Redis + Stream`. This scaffold uses that stack as the current source of truth so frontend and backend stay aligned.

## Repo Structure

```text
apps/
  mobile/
    app/
      (auth)/
      (onboarding)/
      (tabs)/
      chat/
      compatibility/
      match/
    src/
      components/
      features/
      lib/
      services/
      state/
      theme/
      types/
services/
  api/
    app/
      core/
      db/
      models/
      schemas/
      modules/
        auth/
        onboarding/
        profile/
        discovery/
        interactions/
        matches/
        compatibility/
        chat/
        notifications/
        subscriptions/
        safety/
    tests/
  worker/
    app/
      tasks/
      pipelines/
contracts/
  api/
  events/
  db/
infra/
  db/
  docker/
  storage/
docs/
  blueprint/
tests/
  e2e/
  integration/
```

## First Planning Docs

- [`01-canonical-product-flow.md`](/c:/Users/Minfy/Desktop/AI/Boldclub/docs/blueprint/01-canonical-product-flow.md)
- [`02-frontend-backend-alignment.md`](/c:/Users/Minfy/Desktop/AI/Boldclub/docs/blueprint/02-frontend-backend-alignment.md)
- [`03-step-by-step-roadmap.md`](/c:/Users/Minfy/Desktop/AI/Boldclub/docs/blueprint/03-step-by-step-roadmap.md)
- [`04-stack-and-experience-decisions.md`](/c:/Users/Minfy/Desktop/AI/Boldclub/docs/blueprint/04-stack-and-experience-decisions.md)
- [`05-local-run-guide.md`](/c:/Users/Minfy/Desktop/AI/Boldclub/docs/blueprint/05-local-run-guide.md)
- [`06-gemini-matching-and-media-plan.md`](/c:/Users/Minfy/Desktop/AI/Boldclub/docs/blueprint/06-gemini-matching-and-media-plan.md)
