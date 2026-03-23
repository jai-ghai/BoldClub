from __future__ import annotations

from sqlalchemy import ForeignKey, JSON, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin


class Profile(TimestampMixin, Base):
    __tablename__ = "profiles"

    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    basic_profile: Mapped[dict[str, object]] = mapped_column(JSON, nullable=False, default=dict)
    prompts: Mapped[dict[str, object]] = mapped_column(JSON, nullable=False, default=dict)
    interests: Mapped[dict[str, object]] = mapped_column(JSON, nullable=False, default=dict)
    lifestyle: Mapped[dict[str, object]] = mapped_column(JSON, nullable=False, default=dict)
    personality: Mapped[dict[str, object]] = mapped_column(JSON, nullable=False, default=dict)
    location: Mapped[dict[str, object]] = mapped_column(JSON, nullable=False, default=dict)
    preferences: Mapped[dict[str, object]] = mapped_column(JSON, nullable=False, default=dict)

    user = relationship("User", back_populates="profile")
    media_assets = relationship(
        "ProfileMedia",
        back_populates="profile",
        cascade="all, delete-orphan",
        order_by="ProfileMedia.position",
    )
    embeddings = relationship(
        "UserEmbedding",
        back_populates="profile",
        cascade="all, delete-orphan",
    )
