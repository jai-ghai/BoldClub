from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user
from app.db.session import get_db_session
from app.models.user import User
from app.modules.account.schemas import (
    AccountStateResponse,
    DeleteAccountRequest,
    DeleteAccountResponse,
    PauseAccountRequest,
)
from app.modules.account.service import delete_account, get_account_state, pause_account, resume_account

router = APIRouter(prefix="/account", tags=["account"])


@router.get("/me", response_model=AccountStateResponse)
async def get_account_state_route(user: User = Depends(get_current_user)) -> AccountStateResponse:
    return await get_account_state(user)


@router.post("/pause", response_model=AccountStateResponse)
async def pause_account_route(
    payload: PauseAccountRequest,
    db: AsyncSession = Depends(get_db_session),
    user: User = Depends(get_current_user),
) -> AccountStateResponse:
    return await pause_account(db, user, payload.reason)


@router.post("/resume", response_model=AccountStateResponse)
async def resume_account_route(
    db: AsyncSession = Depends(get_db_session),
    user: User = Depends(get_current_user),
) -> AccountStateResponse:
    return await resume_account(db, user)


@router.delete("", response_model=DeleteAccountResponse)
async def delete_account_route(
    payload: DeleteAccountRequest,
    db: AsyncSession = Depends(get_db_session),
    user: User = Depends(get_current_user),
) -> DeleteAccountResponse:
    return await delete_account(db, user, payload.reason)
