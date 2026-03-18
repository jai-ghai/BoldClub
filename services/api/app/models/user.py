from __future__ import annotations

from datetime import datetime

from sqlalchemy import Boolean, DateTime, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin, generate_uuid


class User(TimestampMixin, Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    provider: Mapped[str] = mapped_column(String(32), nullable=False)
    email: Mapped[str | None] = mapped_column(String(255), unique=True, index=True, nullable=True)
    phone_number: Mapped[str | None] = mapped_column(String(32), unique=True, index=True, nullable=True)
    password_hash: Mapped[str | None] = mapped_column(Text, nullable=True)
    oauth_subject: Mapped[str | None] = mapped_column(String(255), unique=True, index=True, nullable=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    account_status: Mapped[str] = mapped_column(String(32), nullable=False, default="pending_verification", index=True)
    onboarding_step: Mapped[str | None] = mapped_column(String(32), nullable=True)
    completed_steps: Mapped[list[str]] = mapped_column(JSON, nullable=False, default=list)
    skipped_steps: Mapped[list[str]] = mapped_column(JSON, nullable=False, default=list)
    is_profile_complete: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    onboarding_completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    paused_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    pause_reason: Mapped[str | None] = mapped_column(Text, nullable=True)
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    deletion_reason: Mapped[str | None] = mapped_column(Text, nullable=True)
    last_active_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    sessions = relationship("AuthSession", back_populates="user", cascade="all, delete-orphan")
    otp_challenges = relationship("OtpChallenge", back_populates="user", cascade="all, delete-orphan")
