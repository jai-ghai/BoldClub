from enum import StrEnum

from pydantic import BaseModel


class AccountStatus(StrEnum):
    UNAUTHENTICATED = "unauthenticated"
    PENDING_VERIFICATION = "pending_verification"
    ONBOARDING_IN_PROGRESS = "onboarding_in_progress"
    ACTIVE = "active"
    PAUSED = "paused"
    BLOCKED = "blocked"
    DELETED = "deleted"


class AuthProvider(StrEnum):
    EMAIL = "email"
    PHONE = "phone"
    GOOGLE = "google"
    APPLE = "apple"


class OnboardingStepId(StrEnum):
    BASIC_PROFILE = "basic-profile"
    MEDIA = "media"
    PROMPTS = "prompts"
    INTERESTS = "interests"
    LIFESTYLE = "lifestyle"
    PERSONALITY = "personality"
    LOCATION = "location"
    PREFERENCES = "preferences"


class EnabledTab(StrEnum):
    PERSONALITY = "personality"
    LIKES = "likes"
    DISCOVER = "discover"
    CHAT = "chat"
    PROFILE = "profile"


class BootstrapResponse(BaseModel):
    user_id: str | None = None
    account_status: AccountStatus
    onboarding_step: OnboardingStepId | None = None
    is_profile_complete: bool
    enabled_tabs: list[EnabledTab]
    supported_auth_providers: list[AuthProvider]
    skippable_onboarding_steps: list[OnboardingStepId]
