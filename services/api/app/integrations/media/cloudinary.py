from __future__ import annotations

from dataclasses import dataclass
from datetime import UTC, datetime
import hashlib
import re
from uuid import uuid4

from app.core.config import settings


def _slugify(value: str) -> str:
    cleaned = re.sub(r"[^a-zA-Z0-9_-]+", "-", value.strip()).strip("-").lower()
    return cleaned or "asset"


@dataclass(frozen=True)
class CloudinaryUploadSignature:
    cloud_name: str
    api_key: str
    timestamp: int
    signature: str
    folder: str
    public_id: str
    upload_url: str
    resource_type: str


class CloudinaryService:
    def is_configured(self) -> bool:
        return all(
            [
                settings.cloudinary_cloud_name,
                settings.cloudinary_api_key,
                settings.cloudinary_api_secret,
            ]
        )

    def create_upload_signature(
        self,
        *,
        user_id: str,
        resource_type: str = "image",
        file_name: str | None = None,
    ) -> CloudinaryUploadSignature:
        if not self.is_configured():
            raise ValueError("Cloudinary is not configured.")

        timestamp = int(datetime.now(UTC).timestamp())
        folder = settings.cloudinary_upload_folder.strip("/") or "boldclub"
        file_stem = _slugify(file_name or resource_type)
        public_id = f"{folder}/{user_id}/{uuid4()}-{file_stem}"
        signing_params = {
            "folder": folder,
            "public_id": public_id,
            "timestamp": str(timestamp),
        }
        payload = "&".join(f"{key}={signing_params[key]}" for key in sorted(signing_params))
        signature = hashlib.sha1(f"{payload}{settings.cloudinary_api_secret}".encode("utf-8")).hexdigest()
        return CloudinaryUploadSignature(
            cloud_name=settings.cloudinary_cloud_name,
            api_key=settings.cloudinary_api_key,
            timestamp=timestamp,
            signature=signature,
            folder=folder,
            public_id=public_id,
            upload_url=f"https://api.cloudinary.com/v1_1/{settings.cloudinary_cloud_name}/{resource_type}/upload",
            resource_type=resource_type,
        )


def get_cloudinary_service() -> CloudinaryService:
    return CloudinaryService()
