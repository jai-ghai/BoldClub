from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_active_user
from app.db.session import get_db_session
from app.models.user import User
from app.modules.matching.service import build_discovery_card_payload, get_ranked_candidates

router = APIRouter(prefix="/discovery", tags=["discovery"])


class DiscoveryCard(BaseModel):
    user_id: str
    display_name: str
    age: int
    teaser: str
    match_score: float
    image_url: str
    distance_label: str
    verified: bool
    location: str
    job_title: str
    interests: list[str]
    lifestyle: str
    personality: str
    prompt_answer: str


@router.get("/feed", response_model=list[DiscoveryCard])
async def get_discovery_feed(
    db: AsyncSession = Depends(get_db_session),
    user: User = Depends(get_active_user),
) -> list[DiscoveryCard]:
    ranked_candidates = await get_ranked_candidates(db, user)
    return [DiscoveryCard(**build_discovery_card_payload(candidate)) for candidate in ranked_candidates]
