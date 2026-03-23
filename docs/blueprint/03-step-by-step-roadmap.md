# Step-by-Step Roadmap

This is the safest build order for the MVP so we do not miss dependencies.

## Phase 1: Foundation

Frontend:

- set up Expo app shell
- create route groups for auth, onboarding, and tabs
- add bootstrap loading state
- define dynamic theme tokens and liquid glass UI primitives
- prepare Reanimated 4 animation utilities

Backend:

- set up FastAPI project structure
- add environment config, auth scaffolding, and module registration
- define bootstrap response contract
- add AI provider settings for Gemini models

Data and infra:

- prepare PostgreSQL, Redis, and Cloudinary-backed media configuration
- add canonical user lifecycle fields

Exit criteria:

- app can decide whether to show auth, onboarding, or tabs

## Phase 2: Auth

Frontend:

- signup, login, OTP, resend OTP
- buttons and flows for email, phone, Google, and Apple

Backend:

- signup and login endpoints
- OTP verification
- JWT or session issuance

Data and infra:

- `users`
- `user_verification`
- token storage strategy

Exit criteria:

- user can create an account and reach onboarding

## Phase 3: Onboarding and Profile Creation

Frontend:

- basic details
- media upload
- prompts
- interests
- lifestyle
- personality questions
- location
- discovery preferences
- skip controls for every skippable step

Backend:

- onboarding start endpoint
- per-step draft save endpoints
- per-step skip endpoints
- onboarding completion endpoint

Data and infra:

- `profiles`
- `profile_media`
- `profile_prompts`
- `opening_messages`
- `user_interests`
- `personality_answers`
- `personality_score`
- `discovery_preferences`

Exit criteria:

- verified user completes onboarding and enters tabs

## Phase 4: Discovery, Swipe, Match, Compatibility

Frontend:

- discover tab
- filters
- swipe actions
- match reveal
- compatibility screen

Backend:

- discovery feed endpoint
- like, pass, super-like endpoints
- match creation logic
- compatibility breakdown endpoint

Data and infra:

- `likes`
- `passes`
- `matches`
- `match_compatibility`
- recommendation cache

Exit criteria:

- active user can discover profiles, like, match, and view compatibility

## Phase 5: Chat and Notifications

Frontend:

- chat list
- chat thread
- match-to-chat handoff

Backend:

- Stream token issuance
- match-chat bootstrap endpoint
- notification triggers

Data and infra:

- Stream integration
- push token storage
- notification job queue

Exit criteria:

- matched users can chat in real time

## Phase 6: Safety, Premium, and Polish

Frontend:

- likes you screen
- premium gates
- report and block actions
- profile editing
- pause account and delete account settings

Backend:

- subscription checks
- block and report endpoints
- profile edit endpoints
- account pause, resume, and delete lifecycle endpoints

Data and infra:

- subscriptions
- purchases
- blocks
- reports

Exit criteria:

- MVP is safe, monetizable, and ready for closed beta

## Phase 7: AI Layer Expansion

Frontend:

- AI prompts
- profile optimization feedback
- coaching surfaces

Backend and workers:

- embeddings pipeline
- ranking improvements
- behavioral learning
- Gemini-based compatibility explanations
- AI chat assist suggestions

Exit criteria:

- the app evolves from MVP into the AI-first differentiator described in the vision docs
