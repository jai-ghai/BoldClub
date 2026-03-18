# Onboarding Module

This is the canonical owner of first-time profile creation.

## Responsibilities

- create or update the profile draft after authentication
- save step progress
- save skipped-step state
- validate required onboarding data
- mark onboarding complete
- trigger async jobs for embeddings and personality scoring
- block access once the account becomes active so profile editing can move to the profile module
- persist onboarding state in PostgreSQL-backed user lifecycle records

## Planned Endpoint Groups

- `POST /v1/onboarding/start`
- `PUT /v1/onboarding/basic-profile`
- `PUT /v1/onboarding/media`
- `PUT /v1/onboarding/prompts`
- `PUT /v1/onboarding/interests`
- `PUT /v1/onboarding/lifestyle`
- `PUT /v1/onboarding/personality`
- `PUT /v1/onboarding/location`
- `PUT /v1/onboarding/preferences`
- `POST /v1/onboarding/{step}/skip`
- `POST /v1/onboarding/complete`

## Tables Touched

- `profiles`
- `profile_media`
- `profile_prompts`
- `opening_messages`
- `user_interests`
- `personality_answers`
- `personality_score`
- `discovery_preferences`
- `users` for onboarding state only
