# Frontend and Backend Alignment

This document keeps the mobile flow and backend modules synchronized.

## Bootstrap Contract

Create one bootstrap endpoint that decides where the app should send the user after launch.

- `GET /v1/bootstrap`

Recommended response fields:

- `user_id`
- `account_status`
- `onboarding_step`
- `is_profile_complete`
- `enabled_tabs`
- `supported_auth_providers`
- `skippable_onboarding_steps`

## Mobile Route Map

- `app/(auth)` for welcome, signup, login, OTP
- `app/(onboarding)` for all profile-creation steps
- `app/(tabs)` for personality, likes, discover, chat, profile
- `app/match/[matchId]` for the match reveal screen
- `app/compatibility/[matchId]` for compatibility details
- `app/chat/[matchId]` for the direct chat screen

## Screen to Module Mapping

| Frontend area | Backend module | Main tables |
| --- | --- | --- |
| Signup, login, OTP | `auth` | `users`, `user_verification` |
| Basic profile step | `onboarding` | `profiles` |
| Media upload step | `onboarding` | `profile_media` |
| Bio and prompts step | `onboarding` | `profile_prompts`, `opening_messages` |
| Interests step | `onboarding` | `interests`, `user_interests` |
| Lifestyle and goals step | `onboarding` | `profiles`, `discovery_preferences` |
| Personality questions | `onboarding` | `personality_answers`, `personality_score` |
| Location step | `onboarding` | `profiles` |
| Discover feed | `discovery` | `profiles`, `likes`, `passes` |
| Swipe actions | `interactions` | `likes`, `passes`, `matches` |
| Match screen | `matches` | `matches` |
| Compatibility screen | `compatibility` | `match_compatibility` |
| Chat list and chat bootstrap | `chat` | `matches` plus Stream metadata |
| Notifications | `notifications` | push tokens and notification records |
| Active profile editing | `profile` | profile-related tables |
| Premium and boosts | `subscriptions` | subscriptions and purchase tables |
| Blocks and reports | `safety` | safety tables |

## API Sequence for Onboarding

1. `POST /v1/auth/signup`
2. `POST /v1/auth/verify-otp`
3. `GET /v1/bootstrap`
4. `POST /v1/onboarding/start`
5. `PUT /v1/onboarding/basic-profile`
6. `PUT /v1/onboarding/media`
7. `PUT /v1/onboarding/prompts`
8. `PUT /v1/onboarding/interests`
9. `PUT /v1/onboarding/lifestyle`
10. `PUT /v1/onboarding/personality`
11. `PUT /v1/onboarding/location`
12. `PUT /v1/onboarding/preferences`
13. `POST /v1/onboarding/complete`
14. `GET /v1/bootstrap`

## Supported Auth Providers

- email
- phone
- Google
- Apple

## Boundary That Must Stay Clean

- `auth` should never become a hidden profile module.
- `onboarding` should own initial profile creation from first draft to completion.
- `profile` should only edit data after the account is active.
