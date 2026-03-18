from __future__ import annotations

from dataclasses import dataclass

import httpx

from app.core.config import settings


@dataclass(frozen=True)
class OtpDeliveryResult:
    channel: str
    destination: str
    provider: str
    delivered: bool


class OtpGateway:
    async def send_code(self, *, destination: str, code: str, channel: str) -> OtpDeliveryResult:
        raise NotImplementedError


class DevelopmentOtpGateway(OtpGateway):
    async def send_code(self, *, destination: str, code: str, channel: str) -> OtpDeliveryResult:
        print(f"[DEV OTP] channel={channel} destination={destination} code={code}")
        return OtpDeliveryResult(channel=channel, destination=destination, provider="development", delivered=True)


class TwilioOtpGateway(OtpGateway):
    async def send_code(self, *, destination: str, code: str, channel: str) -> OtpDeliveryResult:
        if channel != "sms":
            raise ValueError("Twilio gateway only supports sms delivery.")

        if not settings.twilio_account_sid or not settings.twilio_auth_token:
            raise RuntimeError("Twilio credentials are not configured.")

        from_number = settings.twilio_from_number
        if not from_number:
            raise RuntimeError("Twilio from number is not configured.")

        url = f"https://api.twilio.com/2010-04-01/Accounts/{settings.twilio_account_sid}/Messages.json"
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                url,
                auth=(settings.twilio_account_sid, settings.twilio_auth_token),
                data={
                    "To": destination,
                    "From": from_number,
                    "Body": f"Your BoldClub verification code is {code}",
                },
            )
            response.raise_for_status()

        return OtpDeliveryResult(channel=channel, destination=destination, provider="twilio", delivered=True)


class ResendOtpGateway(OtpGateway):
    async def send_code(self, *, destination: str, code: str, channel: str) -> OtpDeliveryResult:
        if channel != "email":
            raise ValueError("Resend gateway only supports email delivery.")

        if not settings.resend_api_key or not settings.otp_email_from:
            raise RuntimeError("Resend credentials are not configured.")

        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                "https://api.resend.com/emails",
                headers={
                    "Authorization": f"Bearer {settings.resend_api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "from": settings.otp_email_from,
                    "to": [destination],
                    "subject": "Your BoldClub verification code",
                    "html": f"<p>Your BoldClub verification code is <strong>{code}</strong>.</p>",
                },
            )
            response.raise_for_status()

        return OtpDeliveryResult(channel=channel, destination=destination, provider="resend", delivered=True)


def get_otp_gateway(channel: str) -> OtpGateway:
    if channel == "sms" and settings.otp_sms_provider == "twilio":
        return TwilioOtpGateway()

    if channel == "email" and settings.otp_email_provider == "resend":
        return ResendOtpGateway()

    return DevelopmentOtpGateway()
