# Database Notes

The provided database design is strong, but the app flow needs a few canonical additions so auth, onboarding, and active-user states stay clean.

## Recommended Additions

- `users.account_status`
- `users.onboarding_step`
- `users.onboarding_completed_at`
- `users.last_active_at`

Suggested `account_status` values:

- `pending_verification`
- `onboarding_in_progress`
- `active`
- `blocked`
- `deleted`

## Recommended Future Tables

- `user_embeddings` for vector data and embedding metadata
- `push_tokens` for device notification routing
- `blocks` for user safety
- `reports` for moderation
- `subscriptions` for premium access
- `boost_purchases` for add-on monetization

## Ownership Rule

Identity data lives in `users`. Profile data starts after auth and belongs to onboarding and profile modules, not auth.
