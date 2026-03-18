# Auth Module

The auth module owns:

- signup
- login
- OTP verification
- OTP resend
- refresh tokens
- account bootstrap identity
- provider orchestration for email, phone, Google, and Apple
- bearer-session issuance and logout
- persisted auth sessions and JWT access tokens

The auth module does not own:

- profile media
- prompts
- interests
- lifestyle answers
- personality answers
- discovery preferences

Those belong to onboarding.

## Current Dev Note

The backend now supports real OTP provider configuration and real OAuth verification wiring, but the development OTP code remains available for local flow validation.
