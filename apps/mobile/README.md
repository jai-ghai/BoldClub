# Mobile App

This folder is the Expo mobile application.

## Navigation Intent

- `app/(auth)` handles phone/email entry and OTP verification.
- `app/(onboarding)` handles every profile creation step after authentication.
- `app/(tabs)` is available only after onboarding is complete.
- `app/match`, `app/compatibility`, and `app/chat` handle match-detail flows outside the tab shell.

## Screen Order

- Auth: welcome, phone/email input, OTP
- Onboarding: name, age, gender, looking for, city, photo, intro, prompt, interests, lifestyle, personality, preferences
- Main tabs: personality, likes, discover, chat, profile

## Rule

Initial profile creation does not belong in auth. It starts only after the user is verified.

## Confirmed Mobile Direction

- Expo SDK 55
- Expo Router route groups
- Reanimated 4 for transitions and ambient motion
- Material 3-inspired dynamic theme generation
- imported white/red prototype UI adapted for Expo Native
- auth options for email, phone, Google, and Apple
- onboarding screens with visible `Skip for now` controls on skippable steps
