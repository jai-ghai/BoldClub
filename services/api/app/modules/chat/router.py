from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.core.config import settings
from app.core.dependencies import get_active_user
from app.models.user import User

router = APIRouter(prefix="/chat", tags=["chat"])


class ChatSessionResponse(BaseModel):
    match_id: str
    chat_provider: str
    ai_assist_model: str
    channel_id: str


class ChatThreadSummary(BaseModel):
    match_id: str
    other_user_name: str
    image_url: str
    last_message: str
    last_message_time: str
    unread_count: int
    is_online: bool


class ChatMessage(BaseModel):
    message_id: str
    text: str
    sent_by_me: bool
    sent_at_label: str


@router.get("/threads", response_model=list[ChatThreadSummary])
async def list_chat_threads(_: User = Depends(get_active_user)) -> list[ChatThreadSummary]:
    return [
        ChatThreadSummary(
            match_id="match_demo_001",
            other_user_name="Priya",
            image_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
            last_message="That museum date idea actually sounds perfect.",
            last_message_time="2m",
            unread_count=2,
            is_online=True,
        ),
        ChatThreadSummary(
            match_id="match_demo_002",
            other_user_name="Neha",
            image_url="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop",
            last_message="I know a coffee place you would love.",
            last_message_time="1h",
            unread_count=0,
            is_online=False,
        ),
    ]


@router.get("/threads/{match_id}/messages", response_model=list[ChatMessage])
async def list_chat_messages(match_id: str, _: User = Depends(get_active_user)) -> list[ChatMessage]:
    return [
        ChatMessage(message_id=f"{match_id}_1", text="You seem like someone who plans soft but memorable dates.", sent_by_me=False, sent_at_label="7:12 PM"),
        ChatMessage(message_id=f"{match_id}_2", text="That is suspiciously accurate.", sent_by_me=True, sent_at_label="7:13 PM"),
        ChatMessage(message_id=f"{match_id}_3", text="Museum and coffee this weekend?", sent_by_me=False, sent_at_label="7:14 PM"),
    ]


@router.post("/session/{match_id}", response_model=ChatSessionResponse)
async def create_chat_session(match_id: str, _: User = Depends(get_active_user)) -> ChatSessionResponse:
    return ChatSessionResponse(
        match_id=match_id,
        chat_provider="stream",
        ai_assist_model=settings.openai_chat_model,
        channel_id=f"match:{match_id}",
    )
