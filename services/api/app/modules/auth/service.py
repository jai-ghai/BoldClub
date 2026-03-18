from __future__ import annotations

from datetime import UTC, datetime, timedelta

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.security import (
    get_demo_otp_code,
    hash_password,
    hash_value,
    issue_access_token,
    issue_refresh_token,
    verify_hash,
    verify_password,
)
from app.integrations.identity.providers import verify_oauth_identity
from app.integrations.otp.service import get_otp_gateway
from app.models.user import User
from app.modules.auth.schemas import (
    AuthSessionResponse,
    LoginRequest,
    LogoutResponse,
    OtpPurpose,
    ResendOtpRequest,
    SignupRequest,
    VerifyOtpRequest,
)
from app.repositories.auth_repository import OtpChallengeRepository, SessionRepository, UserRepository
from app.schemas.bootstrap import AccountStatus, AuthProvider, OnboardingStepId

SUPPORTED_AUTH_PROVIDERS = [
    AuthProvider.EMAIL,
    AuthProvider.PHONE,
    AuthProvider.GOOGLE,
    AuthProvider.APPLE,
]


def _status(value: str) -> AccountStatus:
    return AccountStatus(value)


def _step(value: str | None) -> OnboardingStepId | None:
    return OnboardingStepId(value) if value else None


def _oauth_subject(provider: AuthProvider, subject: str) -> str:
    return f"{provider.value}:{subject}"


def build_next_route(account_status: AccountStatus) -> str:
    if account_status == AccountStatus.ACTIVE:
        return "/(tabs)/discover"

    if account_status == AccountStatus.PAUSED:
        return "/(tabs)/profile"

    if account_status == AccountStatus.ONBOARDING_IN_PROGRESS:
        return "/(onboarding)"

    return "/(auth)"


async def issue_session_for_user(db: AsyncSession, user: User) -> tuple[str, str, str]:
    refresh_token = issue_refresh_token()
    session_repo = SessionRepository(db)
    auth_session = await session_repo.create(
        user_id=user.id,
        refresh_token_hash=hash_value(refresh_token),
        expires_at=datetime.now(UTC) + timedelta(days=settings.refresh_token_expiry_days),
    )
    access_token = issue_access_token(user_id=user.id, session_id=auth_session.id)
    return access_token, refresh_token, auth_session.id


def build_auth_response(
    user: User,
    *,
    requires_otp: bool,
    verification_target: str | None = None,
    access_token: str | None = None,
    refresh_token: str | None = None,
) -> AuthSessionResponse:
    account_status = _status(user.account_status)
    return AuthSessionResponse(
        user_id=user.id,
        account_status=account_status,
        requires_otp=requires_otp,
        next_route=build_next_route(account_status) if not requires_otp else "/(auth)",
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer" if access_token else None,
        verification_target=verification_target,
        onboarding_step=_step(user.onboarding_step),
        is_profile_complete=user.is_profile_complete,
    )


async def _send_otp(*, destination: str, code: str, provider: AuthProvider) -> None:
    channel = "email" if provider == AuthProvider.EMAIL else "sms"
    gateway = get_otp_gateway(channel)
    await gateway.send_code(destination=destination, code=code, channel=channel)


def _assert_account_available(user: User) -> None:
    if user.account_status == AccountStatus.DELETED.value:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="This account has been deleted.")


async def signup(db: AsyncSession, payload: SignupRequest) -> AuthSessionResponse:
    user_repo = UserRepository(db)
    otp_repo = OtpChallengeRepository(db)

    if payload.provider == AuthProvider.EMAIL:
        if await user_repo.get_by_email(payload.email or ""):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered.")

        user = await user_repo.create(
            provider=payload.provider.value,
            email=(payload.email or "").lower(),
            password_hash=hash_password(payload.password) if payload.password else None,
            is_verified=False,
            account_status=AccountStatus.PENDING_VERIFICATION.value,
            onboarding_step=OnboardingStepId.BASIC_PROFILE.value,
            completed_steps=[],
            skipped_steps=[],
            is_profile_complete=False,
        )

        code = get_demo_otp_code()
        await otp_repo.create(
            user_id=user.id,
            provider=payload.provider.value,
            destination=user.email or "",
            code_hash=hash_value(code),
            purpose=OtpPurpose.SIGNUP.value,
            expires_at=datetime.now(UTC) + timedelta(minutes=10),
        )
        await _send_otp(destination=user.email or "", code=code, provider=payload.provider)
        await db.commit()
        await db.refresh(user)
        return build_auth_response(user, requires_otp=True, verification_target=user.email)

    if payload.provider == AuthProvider.PHONE:
        if await user_repo.get_by_phone(payload.phone_number or ""):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Phone number already registered.")

        user = await user_repo.create(
            provider=payload.provider.value,
            phone_number=payload.phone_number,
            is_verified=False,
            account_status=AccountStatus.PENDING_VERIFICATION.value,
            onboarding_step=OnboardingStepId.BASIC_PROFILE.value,
            completed_steps=[],
            skipped_steps=[],
            is_profile_complete=False,
        )

        code = get_demo_otp_code()
        await otp_repo.create(
            user_id=user.id,
            provider=payload.provider.value,
            destination=user.phone_number or "",
            code_hash=hash_value(code),
            purpose=OtpPurpose.SIGNUP.value,
            expires_at=datetime.now(UTC) + timedelta(minutes=10),
        )
        await _send_otp(destination=user.phone_number or "", code=code, provider=payload.provider)
        await db.commit()
        await db.refresh(user)
        return build_auth_response(user, requires_otp=True, verification_target=user.phone_number)

    claims = await verify_oauth_identity(payload.provider, payload.oauth_token or "")
    oauth_subject = _oauth_subject(payload.provider, claims.subject)

    if await user_repo.get_by_oauth_subject(oauth_subject):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="OAuth account already registered.")

    user = await user_repo.create(
        provider=payload.provider.value,
        email=claims.email.lower() if claims.email else None,
        oauth_subject=oauth_subject,
        is_verified=True,
        account_status=AccountStatus.ONBOARDING_IN_PROGRESS.value,
        onboarding_step=OnboardingStepId.BASIC_PROFILE.value,
        completed_steps=[],
        skipped_steps=[],
        is_profile_complete=False,
    )
    access_token, refresh_token, _ = await issue_session_for_user(db, user)
    await db.commit()
    await db.refresh(user)
    return build_auth_response(user, requires_otp=False, access_token=access_token, refresh_token=refresh_token)


async def login(db: AsyncSession, payload: LoginRequest) -> AuthSessionResponse:
    user_repo = UserRepository(db)
    otp_repo = OtpChallengeRepository(db)

    if payload.provider == AuthProvider.EMAIL:
        user = await user_repo.get_by_email((payload.email or "").lower())
        if user is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Email account not found.")

        _assert_account_available(user)

        if payload.password:
            if not user.password_hash or not verify_password(payload.password, user.password_hash):
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password.")

            if not user.is_verified:
                code = get_demo_otp_code()
                await otp_repo.create(
                    user_id=user.id,
                    provider=payload.provider.value,
                    destination=user.email or "",
                    code_hash=hash_value(code),
                    purpose=OtpPurpose.SIGNUP.value,
                    expires_at=datetime.now(UTC) + timedelta(minutes=10),
                )
                await _send_otp(destination=user.email or "", code=code, provider=payload.provider)
                await db.commit()
                return build_auth_response(user, requires_otp=True, verification_target=user.email)

            access_token, refresh_token, _ = await issue_session_for_user(db, user)
            await db.commit()
            return build_auth_response(user, requires_otp=False, access_token=access_token, refresh_token=refresh_token)

        code = get_demo_otp_code()
        otp_purpose = OtpPurpose.LOGIN if user.is_verified else OtpPurpose.SIGNUP
        await otp_repo.create(
            user_id=user.id,
            provider=payload.provider.value,
            destination=user.email or "",
            code_hash=hash_value(code),
            purpose=otp_purpose.value,
            expires_at=datetime.now(UTC) + timedelta(minutes=10),
        )
        await _send_otp(destination=user.email or "", code=code, provider=payload.provider)
        await db.commit()
        return build_auth_response(user, requires_otp=True, verification_target=user.email)

    if payload.provider == AuthProvider.PHONE:
        user = await user_repo.get_by_phone(payload.phone_number or "")

        if user is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Phone account not found.")

        _assert_account_available(user)

        code = get_demo_otp_code()
        await otp_repo.create(
            user_id=user.id,
            provider=payload.provider.value,
            destination=user.phone_number or "",
            code_hash=hash_value(code),
            purpose=OtpPurpose.LOGIN.value,
            expires_at=datetime.now(UTC) + timedelta(minutes=10),
        )
        await _send_otp(destination=user.phone_number or "", code=code, provider=payload.provider)
        await db.commit()
        return build_auth_response(user, requires_otp=True, verification_target=user.phone_number)

    claims = await verify_oauth_identity(payload.provider, payload.oauth_token or "")
    oauth_subject = _oauth_subject(payload.provider, claims.subject)
    user = await user_repo.get_by_oauth_subject(oauth_subject)

    if user is None:
        user = await user_repo.create(
            provider=payload.provider.value,
            email=claims.email.lower() if claims.email else None,
            oauth_subject=oauth_subject,
            is_verified=True,
            account_status=AccountStatus.ONBOARDING_IN_PROGRESS.value,
            onboarding_step=OnboardingStepId.BASIC_PROFILE.value,
            completed_steps=[],
            skipped_steps=[],
            is_profile_complete=False,
        )
    else:
        _assert_account_available(user)

    access_token, refresh_token, _ = await issue_session_for_user(db, user)
    await db.commit()
    return build_auth_response(user, requires_otp=False, access_token=access_token, refresh_token=refresh_token)


async def resend_otp(db: AsyncSession, payload: ResendOtpRequest) -> AuthSessionResponse:
    user_repo = UserRepository(db)
    otp_repo = OtpChallengeRepository(db)

    if payload.provider == AuthProvider.EMAIL:
        user = await user_repo.get_by_email(payload.destination.lower())
    else:
        user = await user_repo.get_by_phone(payload.destination)

    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account not found.")

    _assert_account_available(user)

    code = get_demo_otp_code()
    await otp_repo.create(
        user_id=user.id,
        provider=payload.provider.value,
        destination=payload.destination,
        code_hash=hash_value(code),
        purpose=payload.purpose.value,
        expires_at=datetime.now(UTC) + timedelta(minutes=10),
    )
    await _send_otp(destination=payload.destination, code=code, provider=payload.provider)
    await db.commit()
    return build_auth_response(user, requires_otp=True, verification_target=payload.destination)


async def verify_otp(db: AsyncSession, payload: VerifyOtpRequest) -> AuthSessionResponse:
    otp_repo = OtpChallengeRepository(db)
    user_repo = UserRepository(db)

    challenge = await otp_repo.get_valid_by_destination(payload.destination)

    if challenge is None or challenge.provider != payload.provider.value or not verify_hash(payload.otp_code, challenge.code_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired OTP code.")

    if challenge.purpose != payload.purpose.value:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="OTP purpose does not match.")

    user = await user_repo.get_by_id(challenge.user_id)

    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    _assert_account_available(user)

    user.is_verified = True
    if challenge.purpose == OtpPurpose.SIGNUP.value:
        user.account_status = AccountStatus.ONBOARDING_IN_PROGRESS.value
        user.onboarding_step = OnboardingStepId.BASIC_PROFILE.value

    await otp_repo.mark_consumed(challenge)
    await user_repo.save(user)
    access_token, refresh_token, _ = await issue_session_for_user(db, user)
    await db.commit()
    return build_auth_response(user, requires_otp=False, access_token=access_token, refresh_token=refresh_token)


async def logout(db: AsyncSession, session_id: str | None) -> LogoutResponse:
    if session_id:
        session_repo = SessionRepository(db)
        await session_repo.revoke(session_id)
        await db.commit()

    return LogoutResponse(success=True)
