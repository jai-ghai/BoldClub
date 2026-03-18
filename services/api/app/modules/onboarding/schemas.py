from typing import Any

from pydantic import BaseModel, Field

from app.schemas.bootstrap import AccountStatus, OnboardingStepId


class OnboardingStepDefinition(BaseModel):
    id: OnboardingStepId
    title: str
    required: bool
    can_skip: bool


class OnboardingStateSnapshot(BaseModel):
    account_status: AccountStatus
    current_step: OnboardingStepId | None
    completed_steps: list[OnboardingStepId] = Field(default_factory=list)
    skipped_steps: list[OnboardingStepId] = Field(default_factory=list)
    required_steps_remaining: list[OnboardingStepId] = Field(default_factory=list)
    is_profile_complete: bool = False


class OnboardingPlanResponse(OnboardingStateSnapshot):
    steps: list[OnboardingStepDefinition]


class StartOnboardingResponse(OnboardingStateSnapshot):
    pass


class SaveStepRequest(BaseModel):
    payload: dict[str, Any] = Field(default_factory=dict)


class SkipStepRequest(BaseModel):
    reason: str | None = None


class OnboardingMutationResponse(OnboardingStateSnapshot):
    pass


class CompleteOnboardingResponse(BaseModel):
    account_status: AccountStatus
    next_route: str
    is_profile_complete: bool
