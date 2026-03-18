# App Routing

The root app layout should gate navigation using a bootstrap check from the backend.

## Expected Redirect Logic

- If no valid session exists, route into `app/(auth)`.
- If the session exists but `account_status` is not `active`, route into `app/(onboarding)`.
- If the session exists and `account_status` is `active`, route into `app/(tabs)`.

## Planned Route Groups

- `app/(auth)` for authentication only
- `app/(onboarding)` for profile creation only
- `app/(tabs)` for the active user experience
- `app/match/[matchId]`
- `app/compatibility/[matchId]`
- `app/chat/[matchId]`
