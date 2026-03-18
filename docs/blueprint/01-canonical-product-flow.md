# Canonical Product Flow

This file merges the provided PRD, user flows, database design, architecture, vision, feature breakdown, and UI design into one implementation flow.

## Core Rule

Profile creation happens after authentication, inside onboarding.

That means:

- Auth creates and verifies the account.
- Onboarding creates the user profile and all related detail records.
- Profile is an edit surface only after onboarding is completed.

## Canonical User States

1. `unauthenticated`
2. `pending_verification`
3. `onboarding_in_progress`
4. `active`
5. `blocked`

## Routing Logic

1. If the user has no valid session, show auth.
2. If the user has a session but is not verified, keep them in auth verification.
3. If the user is verified but onboarding is incomplete, route them into onboarding.
4. If onboarding is complete, unlock the main app tabs.

## Final App Flow

1. Signup or login
2. OTP verification
3. Start onboarding
4. Fill basic profile details
5. Upload media
6. Add bio and prompts
7. Select interests
8. Fill lifestyle and dating-goal details
9. Answer personality questions
10. Grant or skip location permission
11. Save discovery preferences
12. Mark onboarding complete
13. Enter main app
14. Discover profiles
15. Like or pass
16. Match
17. View compatibility optionally
18. Start chat

## Skippable Onboarding Rules

The onboarding flow should support `Skip for now` on enrichment steps without breaking the main activation path.

Recommended minimum required steps:

- basic profile
- one profile photo
- core dating preferences

Recommended skippable steps:

- prompts
- optional media beyond the first item
- interests
- lifestyle details
- personality questions
- location permission

If a user skips a step:

- save the skip state explicitly
- keep the step editable later from onboarding or profile
- reduce recommendation quality gracefully instead of blocking entry

## Onboarding Data Ownership

Use onboarding to create and save these records:

- `profiles`
- `profile_media`
- `profile_prompts`
- `opening_messages`
- `user_interests`
- `personality_answers`
- `personality_score`
- `discovery_preferences`

Use the `users` table only for account and lifecycle state:

- account identity
- verification state
- onboarding state
- timestamps

## Post-Onboarding Tabs

The locked main experience should follow the final UI direction:

1. Personality
2. Likes You
3. Discover
4. Chat
5. Profile

## Match and Chat Flow

1. User likes another profile
2. Backend stores the interaction
3. Backend checks for mutual like
4. If mutual, backend creates a match
5. Backend triggers compatibility scoring
6. Backend issues chat bootstrap data
7. Frontend shows match screen
8. User can open compatibility or go directly to chat

Compatibility stays optional and should never block chat.
