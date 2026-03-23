from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_active_user
from app.db.session import get_db_session
from app.models.user import User
from app.modules.matching.service import build_match_summary_payload, get_ranked_candidates

router = APIRouter(prefix="/matches", tags=["matches"])


class MatchSummary(BaseModel):
    match_id: str
    other_user_name: str
    compatibility_score: float
    image_url: str
    is_new: bool


@router.get("/", response_model=list[MatchSummary])
async def list_matches(
    db: AsyncSession = Depends(get_db_session),
    user: User = Depends(get_active_user),
) -> list[MatchSummary]:
    ranked_candidates = await get_ranked_candidates(db, user)
    return [MatchSummary(**build_match_summary_payload(candidate)) for candidate in ranked_candidates[:10]]
