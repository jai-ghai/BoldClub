# Stack and Experience Decisions

This file captures the product and engineering decisions confirmed after the initial blueprint.

## Locked Stack

- Backend: FastAPI
- Mobile: Expo SDK 55
- Animations: React Native Reanimated 4
- Theme direction: Material 3-inspired dynamic color generation
- Visual style: liquid glass cards, layered gradients, soft highlights, bold motion
- Real-time chat transport: Stream
- AI layer: Gemini
- Media storage: Cloudinary now, S3-ready later

## Gemini Responsibilities

- profile and personality embeddings
- AI chat assistance and prompt suggestions
- compatibility explanations after a match

## Authentication Requirements

Support these sign-in methods:

- email
- phone number
- Google
- Apple

## Onboarding Experience Rule

Onboarding must feel lightweight, high-polish, and forgiving.

- required steps should be clear
- skippable steps should expose a visible `Skip for now` action
- skipped steps should not be lost
- the app should gracefully improve recommendations as skipped data is filled later

## Mobile Experience Direction

The UI should avoid generic dating-app visuals.

- strong color atmosphere
- animated gradients and floating accents
- glass surfaces with layered translucency
- smooth tab and card transitions
- high-contrast typography for names and match moments
