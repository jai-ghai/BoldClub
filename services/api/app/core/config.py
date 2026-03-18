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

    openai_api_key: str = ""
    openai_embedding_model: str = "text-embedding-3-large"
    openai_chat_model: str = "gpt-4o-mini"
    openai_compatibility_model: str = "gpt-4o-mini"
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
    apple_client_id: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.backend_cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
