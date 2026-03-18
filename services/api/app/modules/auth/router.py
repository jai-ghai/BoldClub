from fastapi import APIRouter, Depends
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import bearer_scheme
from app.core.security import decode_token
from app.db.session import get_db_session
from app.modules.auth.schemas import (
    AuthSessionResponse,
    LoginRequest,
    LogoutResponse,
    ResendOtpRequest,
    SignupRequest,
    VerifyOtpRequest,
)
from app.modules.auth.service import SUPPORTED_AUTH_PROVIDERS, login, logout, resend_otp, signup, verify_otp
from app.schemas.bootstrap import AuthProvider

router = APIRouter(prefix="/auth", tags=["auth"])


@router.get("/providers", response_model=list[AuthProvider])
async def list_auth_providers() -> list[AuthProvider]:
    return SUPPORTED_AUTH_PROVIDERS


@router.post("/signup", response_model=AuthSessionResponse)
async def signup_route(
    payload: SignupRequest,
    db: AsyncSession = Depends(get_db_session),
) -> AuthSessionResponse:
    return await signup(db, payload)


@router.post("/login", response_model=AuthSessionResponse)
async def login_route(
    payload: LoginRequest,
    db: AsyncSession = Depends(get_db_session),
) -> AuthSessionResponse:
    return await login(db, payload)


@router.post("/verify-otp", response_model=AuthSessionResponse)
async def verify_otp_route(
    payload: VerifyOtpRequest,
    db: AsyncSession = Depends(get_db_session),
) -> AuthSessionResponse:
    return await verify_otp(db, payload)


@router.post("/resend-otp", response_model=AuthSessionResponse)
async def resend_otp_route(
    payload: ResendOtpRequest,
    db: AsyncSession = Depends(get_db_session),
) -> AuthSessionResponse:
    return await resend_otp(db, payload)


@router.post("/logout", response_model=LogoutResponse)
async def logout_route(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: AsyncSession = Depends(get_db_session),
) -> LogoutResponse:
    session_id: str | None = None

    if credentials is not None:
        try:
            session_id = decode_token(credentials.credentials, expected_type="access").session_id
        except Exception:
            session_id = None

    return await logout(db, session_id)
