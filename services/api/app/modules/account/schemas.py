from pydantic import BaseModel

from app.schemas.bootstrap import AccountStatus


class AccountStateResponse(BaseModel):
    user_id: str
    account_status: AccountStatus
    next_route: str
    is_profile_complete: bool


class PauseAccountRequest(BaseModel):
    reason: str | None = None


class DeleteAccountRequest(BaseModel):
    reason: str | None = None


class DeleteAccountResponse(BaseModel):
    success: bool
    next_route: str
