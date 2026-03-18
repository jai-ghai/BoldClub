from fastapi import APIRouter, Depends

from app.core.config import settings
from app.core.dependencies import get_current_session
from app.models.auth_session import AuthSession
from app.modules.account.router import router as account_router
from app.modules.auth.router import router as auth_router
from app.modules.auth.service import SUPPORTED_AUTH_PROVIDERS
from app.modules.chat.router import router as chat_router
from app.modules.compatibility.router import router as compatibility_router
from app.modules.discovery.router import router as discovery_router
from app.modules.matches.router import router as matches_router
from app.modules.onboarding.router import router as onboarding_router
from app.modules.onboarding.service import ORDERED_STEPS, SKIPPABLE_STEPS
from app.schemas.bootstrap import AccountStatus, BootstrapResponse, EnabledTab, OnboardingStepId

api_router = APIRouter(prefix=settings.api_v1_prefix)
SKIPPABLE_ONBOARDING_STEPS = [step for step in ORDERED_STEPS if step in SKIPPABLE_STEPS]


def _build_unauthenticated_bootstrap() -> BootstrapResponse:
    return BootstrapResponse(
        user_id=None,
        account_status=AccountStatus.UNAUTHENTICATED,
        onboarding_step=None,
        is_profile_complete=False,
        enabled_tabs=[],
        supported_auth_providers=SUPPORTED_AUTH_PROVIDERS,
        skippable_onboarding_steps=SKIPPABLE_ONBOARDING_STEPS,
    )


@api_router.get("/bootstrap", response_model=BootstrapResponse)
async def bootstrap(session: AuthSession | None = Depends(get_current_session)) -> BootstrapResponse:
    if session is None or session.user is None:
        return _build_unauthenticated_bootstrap()

    user = session.user

    if user.account_status == AccountStatus.ACTIVE.value:
        enabled_tabs = [
            EnabledTab.PERSONALITY,
            EnabledTab.LIKES,
            EnabledTab.DISCOVER,
            EnabledTab.CHAT,
            EnabledTab.PROFILE,
        ]
    elif user.account_status == AccountStatus.PAUSED.value:
        enabled_tabs = [EnabledTab.PROFILE]
    else:
        enabled_tabs = []

    return BootstrapResponse(
        user_id=user.id,
        account_status=AccountStatus(user.account_status),
        onboarding_step=OnboardingStepId(user.onboarding_step) if user.onboarding_step else None,
        is_profile_complete=user.is_profile_complete,
        enabled_tabs=enabled_tabs,
        supported_auth_providers=SUPPORTED_AUTH_PROVIDERS,
        skippable_onboarding_steps=SKIPPABLE_ONBOARDING_STEPS,
    )


api_router.include_router(auth_router)
api_router.include_router(account_router)
api_router.include_router(onboarding_router)
api_router.include_router(discovery_router)
api_router.include_router(matches_router)
api_router.include_router(compatibility_router)
api_router.include_router(chat_router)
