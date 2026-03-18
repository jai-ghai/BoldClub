from __future__ import annotations

import json
from dataclasses import dataclass

import httpx
import jwt

from app.core.config import settings
from app.schemas.bootstrap import AuthProvider


@dataclass(frozen=True)
class IdentityClaims:
    subject: str
    email: str | None = None
    email_verified: bool = False


async def verify_google_identity_token(id_token: str) -> IdentityClaims:
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(
            "https://oauth2.googleapis.com/tokeninfo",
            params={"id_token": id_token},
        )
        response.raise_for_status()

    payload = response.json()

    if settings.google_client_id and payload.get("aud") != settings.google_client_id:
        raise ValueError("Google token audience does not match the configured client id.")

    return IdentityClaims(
        subject=payload["sub"],
        email=payload.get("email"),
        email_verified=payload.get("email_verified") == "true",
    )


async def verify_apple_identity_token(identity_token: str) -> IdentityClaims:
    header = jwt.get_unverified_header(identity_token)

    async with httpx.AsyncClient(timeout=10.0) as client:
        keys_response = await client.get("https://appleid.apple.com/auth/keys")
        keys_response.raise_for_status()

    jwk = next((key for key in keys_response.json()["keys"] if key["kid"] == header["kid"]), None)

    if jwk is None:
        raise ValueError("Unable to resolve Apple signing key.")

    public_key = jwt.algorithms.RSAAlgorithm.from_jwk(json.dumps(jwk))
    payload = jwt.decode(
        identity_token,
        public_key,
        algorithms=["RS256"],
        audience=settings.apple_client_id or None,
        issuer="https://appleid.apple.com",
    )

    return IdentityClaims(
        subject=payload["sub"],
        email=payload.get("email"),
        email_verified=payload.get("email_verified") in {True, "true"},
    )


async def verify_oauth_identity(provider: AuthProvider, oauth_token: str) -> IdentityClaims:
    if provider == AuthProvider.GOOGLE:
        return await verify_google_identity_token(oauth_token)

    if provider == AuthProvider.APPLE:
        return await verify_apple_identity_token(oauth_token)

    raise ValueError(f"Unsupported OAuth provider: {provider.value}")
