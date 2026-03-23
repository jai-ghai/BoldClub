from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "BoldClub API"
    environment: str = "development"
    api_v1_prefix: str = "/v1"
    sql_echo: bool = False
    auto_create_tables: bool = True
    backend_cors_origins: str = (
        "http://localhost:8081,"
        "http://127.0.0.1:8081,"
        "http://localhost:19006,"
        "http://127.0.0.1:19006,"
        "http://localhost:3000,"
        "http://127.0.0.1:3000"
    )

    postgres_dsn: str = "postgresql+asyncpg://boldclub:boldclub@localhost:5432/boldclub"
    redis_url: str = "redis://localhost:6379/0"

    jwt_secret_key: str = "change-me"
    jwt_algorithm: str = "HS256"
    access_token_expiry_minutes: int = 60
    refresh_token_expiry_days: int = 30

    gemini_api_key: str = ""
    gemini_embedding_model: str = "models/gemini-embedding-001"
    gemini_chat_model: str = "models/gemini-2.5-flash"
    gemini_compatibility_model: str = "models/gemini-2.5-flash"
    embedding_version: str = "gemini-v1"
    embedding_output_dimensionality: int = 128

    cloudinary_cloud_name: str = ""
    cloudinary_api_key: str = ""
    cloudinary_api_secret: str = ""
    cloudinary_upload_folder: str = "boldclub"
    demo_otp_code: str = "123456"

    stream_api_key: str = ""
    stream_api_secret: str = ""

    otp_email_provider: str = "development"
    otp_sms_provider: str = "development"
    otp_email_from: str = ""
    resend_api_key: str = ""
    twilio_account_sid: str = ""
    twilio_auth_token: str = ""
    twilio_from_number: str = ""

    google_client_id: str = ""
    google_client_ids: str = ""
    apple_client_id: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.backend_cors_origins.split(",") if origin.strip()]

    @property
    def accepted_google_client_ids(self) -> list[str]:
        values: list[str] = []

        if self.google_client_id.strip():
            values.append(self.google_client_id.strip())

        values.extend(
            client_id.strip()
            for client_id in self.google_client_ids.split(",")
            if client_id.strip()
        )

        # Preserve order while removing duplicates.
        return list(dict.fromkeys(values))


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
