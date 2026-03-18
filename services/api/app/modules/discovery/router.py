from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.core.dependencies import get_active_user
from app.models.user import User

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
async def get_discovery_feed(_: User = Depends(get_active_user)) -> list[DiscoveryCard]:
    return [
        DiscoveryCard(
            user_id="profile_demo_001",
            display_name="Priya",
            age=26,
            teaser="Designer by day, stargazer by night",
            match_score=0.92,
            image_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop",
            distance_label="3 km away",
            verified=True,
            location="Bengaluru",
            job_title="UX Designer at Google",
            interests=["Travel", "Art", "Yoga", "Photography"],
            lifestyle="Early bird, loves hiking on weekends",
            personality="Creative, empathetic, and spontaneous",
            prompt_answer="Someone who makes me laugh even on bad days",
        ),
        DiscoveryCard(
            user_id="profile_demo_002",
            display_name="Neha",
            age=28,
            teaser="Coffee enthusiast and book lover",
            match_score=0.88,
            image_url="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop",
            distance_label="5 km away",
            verified=True,
            location="Bengaluru",
            job_title="Product Manager at Flipkart",
            interests=["Books", "Coffee", "Music", "Cooking"],
            lifestyle="Night owl, weekend chef",
            personality="Thoughtful, ambitious, and caring",
            prompt_answer="Deep conversations and comfortable silences",
        ),
    ]
