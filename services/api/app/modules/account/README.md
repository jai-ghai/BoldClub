# Account Module

This module owns user lifecycle actions after authentication.

## Responsibilities

- return the current account state
- pause dating activity
- resume a paused account
- soft delete an account

## Notes

- paused accounts should be hidden from dating flows
- deleted accounts should have sessions revoked
- onboarding and discovery logic should respect the account lifecycle state
