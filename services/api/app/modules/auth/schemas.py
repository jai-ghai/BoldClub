from enum import StrEnum

from pydantic import BaseModel, model_validator

from app.schemas.bootstrap import AccountStatus, AuthProvider, OnboardingStepId


class OtpPurpose(StrEnum):
    SIGNUP = "signup"
    LOGIN = "login"


class SignupRequest(BaseModel):
    provider: AuthProvider
    email: str | None = None
    phone_number: str | None = None
    password: str | None = None
    oauth_token: str | None = None

    @model_validator(mode="after")
    def validate_for_provider(self) -> "SignupRequest":
        if self.provider == AuthProvider.EMAIL:
            if not self.email:
                raise ValueError("Email signup requires an email.")

        elif self.provider == AuthProvider.PHONE:
            if not self.phone_number:
                raise ValueError("Phone signup requires a phone number.")

        elif self.provider in {AuthProvider.GOOGLE, AuthProvider.APPLE}:
            if not self.oauth_token:
                raise ValueError("OAuth signup requires an oauth_token.")

        return self


class LoginRequest(BaseModel):
    provider: AuthProvider
    email: str | None = None
    phone_number: str | None = None
    password: str | None = None
    oauth_token: str | None = None

    @model_validator(mode="after")
    def validate_for_provider(self) -> "LoginRequest":
        if self.provider == AuthProvider.EMAIL:
            if not self.email:
                raise ValueError("Email login requires an email.")

        elif self.provider == AuthProvider.PHONE:
            if not self.phone_number:
                raise ValueError("Phone login requires a phone number.")

        elif self.provider in {AuthProvider.GOOGLE, AuthProvider.APPLE}:
            if not self.oauth_token:
                raise ValueError("OAuth login requires an oauth_token.")

        return self


class VerifyOtpRequest(BaseModel):
    provider: AuthProvider
    destination: str
    otp_code: str
    purpose: OtpPurpose

    @model_validator(mode="after")
    def validate_for_provider(self) -> "VerifyOtpRequest":
        if self.provider not in {AuthProvider.EMAIL, AuthProvider.PHONE}:
            raise ValueError("OTP verification is only supported for email or phone.")

        return self


class ResendOtpRequest(BaseModel):
    provider: AuthProvider
    destination: str
    purpose: OtpPurpose

    @model_validator(mode="after")
    def validate_for_provider(self) -> "ResendOtpRequest":
        if self.provider not in {AuthProvider.EMAIL, AuthProvider.PHONE}:
            raise ValueError("OTP resend is only supported for email or phone.")

        return self


class AuthSessionResponse(BaseModel):
    user_id: str
    account_status: AccountStatus
    requires_otp: bool
    next_route: str
    access_token: str | None = None
    refresh_token: str | None = None
    token_type: str | None = None
    verification_target: str | None = None
    onboarding_step: OnboardingStepId | None = None
    is_profile_complete: bool = False


class LogoutResponse(BaseModel):
    success: bool
