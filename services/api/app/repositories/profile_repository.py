from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.profile import Profile
from app.models.profile_media import ProfileMedia
from app.models.user import User
from app.models.user_embedding import UserEmbedding


class ProfileRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_by_user_id(self, user_id: str, *, with_relations: bool = False) -> Profile | None:
        stmt = select(Profile).where(Profile.user_id == user_id)

        if with_relations:
            stmt = stmt.options(
                selectinload(Profile.user),
                selectinload(Profile.media_assets),
                selectinload(Profile.embeddings),
            )

        return await self.db.scalar(stmt)

    async def get_or_create(self, user_id: str) -> Profile:
        profile = await self.get_by_user_id(user_id, with_relations=True)
        if profile is not None:
            return profile

        profile = Profile(user_id=user_id)
        self.db.add(profile)
        await self.db.flush()
        return await self.get_by_user_id(user_id, with_relations=True) or profile

    async def save(self, profile: Profile) -> Profile:
        self.db.add(profile)
        await self.db.flush()
        return profile

    async def list_active_profiles(self, *, exclude_user_id: str | None = None) -> list[Profile]:
        stmt = (
            select(Profile)
            .join(Profile.user)
            .options(
                selectinload(Profile.user),
                selectinload(Profile.media_assets),
                selectinload(Profile.embeddings),
            )
            .where(User.account_status == "active")
            .where(User.is_profile_complete.is_(True))
        )

        if exclude_user_id:
            stmt = stmt.where(Profile.user_id != exclude_user_id)

        result = await self.db.scalars(stmt.order_by(Profile.updated_at.desc()))
        return list(result)

    async def replace_media(self, profile: Profile, media_assets: list[ProfileMedia]) -> list[ProfileMedia]:
        profile.media_assets.clear()
        await self.db.flush()

        if media_assets and not any(asset.is_primary for asset in media_assets):
            media_assets[0].is_primary = True

        profile.media_assets.extend(media_assets)
        await self.db.flush()
        return list(profile.media_assets)

    async def upsert_embedding(
        self,
        *,
        user_id: str,
        embedding_kind: str,
        provider: str,
        model: str,
        embedding_version: str,
        source_hash: str,
        vector: list[float],
    ) -> UserEmbedding:
        stmt = select(UserEmbedding).where(
            UserEmbedding.user_id == user_id,
            UserEmbedding.embedding_kind == embedding_kind,
        )
        embedding = await self.db.scalar(stmt)

        if embedding is None:
            embedding = UserEmbedding(
                user_id=user_id,
                embedding_kind=embedding_kind,
                provider=provider,
                model=model,
                embedding_version=embedding_version,
                source_hash=source_hash,
                vector=vector,
            )
        else:
            embedding.provider = provider
            embedding.model = model
            embedding.embedding_version = embedding_version
            embedding.source_hash = source_hash
            embedding.vector = vector

        self.db.add(embedding)
        await self.db.flush()
        return embedding
