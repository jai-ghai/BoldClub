from __future__ import annotations

from datetime import UTC, datetime

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.modules.account.schemas import AccountStateResponse, DeleteAccountResponse
from app.modules.auth.service import build_next_route
from app.repositories.auth_repository import SessionRepository, UserRepository
from app.schemas.bootstrap import AccountStatus


def _account_state_response(user: User) -> AccountStateResponse:
    account_status = AccountStatus(user.account_status)
    return AccountStateResponse(
        user_id=user.id,
        account_status=account_status,
        next_route=build_next_route(account_status),
        is_profile_complete=user.is_profile_complete,
    )


async def get_account_state(user: User) -> AccountStateResponse:
    return _account_state_response(user)


async def pause_account(db: AsyncSession, user: User, reason: str | None) -> AccountStateResponse:
    if user.account_status == AccountStatus.DELETED.value:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Deleted accounts cannot be paused.")

    user.account_status = AccountStatus.PAUSED.value
    user.paused_at = datetime.now(UTC)
    user.pause_reason = reason
    await UserRepository(db).save(user)
    await db.commit()
    return _account_state_response(user)


async def resume_account(db: AsyncSession, user: User) -> AccountStateResponse:
    if user.account_status != AccountStatus.PAUSED.value:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only paused accounts can be resumed.")

    user.account_status = (
        AccountStatus.ACTIVE.value if user.is_profile_complete else AccountStatus.ONBOARDING_IN_PROGRESS.value
    )
    user.paused_at = None
    user.pause_reason = None
    await UserRepository(db).save(user)
    await db.commit()
    return _account_state_response(user)


async def delete_account(db: AsyncSession, user: User, reason: str | None) -> DeleteAccountResponse:
    user.account_status = AccountStatus.DELETED.value
    user.deleted_at = datetime.now(UTC)
    user.deletion_reason = reason
    user.onboarding_step = None
    await UserRepository(db).save(user)
    await SessionRepository(db).revoke_all_for_user(user.id)
    await db.commit()
    return DeleteAccountResponse(success=True, next_route="/(auth)")
