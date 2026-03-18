# Profile Module

The profile module is for active users only.

## Responsibilities

- return the public profile view
- return the private self-profile view
- edit profile sections after onboarding
- reorder media
- preview profile completeness

## Rule

If the account is still in onboarding, write operations should stay in the onboarding module so both mobile and backend keep one source of truth for profile creation.
