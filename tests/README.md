# Testing Layout

Use this structure as the project grows:

- `tests/integration` for API and service integration tests
- `tests/e2e` for app-level flows such as auth, onboarding, discovery, match, and chat
- `services/api/tests` for backend unit and module tests close to the API service

The first critical end-to-end test should cover:

`Signup -> OTP -> Onboarding -> Discover -> Like -> Match -> Chat`
