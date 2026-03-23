from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user
from app.db.session import get_db_session
from app.models.user import User
from app.modules.onboarding.schemas import (
    CompleteOnboardingResponse,
    CreateMediaUploadSignatureRequest,
    CreateMediaUploadSignatureResponse,
    OnboardingMutationResponse,
    OnboardingPlanResponse,
    SaveStepRequest,
    SkipStepRequest,
    StartOnboardingResponse,
)
from app.modules.onboarding.service import (
    complete_onboarding,
    create_media_upload_signature,
    get_plan,
    save_step,
    skip_step,
    start_onboarding,
)
from app.schemas.bootstrap import OnboardingStepId

router = APIRouter(prefix="/onboarding", tags=["onboarding"])


@router.get("/plan", response_model=OnboardingPlanResponse)
async def get_onboarding_plan(user: User = Depends(get_current_user)) -> OnboardingPlanResponse:
    return await get_plan(user)


@router.post("/start", response_model=StartOnboardingResponse)
async def start_onboarding_route(
    db: AsyncSession = Depends(get_db_session),
    user: User = Depends(get_current_user),
) -> StartOnboardingResponse:
    return await start_onboarding(db, user)


@router.post("/media/upload-signature", response_model=CreateMediaUploadSignatureResponse)
async def create_media_upload_signature_route(
    payload: CreateMediaUploadSignatureRequest,
    user: User = Depends(get_current_user),
) -> CreateMediaUploadSignatureResponse:
    return await create_media_upload_signature(user, payload)


@router.put("/{step_id}", response_model=OnboardingMutationResponse)
async def save_onboarding_step(
    step_id: OnboardingStepId,
    payload: SaveStepRequest,
    db: AsyncSession = Depends(get_db_session),
    user: User = Depends(get_current_user),
) -> OnboardingMutationResponse:
    return await save_step(db, user, step_id, payload.payload)


@router.post("/{step_id}/skip", response_model=OnboardingMutationResponse)
async def skip_onboarding_step(
    step_id: OnboardingStepId,
    _: SkipStepRequest,
    db: AsyncSession = Depends(get_db_session),
    user: User = Depends(get_current_user),
) -> OnboardingMutationResponse:
    return await skip_step(db, user, step_id)


@router.post("/complete", response_model=CompleteOnboardingResponse)
async def complete_onboarding_route(
    db: AsyncSession = Depends(get_db_session),
    user: User = Depends(get_current_user),
) -> CompleteOnboardingResponse:
    return await complete_onboarding(db, user)
