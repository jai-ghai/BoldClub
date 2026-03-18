from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.core.dependencies import get_active_user
from app.models.user import User

router = APIRouter(prefix="/matches", tags=["matches"])


class MatchSummary(BaseModel):
    match_id: str
    other_user_name: str
    compatibility_score: float
    image_url: str
    is_new: bool


@router.get("/", response_model=list[MatchSummary])
async def list_matches(_: User = Depends(get_active_user)) -> list[MatchSummary]:
    return [
        MatchSummary(
            match_id="match_demo_001",
            other_user_name="Kavya",
            compatibility_score=0.82,
            image_url="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop",
            is_new=True,
        ),
        MatchSummary(
            match_id="match_demo_002",
            other_user_name="Meera",
            compatibility_score=0.88,
            image_url="https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&h=200&fit=crop",
            is_new=True,
        ),
    ]
