from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.core.config import settings
from app.core.dependencies import get_active_user
from app.models.user import User

router = APIRouter(prefix="/compatibility", tags=["compatibility"])


class CompatibilityExplanation(BaseModel):
    match_id: str
    score: float
    model: str
    summary: str
    factors: list[str]


@router.get("/matches/{match_id}/explanation", response_model=CompatibilityExplanation)
async def get_match_explanation(match_id: str, _: User = Depends(get_active_user)) -> CompatibilityExplanation:
    return CompatibilityExplanation(
        match_id=match_id,
        score=0.82,
        model=settings.openai_compatibility_model,
        summary="You align on intentional dating, quieter routines, and outdoor energy without feeling identical.",
        factors=[
            "Shared interests in hiking and calm weekends.",
            "Compatible relationship goals and communication pace.",
            "Lifestyle overlap strong enough to make first conversations easier.",
        ],
    )
