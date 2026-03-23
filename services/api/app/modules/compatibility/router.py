from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_active_user
from app.db.session import get_db_session
from app.models.user import User
from app.modules.matching.service import get_match_explanation

router = APIRouter(prefix="/compatibility", tags=["compatibility"])


class CompatibilityExplanation(BaseModel):
    match_id: str
    score: float
    model: str
    summary: str
    factors: list[str]


@router.get("/matches/{match_id}/explanation", response_model=CompatibilityExplanation)
async def get_match_explanation_route(
    match_id: str,
    db: AsyncSession = Depends(get_db_session),
    user: User = Depends(get_active_user),
) -> CompatibilityExplanation:
    try:
        score, model, summary, factors = await get_match_explanation(db, viewer_user=user, match_id=match_id)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc

    return CompatibilityExplanation(
        match_id=match_id,
        score=round(score, 4),
        model=model,
        summary=summary,
        factors=factors,
    )
