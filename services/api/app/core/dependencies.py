from __future__ import annotations

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import decode_token
from app.db.session import get_db_session
from app.models.auth_session import AuthSession
from app.models.user import User
from app.repositories.auth_repository import SessionRepository
from app.schemas.bootstrap import AccountStatus

bearer_scheme = HTTPBearer(auto_error=False)


async def get_current_session(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: AsyncSession = Depends(get_db_session),
) -> AuthSession | None:
    if credentials is None:
        return None

    try:
        token_payload = decode_token(credentials.credentials, expected_type="access")
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid access token.") from None

    auth_session = await SessionRepository(db).get_active_by_id(token_payload.session_id)

    if auth_session is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session is invalid or expired.")

    return auth_session


async def get_current_user(session: AuthSession | None = Depends(get_current_session)) -> User:
    if session is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required.")

    user = session.user

    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session is invalid.")

    if user.account_status == AccountStatus.DELETED.value:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Account is no longer available.")

    return user


async def get_active_user(user: User = Depends(get_current_user)) -> User:
    if user.account_status != AccountStatus.ACTIVE.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Active account required for this resource.",
        )

    return user
