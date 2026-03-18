from dataclasses import dataclass

from app.core.config import settings


@dataclass(frozen=True)
class OpenAIModelRegistry:
    embedding_model: str
    chat_model: str
    compatibility_model: str


def get_openai_model_registry() -> OpenAIModelRegistry:
    return OpenAIModelRegistry(
        embedding_model=settings.openai_embedding_model,
        chat_model=settings.openai_chat_model,
        compatibility_model=settings.openai_compatibility_model,
    )
