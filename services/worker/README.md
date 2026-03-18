# Worker Service

This folder is reserved for async background jobs.

## Initial Worker Responsibilities

- generate profile embeddings after onboarding updates
- calculate personality scores
- calculate match compatibility
- refresh recommendation caches
- send notification jobs

These jobs should be triggered by the API but executed asynchronously so the app flow stays fast.
