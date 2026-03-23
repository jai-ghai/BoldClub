from __future__ import annotations

from dataclasses import dataclass
from datetime import UTC, date, datetime
import hashlib
import math
from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.integrations.gemini.client import get_gemini_client, get_gemini_model_registry
from app.models.profile import Profile
from app.models.user import User
from app.repositories.profile_repository import ProfileRepository

EMBEDDING_WEIGHTS: dict[str, float] = {
    "intent": 0.30,
    "personality": 0.20,
    "interests": 0.20,
    "lifestyle": 0.15,
    "prompt": 0.10,
    "preferences": 0.05,
}


@dataclass(frozen=True)
class RankedCandidate:
    profile: Profile
    final_score: float
    vector_score: float
    structured_score: float
    factor_scores: dict[str, float]
    top_factors: list[str]


def _stringify(value: Any) -> str:
    if value is None:
        return ""
    if isinstance(value, str):
        return value.strip()
    if isinstance(value, bool):
        return "yes" if value else "no"
    if isinstance(value, (int, float)):
        return str(value)
    if isinstance(value, list):
        return ", ".join(part for part in (_stringify(item) for item in value) if part)
    if isinstance(value, dict):
        return ". ".join(
            f"{key.replace('_', ' ')}: {text}"
            for key, raw in value.items()
            if (text := _stringify(raw))
        )
    return str(value)


def _clamp(value: float, minimum: float = 0.0, maximum: float = 1.0) -> float:
    return max(minimum, min(maximum, value))


def _parse_birth_date(profile: Profile) -> date | None:
    raw = profile.basic_profile.get("dob") or profile.basic_profile.get("birth_date")
    if not isinstance(raw, str):
        return None
    try:
        return date.fromisoformat(raw)
    except ValueError:
        return None


def _calculate_age(profile: Profile) -> int | None:
    if isinstance(profile.basic_profile.get("age"), int):
        return int(profile.basic_profile["age"])

    birth_date = _parse_birth_date(profile)
    if birth_date is None:
        return None

    today = date.today()
    age = today.year - birth_date.year
    if (today.month, today.day) < (birth_date.month, birth_date.day):
        age -= 1
    return age


def get_display_name(profile: Profile) -> str:
    value = profile.basic_profile.get("name") or profile.basic_profile.get("display_name")
    if isinstance(value, str) and value.strip():
        return value.strip()
    if profile.user and profile.user.email:
        return profile.user.email.split("@", 1)[0].title()
    return "Someone"


def get_location_label(profile: Profile) -> str:
    for source in (profile.location, profile.basic_profile):
        city = source.get("city")
        if isinstance(city, str) and city.strip():
            return city.strip()
    return "Location pending"


def get_interest_list(profile: Profile) -> list[str]:
    value = profile.interests.get("items") or profile.interests.get("interests") or profile.interests.get("selected")
    if isinstance(value, list):
        return [str(item).strip() for item in value if str(item).strip()]
    if isinstance(value, str) and value.strip():
        return [value.strip()]
    return []


def get_prompt_answer(profile: Profile) -> str:
    prompts = profile.prompts.get("answers") or profile.prompts.get("items") or profile.prompts
    text = _stringify(prompts)
    if text:
        return text
    return _stringify(profile.basic_profile.get("bio")) or "Still building their profile story."


def get_primary_media_url(profile: Profile) -> str:
    ready_assets = [asset for asset in profile.media_assets if asset.status == "ready"]
    if not ready_assets:
        return ""

    primary = next((asset for asset in ready_assets if asset.is_primary), ready_assets[0])
    return primary.delivery_url


def _extract_numeric(source: dict[str, object], *keys: str) -> float | None:
    for key in keys:
        raw = source.get(key)
        if isinstance(raw, (int, float)):
            return float(raw)
        if isinstance(raw, str):
            try:
                return float(raw)
            except ValueError:
                continue
    return None


def _build_embedding_texts(profile: Profile) -> dict[str, str]:
    basic = profile.basic_profile
    return {
        "intent": _stringify(
            {
                "looking_for": basic.get("looking_for"),
                "relationship_intent": profile.preferences.get("relationship_intent"),
                "partner_preferences": profile.preferences,
            }
        ),
        "personality": _stringify(profile.personality),
        "interests": _stringify({"interests": get_interest_list(profile)}),
        "lifestyle": _stringify(profile.lifestyle),
        "prompt": get_prompt_answer(profile),
        "preferences": _stringify(profile.preferences),
    }


def _hash_text(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def _combine_vectors(vectors: list[tuple[float, list[float]]]) -> list[float]:
    usable = [(weight, vector) for weight, vector in vectors if vector]
    if not usable:
        return []

    dimensions = len(usable[0][1])
    combined = [0.0] * dimensions
    total_weight = 0.0

    for weight, vector in usable:
        if len(vector) != dimensions:
            continue
        total_weight += weight
        for index, value in enumerate(vector):
            combined[index] += weight * value

    if total_weight == 0:
        return []

    combined = [value / total_weight for value in combined]
    magnitude = math.sqrt(sum(value * value for value in combined)) or 1.0
    return [value / magnitude for value in combined]


def _cosine_similarity(left: list[float], right: list[float]) -> float:
    if not left or not right or len(left) != len(right):
        return 0.0

    dot_product = sum(a * b for a, b in zip(left, right, strict=False))
    left_norm = math.sqrt(sum(value * value for value in left))
    right_norm = math.sqrt(sum(value * value for value in right))
    if left_norm == 0 or right_norm == 0:
        return 0.0

    similarity = dot_product / (left_norm * right_norm)
    return _clamp((similarity + 1.0) / 2.0)


async def refresh_profile_embeddings(db: AsyncSession, profile: Profile) -> None:
    repository = ProfileRepository(db)
    gemini_client = get_gemini_client()
    registry = get_gemini_model_registry()
    embedding_texts = _build_embedding_texts(profile)
    component_vectors: list[tuple[float, list[float]]] = []

    for kind, text in embedding_texts.items():
        source_hash = _hash_text(text)
        existing = next((embedding for embedding in profile.embeddings if embedding.embedding_kind == kind), None)
        if existing is not None and existing.source_hash == source_hash and existing.vector:
            component_vectors.append((EMBEDDING_WEIGHTS[kind], existing.vector))
            continue

        vector = await gemini_client.embed_text(text)
        await repository.upsert_embedding(
            user_id=profile.user_id,
            embedding_kind=kind,
            provider="gemini",
            model=registry.embedding_model,
            embedding_version=registry.embedding_version,
            source_hash=source_hash,
            vector=vector,
        )
        component_vectors.append((EMBEDDING_WEIGHTS[kind], vector))

    discovery_vector = _combine_vectors(component_vectors)
    await repository.upsert_embedding(
        user_id=profile.user_id,
        embedding_kind="discovery",
        provider="gemini",
        model=registry.embedding_model,
        embedding_version=registry.embedding_version,
        source_hash=_hash_text("".join(_hash_text(text) for text in embedding_texts.values())),
        vector=discovery_vector,
    )

    refreshed_profile = await repository.get_by_user_id(profile.user_id, with_relations=True)
    if refreshed_profile is not None:
        profile.embeddings = refreshed_profile.embeddings


def _embedding_lookup(profile: Profile) -> dict[str, list[float]]:
    return {embedding.embedding_kind: embedding.vector for embedding in profile.embeddings}


def _reciprocal_preference_fit(viewer: Profile, candidate: Profile) -> float:
    viewer_age = _calculate_age(viewer)
    candidate_age = _calculate_age(candidate)
    viewer_prefs = viewer.preferences or {}
    candidate_prefs = candidate.preferences or {}

    def _age_fit(age: int | None, prefs: dict[str, object]) -> float:
        if age is None:
            return 0.75
        minimum = _extract_numeric(prefs, "age_min", "min_age")
        maximum = _extract_numeric(prefs, "age_max", "max_age")
        if minimum is not None and age < minimum:
            return 0.0
        if maximum is not None and age > maximum:
            return 0.0
        return 1.0

    viewer_fit = _age_fit(candidate_age, viewer_prefs)
    candidate_fit = _age_fit(viewer_age, candidate_prefs)
    return (viewer_fit + candidate_fit) / 2.0


def _distance_score(viewer: Profile, candidate: Profile) -> float:
    viewer_city = get_location_label(viewer).lower()
    candidate_city = get_location_label(candidate).lower()

    viewer_lat = _extract_numeric(viewer.location, "latitude", "lat")
    viewer_lng = _extract_numeric(viewer.location, "longitude", "lng", "lon")
    candidate_lat = _extract_numeric(candidate.location, "latitude", "lat")
    candidate_lng = _extract_numeric(candidate.location, "longitude", "lng", "lon")

    if None not in (viewer_lat, viewer_lng, candidate_lat, candidate_lng):
        earth_radius_km = 6371.0
        lat1 = math.radians(viewer_lat or 0.0)
        lon1 = math.radians(viewer_lng or 0.0)
        lat2 = math.radians(candidate_lat or 0.0)
        lon2 = math.radians(candidate_lng or 0.0)
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        a = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
        distance = 2 * earth_radius_km * math.asin(math.sqrt(a))
        max_distance = _extract_numeric(viewer.preferences, "distance_km", "max_distance_km") or 50.0
        if distance >= max_distance:
            return 0.15
        return _clamp(1.0 - (distance / max_distance), 0.15, 1.0)

    if viewer_city == candidate_city and viewer_city != "location pending":
        return 1.0
    if "pending" in viewer_city or "pending" in candidate_city:
        return 0.6
    return 0.45


def _activity_recency_score(user: User | None) -> float:
    if user is None or user.last_active_at is None:
        return 0.65

    last_active_at = user.last_active_at
    if last_active_at.tzinfo is None:
        last_active_at = last_active_at.replace(tzinfo=UTC)

    age_hours = (datetime.now(UTC) - last_active_at).total_seconds() / 3600
    return _clamp(1.0 - (age_hours / (24 * 14)), 0.25, 1.0)


def _profile_completeness_score(profile: Profile) -> float:
    sections = [
        profile.basic_profile,
        profile.prompts,
        profile.interests,
        profile.lifestyle,
        profile.personality,
        profile.location,
        profile.preferences,
    ]
    filled = sum(1 for section in sections if _stringify(section))
    section_score = filled / len(sections)
    media_score = min(len([asset for asset in profile.media_assets if asset.status == "ready"]) / 3.0, 1.0)
    return _clamp((0.8 * section_score) + (0.2 * media_score))


def _media_quality_score(profile: Profile) -> float:
    ready_assets = [asset for asset in profile.media_assets if asset.status == "ready"]
    if not ready_assets:
        return 0.0
    if len(ready_assets) == 1:
        return 0.75
    if any(asset.resource_type == "video" for asset in ready_assets):
        return 1.0
    return 0.9


def _safety_trust_score(user: User | None) -> float:
    if user is None:
        return 0.7
    return 1.0 if user.is_verified else 0.8


def _structured_score(viewer: Profile, candidate: Profile) -> tuple[float, dict[str, float]]:
    factors = {
        "reciprocal_preference_fit": _reciprocal_preference_fit(viewer, candidate),
        "distance_score": _distance_score(viewer, candidate),
        "activity_recency_score": _activity_recency_score(candidate.user),
        "profile_completeness_score": _profile_completeness_score(candidate),
        "media_quality_score": _media_quality_score(candidate),
        "safety_trust_score": _safety_trust_score(candidate.user),
    }
    score = (
        0.35 * factors["reciprocal_preference_fit"]
        + 0.20 * factors["distance_score"]
        + 0.15 * factors["activity_recency_score"]
        + 0.15 * factors["profile_completeness_score"]
        + 0.10 * factors["media_quality_score"]
        + 0.05 * factors["safety_trust_score"]
    )
    return score, factors


def _factor_label(key: str) -> str:
    labels = {
        "intent": "You want a similar kind of relationship.",
        "personality": "Your personality and communication style feel compatible.",
        "interests": "You overlap on interests that can turn into easy first conversations.",
        "lifestyle": "Your routines and day-to-day pace are aligned.",
        "prompt": "Your prompts suggest a natural conversation rhythm.",
        "preferences": "Your stated partner preferences overlap well.",
        "reciprocal_preference_fit": "Both profiles fit each other's stated discovery preferences.",
        "distance_score": "Location and distance make this connection practical.",
        "activity_recency_score": "This profile is active enough to make a timely match more likely.",
        "profile_completeness_score": "The profile has enough detail to create a real compatibility signal.",
        "media_quality_score": "The media set is usable and complete enough for discovery.",
        "safety_trust_score": "Verification and account health make the profile more trustworthy.",
    }
    return labels.get(key, key.replace("_", " ").title())


def _top_factors(vector_factors: dict[str, float], structured_factors: dict[str, float]) -> list[str]:
    weighted: dict[str, float] = {}

    for key, value in vector_factors.items():
        weighted[key] = EMBEDDING_WEIGHTS[key] * value
    for key, value in structured_factors.items():
        if key == "reciprocal_preference_fit":
            weighted[key] = 0.35 * value
        elif key == "distance_score":
            weighted[key] = 0.20 * value
        elif key == "activity_recency_score":
            weighted[key] = 0.15 * value
        elif key == "profile_completeness_score":
            weighted[key] = 0.15 * value
        elif key == "media_quality_score":
            weighted[key] = 0.10 * value
        elif key == "safety_trust_score":
            weighted[key] = 0.05 * value

    sorted_factors = sorted(weighted.items(), key=lambda item: item[1], reverse=True)
    return [_factor_label(key) for key, _ in sorted_factors[:3]]


def _score_candidate(viewer: Profile, candidate: Profile) -> RankedCandidate:
    viewer_vectors = _embedding_lookup(viewer)
    candidate_vectors = _embedding_lookup(candidate)
    vector_factors = {
        kind: _cosine_similarity(viewer_vectors.get(kind, []), candidate_vectors.get(kind, []))
        for kind in EMBEDDING_WEIGHTS
    }
    vector_score = sum(EMBEDDING_WEIGHTS[kind] * vector_factors[kind] for kind in EMBEDDING_WEIGHTS)
    structured_score, structured_factors = _structured_score(viewer, candidate)
    stale_penalty = 0.05 if not candidate_vectors.get("discovery") else 0.0
    final_score = _clamp((0.75 * vector_score) + (0.25 * structured_score) - stale_penalty)

    return RankedCandidate(
        profile=candidate,
        final_score=final_score,
        vector_score=vector_score,
        structured_score=structured_score,
        factor_scores={**vector_factors, **structured_factors},
        top_factors=_top_factors(vector_factors, structured_factors),
    )


async def get_ranked_candidates(db: AsyncSession, viewer_user: User, *, limit: int = 20) -> list[RankedCandidate]:
    repository = ProfileRepository(db)
    viewer_profile = await repository.get_or_create(viewer_user.id)
    viewer_profile = await repository.get_by_user_id(viewer_user.id, with_relations=True) or viewer_profile
    await refresh_profile_embeddings(db, viewer_profile)

    candidates = await repository.list_active_profiles(exclude_user_id=viewer_user.id)
    ranked: list[RankedCandidate] = []

    for candidate in candidates:
        await refresh_profile_embeddings(db, candidate)
        if not get_primary_media_url(candidate):
            continue
        if _reciprocal_preference_fit(viewer_profile, candidate) == 0.0:
            continue
        ranked.append(_score_candidate(viewer_profile, candidate))

    ranked.sort(key=lambda item: item.final_score, reverse=True)
    return ranked[:limit]


def build_discovery_card_payload(candidate: RankedCandidate) -> dict[str, object]:
    profile = candidate.profile
    return {
        "user_id": profile.user_id,
        "display_name": get_display_name(profile),
        "age": _calculate_age(profile) or 0,
        "teaser": _stringify(profile.basic_profile.get("bio")) or "Building a thoughtful profile.",
        "match_score": round(candidate.final_score, 4),
        "image_url": get_primary_media_url(profile),
        "distance_label": get_location_label(profile),
        "verified": bool(profile.user and profile.user.is_verified),
        "location": get_location_label(profile),
        "job_title": _stringify(profile.basic_profile.get("job_title")) or "Career details coming soon",
        "interests": get_interest_list(profile),
        "lifestyle": _stringify(profile.lifestyle) or "Lifestyle details coming soon",
        "personality": _stringify(profile.personality) or "Personality details coming soon",
        "prompt_answer": get_prompt_answer(profile),
    }


def build_match_summary_payload(candidate: RankedCandidate) -> dict[str, object]:
    profile = candidate.profile
    return {
        "match_id": f"candidate:{profile.user_id}",
        "other_user_name": get_display_name(profile),
        "compatibility_score": round(candidate.final_score, 4),
        "image_url": get_primary_media_url(profile),
        "is_new": candidate.final_score >= 0.7,
    }


async def get_match_explanation(
    db: AsyncSession,
    *,
    viewer_user: User,
    match_id: str,
) -> tuple[float, str, str, list[str]]:
    if not match_id.startswith("candidate:"):
        raise ValueError("Unknown match id.")

    candidate_user_id = match_id.split("candidate:", 1)[1]
    ranked_candidates = await get_ranked_candidates(db, viewer_user, limit=50)
    candidate = next((item for item in ranked_candidates if item.profile.user_id == candidate_user_id), None)
    if candidate is None:
        raise ValueError("Match candidate not found.")

    viewer_profile = await ProfileRepository(db).get_by_user_id(viewer_user.id, with_relations=True)
    viewer_name = get_display_name(viewer_profile) if viewer_profile else "You"
    candidate_name = get_display_name(candidate.profile)
    gemini_client = get_gemini_client()
    summary, factors = await gemini_client.generate_match_copy(
        viewer_name=viewer_name,
        candidate_name=candidate_name,
        score=candidate.final_score,
        factors=candidate.top_factors,
    )
    return candidate.final_score, settings.gemini_compatibility_model, summary, factors
