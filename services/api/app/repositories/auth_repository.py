from __future__ import annotations

from datetime import UTC, datetime

from sqlalchemy import Select, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.auth_session import AuthSession
from app.models.otp_challenge import OtpChallenge
from app.models.user import User


class UserRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def create(self, **kwargs: object) -> User:
        user = User(**kwargs)
        self.db.add(user)
        await self.db.flush()
        await self.db.refresh(user)
        return user

    async def save(self, user: User) -> User:
        self.db.add(user)
        await self.db.flush()
        await self.db.refresh(user)
        return user

    async def get_by_id(self, user_id: str) -> User | None:
        return await self.db.get(User, user_id)

    async def get_by_email(self, email: str) -> User | None:
        stmt = select(User).where(User.email == email.lower())
        return await self.db.scalar(stmt)

    async def get_by_phone(self, phone_number: str) -> User | None:
        stmt = select(User).where(User.phone_number == phone_number)
        return await self.db.scalar(stmt)

    async def get_by_oauth_subject(self, oauth_subject: str) -> User | None:
        stmt = select(User).where(User.oauth_subject == oauth_subject)
        return await self.db.scalar(stmt)


class OtpChallengeRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def create(self, **kwargs: object) -> OtpChallenge:
        challenge = OtpChallenge(**kwargs)
        self.db.add(challenge)
        await self.db.flush()
        await self.db.refresh(challenge)
        return challenge

    async def get_valid_by_destination(self, destination: str) -> OtpChallenge | None:
        stmt = (
            select(OtpChallenge)
            .where(OtpChallenge.destination == destination)
            .where(OtpChallenge.consumed_at.is_(None))
            .where(OtpChallenge.expires_at >= datetime.now(UTC))
            .order_by(OtpChallenge.created_at.desc())
        )
        return await self.db.scalar(stmt)

    async def mark_consumed(self, challenge: OtpChallenge) -> OtpChallenge:
        challenge.consumed_at = datetime.now(UTC)
        self.db.add(challenge)
        await self.db.flush()
        await self.db.refresh(challenge)
        return challenge


class SessionRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def create(self, **kwargs: object) -> AuthSession:
        auth_session = AuthSession(**kwargs)
        self.db.add(auth_session)
        await self.db.flush()
        await self.db.refresh(auth_session)
        return auth_session

    async def get_active_by_id(self, session_id: str) -> AuthSession | None:
        stmt: Select[tuple[AuthSession]] = (
            select(AuthSession)
            .options(selectinload(AuthSession.user))
            .where(AuthSession.id == session_id)
            .where(AuthSession.revoked_at.is_(None))
            .where(AuthSession.expires_at >= datetime.now(UTC))
        )
        return await self.db.scalar(stmt)

    async def revoke(self, session_id: str) -> None:
        stmt = (
            update(AuthSession)
            .where(AuthSession.id == session_id)
            .values(revoked_at=datetime.now(UTC))
        )
        await self.db.execute(stmt)

    async def revoke_all_for_user(self, user_id: str) -> None:
        stmt = (
            update(AuthSession)
            .where(AuthSession.user_id == user_id)
            .where(AuthSession.revoked_at.is_(None))
            .values(revoked_at=datetime.now(UTC))
        )
        await self.db.execute(stmt)
