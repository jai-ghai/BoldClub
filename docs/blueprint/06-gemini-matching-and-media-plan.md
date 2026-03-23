# Gemini Matching and Media Plan

This document supersedes the earlier OpenAI-first and S3-first planning assumptions for the matching stack.

New backend direction:

- Gemini becomes the AI provider for embeddings and match explanation generation.
- Matching is driven by a deterministic scoring pipeline that uses Gemini embeddings as one major input, not as the only decision-maker.
- Cloudinary becomes the media provider for photos and videos now.
- Media storage stays provider-abstract so we can move to S3 later without rewriting onboarding, discovery, or profile APIs.

## Why This Is the Right Time to Switch

The current backend still has discovery, matches, and compatibility in stub form, so the real ranking engine has not been locked yet.

This migration replaced the earlier OpenAI-specific settings and prepared the Cloudinary media path in the backend.

Earlier repo touchpoints that reflected the old direction:

- `services/api/app/core/config.py` used to expose `OPENAI_*` settings.
- `services/api/app/integrations/openai/client.py` used to provide the old model registry.
- `services/api/app/modules/discovery/router.py` returns static `match_score` demo cards.
- `services/api/app/modules/matches/router.py` returns static `compatibility_score` demo matches.
- `services/api/app/modules/compatibility/router.py` reads the explanation model from the OpenAI config.
- `docs/blueprint/04-stack-and-experience-decisions.md` and `docs/blueprint/05-local-run-guide.md` still describe OpenAI and S3.

Because the real matching engine is not implemented yet, we can switch providers before technical debt hardens around the old plan.

## Product Goal for Matching

The matching system should not be a single black-box similarity score. It should:

- reject obviously bad candidates first
- rank candidates using a blend of semantic similarity and explicit preference fit
- stay explainable enough to show users why a match is strong
- remain tunable without retraining a model every time product priorities change
- avoid overfitting to profile photos or shallow popularity signals

## High-Level Matching Architecture

The matching pipeline will run in five layers:

1. profile normalization
2. Gemini embedding generation
3. candidate filtering and retrieval
4. deterministic reranking
5. explanation generation for mutual matches

### 1. Profile Normalization

Before any embedding call, we will build normalized text blocks from onboarding and profile data. We should not throw every field into one giant prompt.

Instead, create separate text payloads for:

- relationship intent
- personality traits and answers
- interests and hobbies
- lifestyle and routines
- prompts and free-text answers
- partner preferences

This lets us score the pair on multiple dimensions instead of one mixed vector that is hard to debug.

### 2. Gemini Embedding Generation

For each user, generate and store multiple embeddings:

- `intent_embedding`
- `personality_embedding`
- `interests_embedding`
- `lifestyle_embedding`
- `prompt_embedding`
- `preferences_embedding`

Also generate one derived `discovery_embedding` that is a weighted combination of the normalized component vectors for fast candidate retrieval.

Important rule:

- Gemini embeddings help us measure semantic closeness.
- Gemini does not get final control over who is shown.
- Final ranking still comes from backend scoring rules we own.

## Matching Pipeline

### Layer A: Hard Filters

These run before any expensive ranking work. If a candidate fails here, they are out.

Hard filters:

- account must be `active`
- candidate must not be the same user
- blocked, reported, deleted, or paused users are excluded
- mutual gender and preference eligibility must pass
- age range must pass both sides
- distance must be inside the active discovery radius
- hidden or unavailable profiles are excluded
- profiles below minimum completeness can be excluded or heavily downranked
- previously passed users can be excluded for a cooldown window

This keeps the recommendation pool clean and reduces noisy vector comparisons.

### Layer B: Candidate Retrieval

After hard filters, retrieve a broad candidate set. The goal is recall, not final precision.

Recommended first version:

- fetch geographically valid candidates
- fetch only users with fresh embeddings
- rank the first retrieval pass by `discovery_embedding` similarity
- keep the top candidate pool for reranking

This should be implemented in the worker and database layer, not in the FastAPI route directly.

### Layer C: Semantic Vector Scoring

For each candidate pair, calculate cosine similarity for each embedding family and scale each value into `0..1`.

Recommended vector score:

```text
vector_score =
  0.30 * intent_similarity +
  0.20 * personality_similarity +
  0.20 * interests_similarity +
  0.15 * lifestyle_similarity +
  0.10 * prompt_similarity +
  0.05 * preferences_similarity
```

Why this shape:

- relationship intent gets the highest weight because a strong semantic match is useless if the two people want different outcomes
- personality and interests matter next because they improve conversation quality and long-term resonance
- lifestyle matters because friction usually appears there later
- prompt and preference embeddings help break ties without dominating the score

### Layer D: Structured Compatibility Scoring

Semantic similarity alone is not enough. We also need explicit product rules that do not depend on embeddings.

Recommended structured score:

```text
structured_score =
  0.35 * reciprocal_preference_fit +
  0.20 * distance_score +
  0.15 * activity_recency_score +
  0.15 * profile_completeness_score +
  0.10 * media_quality_score +
  0.05 * safety_trust_score
```

Notes:

- `reciprocal_preference_fit` means both sides match each other's declared filters, not just one side
- `distance_score` should reward closer candidates inside the allowed radius without fully eliminating farther ones
- `activity_recency_score` should favor users recently active in discovery
- `profile_completeness_score` should reward profiles with enough information to make a real connection
- `media_quality_score` should reflect whether the profile has usable media, not whether the person is visually "better"
- `safety_trust_score` can later absorb verification and moderation quality signals

### Layer E: Final Ranking

Recommended first formula:

```text
final_match_score =
  (0.75 * vector_score) +
  (0.25 * structured_score) -
  exposure_penalty -
  stale_profile_penalty
```

Extra ranking rules:

- add an exposure penalty if the same profile has been shown too often recently
- add a stale profile penalty if embeddings or profile activity are outdated
- apply a diversity pass after ranking so the top feed is not filled with near-duplicates

The final score should be stored alongside a factor breakdown so the system stays debuggable.

## Match Creation Logic

Discovery ranking and match creation are related but not identical.

- discovery ranking decides who gets shown first
- a mutual like creates the match
- once a match is created, we save the most important factor scores used at that time

When a mutual like happens:

1. read the existing pairwise score breakdown
2. persist a match record
3. persist the top contributing factors
4. generate a short Gemini explanation from those saved factors

Important rule:

- Gemini explains the match.
- Gemini does not invent the match score after the fact.

That keeps explanations consistent with the actual backend logic.

## What Data We Need to Store

### Recommended Tables

These align with the current repo direction and the existing `contracts/db/README.md` note about `user_embeddings`.

- `profiles`
- `profile_media`
- `discovery_preferences`
- `user_embeddings`
- `likes`
- `passes`
- `matches`
- `match_scores`
- `match_explanations`
- `blocks`
- `reports`

### `user_embeddings`

Recommended fields:

- `user_id`
- `embedding_kind`
- `provider`
- `model`
- `embedding_version`
- `vector`
- `source_hash`
- `generated_at`

Store one row per embedding kind so we can refresh only the pieces affected by a profile edit.

### `match_scores`

Recommended fields:

- `viewer_user_id`
- `candidate_user_id`
- `vector_score`
- `structured_score`
- `final_match_score`
- `intent_similarity`
- `personality_similarity`
- `interests_similarity`
- `lifestyle_similarity`
- `prompt_similarity`
- `preferences_similarity`
- `reciprocal_preference_fit`
- `distance_score`
- `activity_recency_score`
- `profile_completeness_score`
- `media_quality_score`
- `safety_trust_score`
- `scored_at`

This makes the ranking pipeline inspectable and easy to tune.

## Worker Responsibilities

The worker service is the right place for the heavy matching jobs.

New worker responsibilities:

- rebuild embeddings after onboarding completion or profile edits
- refresh the derived `discovery_embedding`
- score candidate pools in the background
- refresh recommendation caches
- generate Gemini-based explanation text for newly created matches

Trigger points:

- onboarding completion
- profile text edits
- interest and lifestyle edits
- preference changes
- media changes
- location updates

## Gemini Integration Shape

Replace the current OpenAI integration with a provider module dedicated to Gemini.

Planned backend structure:

- `services/api/app/integrations/gemini/`
- `services/api/app/integrations/media/cloudinary.py`
- `services/worker/app/tasks/embeddings.py`
- `services/worker/app/tasks/matching.py`

Configuration now uses Gemini-specific settings such as:

- `GEMINI_API_KEY`
- `GEMINI_EMBEDDING_MODEL`
- `GEMINI_TEXT_MODEL`
- `GEMINI_COMPATIBILITY_MODEL`
- `EMBEDDING_VERSION`

Recommendation:

- keep the compatibility explanation model separate from the embedding model in config, even if both are Gemini, so we can tune cost and latency independently

## Cloudinary Media Plan

Cloudinary will be the media system for now because it handles image and video upload, transformation, and delivery well for an early product.

### Cloudinary Responsibilities

- signed uploads from mobile clients
- media transformation and delivery URLs
- image and video metadata capture
- thumbnail generation
- moderation-ready hooks if we add them later

### Backend Design Rule

Do not let the rest of the backend talk directly in Cloudinary terms.

Instead, introduce a storage abstraction with operations like:

- create upload signature
- finalize asset metadata
- build delivery URL
- delete asset

That gives us a clean future path to S3.

### `profile_media` Design

Store provider-neutral fields:

- `id`
- `user_id`
- `storage_provider`
- `provider_asset_id`
- `provider_public_id`
- `resource_type`
- `mime_type`
- `bytes`
- `width`
- `height`
- `duration_seconds`
- `position`
- `is_primary`
- `status`
- `original_url`
- `delivery_url`
- `created_at`

For Cloudinary now:

- `storage_provider = cloudinary`
- `provider_public_id` and `delivery_url` map directly to Cloudinary assets

For S3 later:

- `storage_provider = s3`
- the same record shape still works with bucket and object key based resolution

## Media API Direction

Recommended onboarding media flow:

1. mobile asks the backend for signed upload parameters
2. backend creates an upload intent and returns Cloudinary upload details
3. mobile uploads directly to Cloudinary
4. backend finalizes the uploaded asset and stores metadata in `profile_media`
5. discovery and profile endpoints return normalized delivery URLs from the storage service

This avoids routing large media files through FastAPI while keeping the backend in control of ownership and metadata.

## How Explanations Should Work

Compatibility explanations should be grounded in saved factors, not raw LLM improvisation.

Prompt pattern:

- pass Gemini the saved factor breakdown
- ask for a short explanation tied only to those factors
- forbid unsupported claims
- return a short summary plus a few concrete reasons

Example source factors:

- strong intent alignment
- similar conversation style from prompts
- overlap in lifestyle routines
- shared interests

This preserves product trust because the explanation stays close to the actual score.

## Bias and Quality Guardrails

The first version should avoid risky shortcuts.

- do not rank users by photo attractiveness
- do not let popularity dominate compatibility
- do not let the LLM decide final match ordering
- do not show low-quality profiles just because their vector similarity is high
- do not treat missing optional answers as automatic incompatibility

Instead:

- use photos for media quality, moderation, and presentation
- use text, preferences, and behavioral freshness for matching
- treat skipped onboarding fields as incomplete signals, not negative signals

## Implementation Order

### Phase 1: Provider Swap

- remove OpenAI dependency and config from the API service
- add Gemini integration module and config
- add provider-neutral embedding and explanation interfaces

### Phase 2: Media Foundation

- add Cloudinary config and storage provider module
- add upload intent and media finalization endpoints
- persist provider-neutral media records

### Phase 3: Matching Data Layer

- add `user_embeddings`, `match_scores`, and related persistence
- add worker tasks for embedding generation and ranking refresh

### Phase 4: Discovery and Match Logic

- replace discovery stubs with scored candidate retrieval
- replace match stubs with persisted match records
- replace compatibility stub with Gemini explanation generated from saved factors

### Phase 5: Tuning

- calibrate weights using real interaction data
- add diversity and exposure controls
- monitor acceptance rate, message starts, and unmatch signals

## Success Criteria

The plan is working if:

- discovery feed ranking is explainable and tunable
- profile updates refresh embeddings without full rebuilds
- mutual matches carry a saved score breakdown
- compatibility text is generated from backend facts, not pure LLM guesswork
- media uploads work through Cloudinary now
- moving to S3 later only requires a new storage provider implementation, not an API redesign

## Summary

This plan makes Gemini important where it should be important: semantic understanding and grounded explanation.

The matching engine itself stays under backend control through hard filters, weighted scoring, and stored factor breakdowns.

Cloudinary solves media delivery now, while a storage abstraction keeps the future S3 migration straightforward.
