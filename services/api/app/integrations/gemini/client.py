from __future__ import annotations

from dataclasses import dataclass
import hashlib
import math

import httpx

from app.core.config import settings


@dataclass(frozen=True)
class GeminiModelRegistry:
    embedding_model: str
    chat_model: str
    compatibility_model: str
    embedding_version: str
    output_dimensionality: int


def _normalize_model_name(model_name: str) -> str:
    if model_name.startswith("models/"):
        return model_name
    return f"models/{model_name}"


def get_gemini_model_registry() -> GeminiModelRegistry:
    return GeminiModelRegistry(
        embedding_model=_normalize_model_name(settings.gemini_embedding_model),
        chat_model=_normalize_model_name(settings.gemini_chat_model),
        compatibility_model=_normalize_model_name(settings.gemini_compatibility_model),
        embedding_version=settings.embedding_version,
        output_dimensionality=settings.embedding_output_dimensionality,
    )


def _fallback_embedding(text: str, dimensions: int) -> list[float]:
    if not text.strip():
        return [0.0] * dimensions

    vector = [0.0] * dimensions
    for token in text.lower().split():
        digest = hashlib.sha256(token.encode("utf-8")).digest()
        for index in range(dimensions):
            bucket = digest[index % len(digest)]
            vector[index] += ((bucket / 255.0) * 2.0) - 1.0

    magnitude = math.sqrt(sum(value * value for value in vector)) or 1.0
    return [value / magnitude for value in vector]


class GeminiClient:
    def __init__(self) -> None:
        self.registry = get_gemini_model_registry()

    async def embed_text(self, text: str, *, task_type: str = "SEMANTIC_SIMILARITY") -> list[float]:
        if not settings.gemini_api_key:
            return _fallback_embedding(text, self.registry.output_dimensionality)

        try:
            async with httpx.AsyncClient(timeout=20.0) as client:
                response = await client.post(
                    f"https://generativelanguage.googleapis.com/v1beta/{self.registry.embedding_model}:embedContent",
                    params={"key": settings.gemini_api_key},
                    headers={"Content-Type": "application/json"},
                    json={
                        "content": {"parts": [{"text": text}]},
                        "taskType": task_type,
                        "outputDimensionality": self.registry.output_dimensionality,
                    },
                )
                response.raise_for_status()
                body = response.json()
                values = body.get("embedding", {}).get("values")
                if isinstance(values, list) and values:
                    return [float(value) for value in values]
        except Exception:
            return _fallback_embedding(text, self.registry.output_dimensionality)

        return _fallback_embedding(text, self.registry.output_dimensionality)

    async def generate_match_copy(
        self,
        *,
        viewer_name: str,
        candidate_name: str,
        score: float,
        factors: list[str],
    ) -> tuple[str, list[str]]:
        fallback_factors = factors[:3] or ["You line up on dating intent and profile energy."]
        fallback_summary = (
            f"{viewer_name} and {candidate_name} look promising because the profile signals line up across intent, "
            f"conversation style, and daily-life compatibility."
        )

        if not settings.gemini_api_key:
            return fallback_summary, fallback_factors

        prompt = (
            "You are writing a short dating-app compatibility explanation.\n"
            f"Viewer: {viewer_name}\n"
            f"Candidate: {candidate_name}\n"
            f"Score: {score:.2f}\n"
            "Use only these factors:\n"
            + "\n".join(f"- {factor}" for factor in fallback_factors)
            + "\nReturn exactly four lines.\n"
            "Line 1 must start with 'Summary:'.\n"
            "Line 2 must start with 'Reason 1:'.\n"
            "Line 3 must start with 'Reason 2:'.\n"
            "Line 4 must start with 'Reason 3:'."
        )

        try:
            async with httpx.AsyncClient(timeout=20.0) as client:
                response = await client.post(
                    f"https://generativelanguage.googleapis.com/v1beta/{self.registry.compatibility_model}:generateContent",
                    params={"key": settings.gemini_api_key},
                    headers={"Content-Type": "application/json"},
                    json={"contents": [{"parts": [{"text": prompt}]}]},
                )
                response.raise_for_status()
                body = response.json()
                parts = body.get("candidates", [{}])[0].get("content", {}).get("parts", [])
                text = "\n".join(part.get("text", "") for part in parts if isinstance(part, dict)).strip()
                lines = [line.strip() for line in text.splitlines() if line.strip()]
                summary = next((line.split(":", 1)[1].strip() for line in lines if line.startswith("Summary:")), fallback_summary)
                reasons = [line.split(":", 1)[1].strip() for line in lines if line.startswith("Reason ")]
                return summary, reasons[:3] or fallback_factors
        except Exception:
            return fallback_summary, fallback_factors

        return fallback_summary, fallback_factors


def get_gemini_client() -> GeminiClient:
    return GeminiClient()
