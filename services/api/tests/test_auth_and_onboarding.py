from __future__ import annotations


def _auth_header(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


def test_bootstrap_without_session_is_unauthenticated(client) -> None:
    response = client.get("/v1/bootstrap")

    assert response.status_code == 200
    body = response.json()
    assert body["account_status"] == "unauthenticated"
    assert body["enabled_tabs"] == []
    assert body["supported_auth_providers"] == ["email", "phone", "google", "apple"]


def test_email_signup_verify_and_complete_onboarding_flow(client) -> None:
    signup_response = client.post(
        "/v1/auth/signup",
        json={"provider": "email", "email": "aliya@example.com", "password": "secret123"},
    )
    assert signup_response.status_code == 200
    signup_body = signup_response.json()
    assert signup_body["requires_otp"] is True
    assert signup_body["account_status"] == "pending_verification"
    assert signup_body["verification_target"] == "aliya@example.com"

    verify_response = client.post(
        "/v1/auth/verify-otp",
        json={
            "provider": "email",
            "destination": "aliya@example.com",
            "otp_code": "123456",
            "purpose": "signup",
        },
    )
    assert verify_response.status_code == 200
    verify_body = verify_response.json()
    assert verify_body["account_status"] == "onboarding_in_progress"
    assert verify_body["access_token"]
    token = verify_body["access_token"]

    bootstrap_before = client.get("/v1/bootstrap", headers=_auth_header(token))
    assert bootstrap_before.status_code == 200
    assert bootstrap_before.json()["enabled_tabs"] == []

    start_response = client.post("/v1/onboarding/start", headers=_auth_header(token))
    assert start_response.status_code == 200
    assert start_response.json()["current_step"] == "basic-profile"

    basic_profile_response = client.put(
        "/v1/onboarding/basic-profile",
        headers=_auth_header(token),
        json={"payload": {"name": "Aliya", "dob": "1998-06-01"}},
    )
    assert basic_profile_response.status_code == 200
    assert basic_profile_response.json()["current_step"] == "media"

    skip_prompts_response = client.post(
        "/v1/onboarding/prompts/skip",
        headers=_auth_header(token),
        json={"reason": "later"},
    )
    assert skip_prompts_response.status_code == 200
    assert "prompts" in skip_prompts_response.json()["skipped_steps"]

    premature_complete = client.post("/v1/onboarding/complete", headers=_auth_header(token))
    assert premature_complete.status_code == 400
    assert premature_complete.json()["detail"]["required_steps_remaining"] == ["media", "preferences"]

    media_response = client.put(
        "/v1/onboarding/media",
        headers=_auth_header(token),
        json={"payload": {"hero_media_url": "https://example.com/hero.jpg"}},
    )
    assert media_response.status_code == 200

    preferences_response = client.put(
        "/v1/onboarding/preferences",
        headers=_auth_header(token),
        json={"payload": {"age_min": 24, "age_max": 32, "distance_km": 25}},
    )
    assert preferences_response.status_code == 200

    complete_response = client.post("/v1/onboarding/complete", headers=_auth_header(token))
    assert complete_response.status_code == 200
    complete_body = complete_response.json()
    assert complete_body["account_status"] == "active"
    assert complete_body["is_profile_complete"] is True

    bootstrap_after = client.get("/v1/bootstrap", headers=_auth_header(token))
    assert bootstrap_after.status_code == 200
    assert bootstrap_after.json()["enabled_tabs"] == [
        "personality",
        "likes",
        "discover",
        "chat",
        "profile",
    ]

    discovery_response = client.get("/v1/discovery/feed", headers=_auth_header(token))
    assert discovery_response.status_code == 200


def test_required_onboarding_step_cannot_be_skipped(client) -> None:
    signup_response = client.post(
        "/v1/auth/signup",
        json={"provider": "email", "email": "skiptest@example.com", "password": "secret123"},
    )
    assert signup_response.status_code == 200

    verify_response = client.post(
        "/v1/auth/verify-otp",
        json={
            "provider": "email",
            "destination": "skiptest@example.com",
            "otp_code": "123456",
            "purpose": "signup",
        },
    )
    token = verify_response.json()["access_token"]

    skip_response = client.post(
        "/v1/onboarding/basic-profile/skip",
        headers=_auth_header(token),
        json={"reason": "not allowed"},
    )

    assert skip_response.status_code == 400
    assert skip_response.json()["detail"] == "basic-profile cannot be skipped."


def test_phone_login_requires_otp_for_existing_user(client) -> None:
    signup_response = client.post(
        "/v1/auth/signup",
        json={"provider": "phone", "phone_number": "+15551234567"},
    )
    assert signup_response.status_code == 200

    verify_response = client.post(
        "/v1/auth/verify-otp",
        json={
            "provider": "phone",
            "destination": "+15551234567",
            "otp_code": "123456",
            "purpose": "signup",
        },
    )
    token = verify_response.json()["access_token"]

    client.put(
        "/v1/onboarding/basic-profile",
        headers=_auth_header(token),
        json={"payload": {"name": "Ira"}},
    )
    client.put(
        "/v1/onboarding/media",
        headers=_auth_header(token),
        json={"payload": {"hero_media_url": "https://example.com/hero.jpg"}},
    )
    client.put(
        "/v1/onboarding/preferences",
        headers=_auth_header(token),
        json={"payload": {"age_min": 25, "age_max": 35}},
    )
    client.post("/v1/onboarding/complete", headers=_auth_header(token))

    login_response = client.post(
        "/v1/auth/login",
        json={"provider": "phone", "phone_number": "+15551234567"},
    )
    assert login_response.status_code == 200
    login_body = login_response.json()
    assert login_body["requires_otp"] is True
    assert login_body["account_status"] == "active"
    assert login_body["verification_target"] == "+15551234567"


def test_email_passwordless_login_requires_otp_for_existing_user(client) -> None:
    signup_response = client.post(
        "/v1/auth/signup",
        json={"provider": "email", "email": "otpflow@example.com"},
    )
    assert signup_response.status_code == 200

    verify_response = client.post(
        "/v1/auth/verify-otp",
        json={
            "provider": "email",
            "destination": "otpflow@example.com",
            "otp_code": "123456",
            "purpose": "signup",
        },
    )
    assert verify_response.status_code == 200

    login_response = client.post(
        "/v1/auth/login",
        json={"provider": "email", "email": "otpflow@example.com"},
    )
    assert login_response.status_code == 200
    login_body = login_response.json()
    assert login_body["requires_otp"] is True
    assert login_body["account_status"] == "onboarding_in_progress"
    assert login_body["verification_target"] == "otpflow@example.com"


def test_oauth_signup_requires_oauth_token(client) -> None:
    response = client.post("/v1/auth/signup", json={"provider": "apple"})

    assert response.status_code == 422


def test_pause_resume_and_delete_account_flow(client) -> None:
    signup_response = client.post(
        "/v1/auth/signup",
        json={"provider": "email", "email": "pause@example.com", "password": "secret123"},
    )
    assert signup_response.status_code == 200

    verify_response = client.post(
        "/v1/auth/verify-otp",
        json={
            "provider": "email",
            "destination": "pause@example.com",
            "otp_code": "123456",
            "purpose": "signup",
        },
    )
    token = verify_response.json()["access_token"]
    headers = _auth_header(token)

    client.put(
        "/v1/onboarding/basic-profile",
        headers=headers,
        json={"payload": {"name": "Pause User"}},
    )
    client.put(
        "/v1/onboarding/media",
        headers=headers,
        json={"payload": {"hero_media_url": "https://example.com/hero.jpg"}},
    )
    client.put(
        "/v1/onboarding/preferences",
        headers=headers,
        json={"payload": {"age_min": 24, "age_max": 34}},
    )
    client.post("/v1/onboarding/complete", headers=headers)

    pause_response = client.post("/v1/account/pause", headers=headers, json={"reason": "Taking a break"})
    assert pause_response.status_code == 200
    assert pause_response.json()["account_status"] == "paused"
    assert pause_response.json()["next_route"] == "/(tabs)/profile"

    paused_bootstrap = client.get("/v1/bootstrap", headers=headers)
    assert paused_bootstrap.status_code == 200
    assert paused_bootstrap.json()["enabled_tabs"] == ["profile"]

    resume_response = client.post("/v1/account/resume", headers=headers)
    assert resume_response.status_code == 200
    assert resume_response.json()["account_status"] == "active"

    delete_response = client.request(
        "DELETE",
        "/v1/account",
        headers=headers,
        json={"reason": "Not using dating apps right now"},
    )
    assert delete_response.status_code == 200
    assert delete_response.json()["success"] is True

    discovery_after_delete = client.get("/v1/discovery/feed", headers=headers)
    assert discovery_after_delete.status_code == 401
