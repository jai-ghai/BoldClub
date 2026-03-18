from __future__ import annotations

import asyncio
from collections.abc import Iterator
import os
from pathlib import Path
import sys

import pytest
from fastapi.testclient import TestClient

os.environ.setdefault("POSTGRES_DSN", "sqlite+aiosqlite:///./boldclub_test.db")
os.environ.setdefault("AUTO_CREATE_TABLES", "true")
os.environ.setdefault("OTP_EMAIL_PROVIDER", "development")
os.environ.setdefault("OTP_SMS_PROVIDER", "development")
os.environ.setdefault("JWT_SECRET_KEY", "test-secret")

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.db.base import Base
from app.db.session import engine
from app.main import app


async def _reset_database() -> None:
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.drop_all)
        await connection.run_sync(Base.metadata.create_all)


@pytest.fixture(autouse=True)
def reset_database() -> Iterator[None]:
    asyncio.run(_reset_database())
    yield
    asyncio.run(_reset_database())


@pytest.fixture
def client() -> Iterator[TestClient]:
    with TestClient(app) as test_client:
        yield test_client
