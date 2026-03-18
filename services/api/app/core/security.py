from __future__ import annotations

from datetime import UTC, datetime, timedelta
import hashlib
import secrets
from dataclasses import dataclass

import jwt

from app.core.config import settings


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def hash_value(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def verify_password(password: str, password_hash: str) -> bool:
    return hash_password(password) == password_hash


def verify_hash(value: str, value_hash: str) -> bool:
    return hash_value(value) == value_hash


def issue_refresh_token() -> str:
    return secrets.token_urlsafe(48)


def get_demo_otp_code() -> str:
    return settings.demo_otp_code


@dataclass(frozen=True)
class TokenPayload:
    subject: str
    session_id: str
    token_type: str
    expires_at: datetime


def issue_access_token(*, user_id: str, session_id: str) -> str:
    expires_at = datetime.now(UTC) + timedelta(minutes=settings.access_token_expiry_minutes)
    payload = {
        "sub": user_id,
        "sid": session_id,
        "type": "access",
        "exp": expires_at,
    }
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def decode_token(token: str, *, expected_type: str) -> TokenPayload:
    payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])

    if payload.get("type") != expected_type:
        raise ValueError("Invalid token type.")

    expires_at = payload.get("exp")
    if isinstance(expires_at, (int, float)):
        exp_dt = datetime.fromtimestamp(expires_at, UTC)
    else:
        exp_dt = datetime.now(UTC)

    return TokenPayload(
        subject=str(payload["sub"]),
        session_id=str(payload["sid"]),
        token_type=str(payload["type"]),
        expires_at=exp_dt,
    )
