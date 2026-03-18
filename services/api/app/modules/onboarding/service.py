from __future__ import annotations

from datetime import UTC, datetime

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.modules.onboarding.schemas import (
    CompleteOnboardingResponse,
    OnboardingMutationResponse,
    OnboardingPlanResponse,
    OnboardingStateSnapshot,
    OnboardingStepDefinition,
    StartOnboardingResponse,
)
from app.repositories.auth_repository import UserRepository
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


async def get_plan(user: User) -> OnboardingPlanResponse:
    _assert_onboarding_access(user)
    snapshot = build_state_snapshot(user)
    return OnboardingPlanResponse(**snapshot.model_dump(), steps=STEP_DEFINITIONS)


async def start_onboarding(db: AsyncSession, user: User) -> StartOnboardingResponse:
    _assert_onboarding_access(user)

    if user.onboarding_step is None:
        user.onboarding_step = OnboardingStepId.BASIC_PROFILE.value
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

    completed = _list_to_step_set(user.completed_steps or [])
    skipped = _list_to_step_set(user.skipped_steps or [])
    completed.add(step_id)
    skipped.discard(step_id)

    user.completed_steps = [step.value for step in ORDERED_STEPS if step in completed]
    user.skipped_steps = [step.value for step in ORDERED_STEPS if step in skipped]
    next_step = get_next_step(step_id)
    user.onboarding_step = next_step.value if next_step else None

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

    await UserRepository(db).save(user)
    await db.commit()

    return CompleteOnboardingResponse(
        account_status=AccountStatus.ACTIVE,
        next_route="/(tabs)/discover",
        is_profile_complete=True,
    )
