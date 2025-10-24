from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, timedelta
import secrets

router = APIRouter(prefix="/auth", tags=["auth"])


class MagicLinkRequest(BaseModel):
    email: EmailStr


class MagicLinkResponse(BaseModel):
    message: str
    email: str


class VerifyTokenRequest(BaseModel):
    token: str


class VerifyTokenResponse(BaseModel):
    valid: bool
    user_id: Optional[str]
    email: Optional[str]


@router.post("/magic-link")
async def send_magic_link(request: MagicLinkRequest) -> MagicLinkResponse:
    """
    Send a magic link to the user's email for passwordless auth.
    """
    # TODO: Implement actual magic link generation and email sending
    # For now, just log and return success

    token = secrets.token_urlsafe(32)
    magic_link = f"https://obsidian.app/auth/verify?token={token}"

    # TODO: Send email with magic_link
    print(f"Magic link for {request.email}: {magic_link}")

    return MagicLinkResponse(
        message="Magic link sent! Check your email.",
        email=request.email
    )


@router.post("/verify")
async def verify_magic_token(request: VerifyTokenRequest) -> VerifyTokenResponse:
    """
    Verify a magic link token and return user session.
    """
    # TODO: Implement actual token verification
    # For now, accept any token

    return VerifyTokenResponse(
        valid=True,
        user_id="user_123",
        email="user@example.com"
    )


@router.post("/crm/connect")
async def connect_crm(crm_type: str, redirect_uri: str) -> dict:
    """
    Initiate OAuth flow for CRM connection.
    Returns authorization URL to redirect user to.
    """
    # TODO: Implement actual OAuth flow for HubSpot/Salesforce/Dynamics

    auth_urls = {
        "hubspot": "https://app.hubspot.com/oauth/authorize?client_id=YOUR_CLIENT_ID",
        "salesforce": "https://login.salesforce.com/services/oauth2/authorize",
        "dynamics": "https://login.microsoftonline.com/common/oauth2/v2.0/authorize"
    }

    if crm_type.lower() not in auth_urls:
        raise HTTPException(status_code=400, detail="Unsupported CRM type")

    return {
        "crm_type": crm_type,
        "authorization_url": auth_urls[crm_type.lower()],
        "state": secrets.token_urlsafe(16)
    }


@router.post("/crm/callback")
async def crm_oauth_callback(code: str, state: str) -> dict:
    """
    Handle OAuth callback from CRM provider.
    Exchange code for access token and store securely.
    """
    # TODO: Implement actual OAuth token exchange

    return {
        "status": "connected",
        "crm_type": "hubspot",
        "tenant_id": f"tenant_{datetime.now().timestamp()}"
    }
