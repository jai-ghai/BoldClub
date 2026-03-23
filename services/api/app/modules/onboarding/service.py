from __future__ import annotations

from datetime import UTC, datetime
from urllib.parse import urlparse

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.integrations.media.cloudinary import get_cloudinary_service
from app.models.profile_media import ProfileMedia
from app.models.user import User
from app.modules.matching.service import refresh_profile_embeddings
from app.modules.onboarding.schemas import (
    CompleteOnboardingResponse,
    CreateMediaUploadSignatureRequest,
    CreateMediaUploadSignatureResponse,
    OnboardingMutationResponse,
    OnboardingPlanResponse,
    OnboardingStateSnapshot,
    OnboardingStepDefinition,
    StartOnboardingResponse,
)
from app.repositories.auth_repository import UserRepository
from app.repositories.profile_repository import ProfileRepository
from app.schemas.bootstrap import AccountStatus, OnboardingStepId

STEP_DEFINITIONS = [
    OnboardingStepDefinition(id=OnboardingStepId.BASIC_PROFILE, title="Core identity", required=True, can_skip=False),
    OnboardingStepDefinition(id=OnboardingStepId.MEDIA, title="Photos and intro", required=True, can_skip=False),
    OnboardingStepDefinition(id=OnboardingStepId.PROMPTS, title="Prompts and bio", required=False, can_skip=True),
    OnboardingStepDefinition(id=OnboardingStepId.INTERESTS, title="Interests", required=False, can_skip=True),
    OnboardingStepDefinition(id=OnboardingStepId.LIFESTYLE, title="Lifestyle", required=False, can_skip=True),
    OnboardingStepDefinition(id=OnboardingStepId.PERSONALITY, title="Personality", required=False, can_skip=True),
    OnboardingStepDefinition(id=OnboardingStepId.LOCATION, title="Location", required=False, can_skip=True),
    OnboardingStepDefinition(id=OnboardingStepId.PREFERENCES, title="Discovery preferences", required=True, can_skip=False),
]

REQUIRED_STEPS = {step.id for step in STEP_DEFINITIONS if step.required}
SKIPPABLE_STEPS = {step.id for step in STEP_DEFINITIONS if step.can_skip}
ORDERED_STEPS = [step.id for step in STEP_DEFINITIONS]


def _step(value: str | None) -> OnboardingStepId | None:
    return OnboardingStepId(value) if value else None


def _assert_onboarding_access(user: User) -> None:
    if user.account_status != AccountStatus.ONBOARDING_IN_PROGRESS.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not allowed to access onboarding flows.",
        )


def get_next_step(step_id: OnboardingStepId) -> OnboardingStepId | None:
    current_index = ORDERED_STEPS.index(step_id)

    if current_index == len(ORDERED_STEPS) - 1:
        return None

    return ORDERED_STEPS[current_index + 1]


def _list_to_step_set(values: list[str]) -> set[OnboardingStepId]:
    return {OnboardingStepId(value) for value in values}


def remaining_required_steps(user: User) -> list[OnboardingStepId]:
    completed = _list_to_step_set(user.completed_steps or [])
    remaining = REQUIRED_STEPS.difference(completed)
    return [step_id for step_id in ORDERED_STEPS if step_id in remaining]


def build_state_snapshot(user: User) -> OnboardingStateSnapshot:
    completed = _list_to_step_set(user.completed_steps or [])
    skipped = _list_to_step_set(user.skipped_steps or [])
    return OnboardingStateSnapshot(
        account_status=AccountStatus(user.account_status),
        current_step=_step(user.onboarding_step),
        completed_steps=[step for step in ORDERED_STEPS if step in completed],
        skipped_steps=[step for step in ORDERED_STEPS if step in skipped],
        required_steps_remaining=remaining_required_steps(user),
        is_profile_complete=user.is_profile_complete,
    )


def _guess_media_type(url: str) -> str:
    path = urlparse(url).path.lower()
    if path.endswith((".mp4", ".mov", ".avi", ".mkv", ".webm")):
        return "video"
    return "image"


def _normalize_media_payload(payload: dict[str, object]) -> list[ProfileMedia]:
    raw_assets = payload.get("assets")

    if isinstance(raw_assets, list) and raw_assets:
        media_assets: list[ProfileMedia] = []
        for index, raw_asset in enumerate(raw_assets):
            if not isinstance(raw_asset, dict):
                continue
            delivery_url = str(raw_asset.get("delivery_url") or raw_asset.get("secure_url") or "").strip()
            if not delivery_url:
                continue

            provider_metadata = raw_asset.get("provider_metadata")
            media_assets.append(
                ProfileMedia(
                    storage_provider=str(raw_asset.get("storage_provider") or "cloudinary"),
                    provider_asset_id=str(raw_asset.get("provider_asset_id") or "") or None,
                    provider_public_id=str(raw_asset.get("provider_public_id") or "") or None,
                    resource_type=str(raw_asset.get("resource_type") or _guess_media_type(delivery_url)),
                    mime_type=str(raw_asset.get("mime_type") or "") or None,
                    bytes=int(raw_asset["bytes"]) if raw_asset.get("bytes") is not None else None,
                    width=int(raw_asset["width"]) if raw_asset.get("width") is not None else None,
                    height=int(raw_asset["height"]) if raw_asset.get("height") is not None else None,
                    duration_seconds=float(raw_asset["duration_seconds"]) if raw_asset.get("duration_seconds") is not None else None,
                    position=int(raw_asset.get("position", index)),
                    is_primary=bool(raw_asset.get("is_primary", index == 0)),
                    status=str(raw_asset.get("status") or "ready"),
                    original_url=str(raw_asset.get("original_url") or delivery_url),
                    delivery_url=delivery_url,
                    provider_metadata=provider_metadata if isinstance(provider_metadata, dict) else {},
                )
            )

        if media_assets:
            return media_assets

    legacy_url = str(payload.get("hero_media_url") or "").strip()
    if not legacy_url:
        return []

    return [
        ProfileMedia(
            storage_provider="cloudinary" if "res.cloudinary.com" in legacy_url else "external",
            provider_public_id=None,
            resource_type=_guess_media_type(legacy_url),
            position=0,
            is_primary=True,
            status="ready",
            original_url=legacy_url,
            delivery_url=legacy_url,
            provider_metadata={},
        )
    ]


async def _save_profile_step(
    db: AsyncSession,
    *,
    user: User,
    step_id: OnboardingStepId,
    payload: dict[str, object],
) -> None:
    repository = ProfileRepository(db)
    profile = await repository.get_or_create(user.id)

    if step_id == OnboardingStepId.BASIC_PROFILE:
        profile.basic_profile = payload
    elif step_id == OnboardingStepId.MEDIA:
        media_assets = _normalize_media_payload(payload)
        if not media_assets:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="media requires at least one saved Cloudinary asset or media URL.",
            )
        await repository.replace_media(profile, media_assets)
    elif step_id == OnboardingStepId.PROMPTS:
        profile.prompts = payload
    elif step_id == OnboardingStepId.INTERESTS:
        profile.interests = payload
    elif step_id == OnboardingStepId.LIFESTYLE:
        profile.lifestyle = payload
    elif step_id == OnboardingStepId.PERSONALITY:
        profile.personality = payload
    elif step_id == OnboardingStepId.LOCATION:
        profile.location = payload
    elif step_id == OnboardingStepId.PREFERENCES:
        profile.preferences = payload

    await repository.save(profile)
    profile = await repository.get_by_user_id(user.id, with_relations=True) or profile
    await refresh_profile_embeddings(db, profile)


async def get_plan(user: User) -> OnboardingPlanResponse:
    _assert_onboarding_access(user)
    snapshot = build_state_snapshot(user)
    return OnboardingPlanResponse(**snapshot.model_dump(), steps=STEP_DEFINITIONS)


async def start_onboarding(db: AsyncSession, user: User) -> StartOnboardingResponse:
    _assert_onboarding_access(user)

    if user.onboarding_step is None:
        user.onboarding_step = OnboardingStepId.BASIC_PROFILE.value
        user.last_active_at = datetime.now(UTC)
        await UserRepository(db).save(user)
        await db.commit()

    snapshot = build_state_snapshot(user)
    return StartOnboardingResponse(**snapshot.model_dump())


async def save_step(db: AsyncSession, user: User, step_id: OnboardingStepId, payload: dict[str, object]) -> OnboardingMutationResponse:
    _assert_onboarding_access(user)

    if step_id in REQUIRED_STEPS and not payload:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"{step_id.value} requires payload data before it can be completed.",
        )

    await _save_profile_step(db, user=user, step_id=step_id, payload=payload)

    completed = _list_to_step_set(user.completed_steps or [])
    skipped = _list_to_step_set(user.skipped_steps or [])
    completed.add(step_id)
    skipped.discard(step_id)

    user.completed_steps = [step.value for step in ORDERED_STEPS if step in completed]
    user.skipped_steps = [step.value for step in ORDERED_STEPS if step in skipped]
    next_step = get_next_step(step_id)
    user.onboarding_step = next_step.value if next_step else None
    user.last_active_at = datetime.now(UTC)

    await UserRepository(db).save(user)
    await db.commit()
    snapshot = build_state_snapshot(user)
    return OnboardingMutationResponse(**snapshot.model_dump())


async def skip_step(db: AsyncSession, user: User, step_id: OnboardingStepId) -> OnboardingMutationResponse:
    _assert_onboarding_access(user)

    if step_id not in SKIPPABLE_STEPS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"{step_id.value} cannot be skipped.",
        )

    skipped = _list_to_step_set(user.skipped_steps or [])
    skipped.add(step_id)
    user.skipped_steps = [step.value for step in ORDERED_STEPS if step in skipped]
    next_step = get_next_step(step_id)
    user.onboarding_step = next_step.value if next_step else None
    user.last_active_at = datetime.now(UTC)

    await UserRepository(db).save(user)
    await db.commit()
    snapshot = build_state_snapshot(user)
    return OnboardingMutationResponse(**snapshot.model_dump())


async def complete_onboarding(db: AsyncSession, user: User) -> CompleteOnboardingResponse:
    _assert_onboarding_access(user)

    missing_steps = remaining_required_steps(user)

    if missing_steps:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "message": "Required onboarding steps are incomplete.",
                "required_steps_remaining": [step.value for step in missing_steps],
            },
        )

    user.account_status = AccountStatus.ACTIVE.value
    user.is_profile_complete = True
    user.onboarding_completed_at = datetime.now(UTC)
    user.onboarding_step = None
    user.last_active_at = datetime.now(UTC)

    await UserRepository(db).save(user)
    await db.commit()

    return CompleteOnboardingResponse(
        account_status=AccountStatus.ACTIVE,
        next_route="/(tabs)/discover",
        is_profile_complete=True,
    )


async def create_media_upload_signature(
    user: User,
    payload: CreateMediaUploadSignatureRequest,
) -> CreateMediaUploadSignatureResponse:
    _assert_onboarding_access(user)
    cloudinary = get_cloudinary_service()

    try:
        signature = cloudinary.create_upload_signature(
            user_id=user.id,
            resource_type=payload.resource_type,
            file_name=payload.file_name,
        )
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc)) from exc

    return CreateMediaUploadSignatureResponse(
        cloud_name=signature.cloud_name,
        api_key=signature.api_key,
        timestamp=signature.timestamp,
        signature=signature.signature,
        folder=signature.folder,
        public_id=signature.public_id,
        upload_url=signature.upload_url,
        resource_type=signature.resource_type,
    )
