from __future__ import annotations

from sqlalchemy import Boolean, Float, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin, generate_uuid


class ProfileMedia(TimestampMixin, Base):
    __tablename__ = "profile_media"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("profiles.user_id", ondelete="CASCADE"), index=True)
    storage_provider: Mapped[str] = mapped_column(String(32), nullable=False, default="cloudinary")
    provider_asset_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    provider_public_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    resource_type: Mapped[str] = mapped_column(String(32), nullable=False, default="image")
    mime_type: Mapped[str | None] = mapped_column(String(128), nullable=True)
    bytes: Mapped[int | None] = mapped_column(Integer, nullable=True)
    width: Mapped[int | None] = mapped_column(Integer, nullable=True)
    height: Mapped[int | None] = mapped_column(Integer, nullable=True)
    duration_seconds: Mapped[float | None] = mapped_column(Float, nullable=True)
    position: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    is_primary: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    status: Mapped[str] = mapped_column(String(32), nullable=False, default="ready")
    original_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    delivery_url: Mapped[str] = mapped_column(Text, nullable=False)
    provider_metadata: Mapped[dict[str, object]] = mapped_column(JSON, nullable=False, default=dict)

    profile = relationship("Profile", back_populates="media_assets")
