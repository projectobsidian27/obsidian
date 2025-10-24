from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import RedirectResponse
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, timedelta
import secrets
import os
import httpx

router = APIRouter(prefix="/auth", tags=["auth"])

# HubSpot OAuth configuration
HUBSPOT_CLIENT_ID = os.getenv("HUBSPOT_CLIENT_ID")
HUBSPOT_CLIENT_SECRET = os.getenv("HUBSPOT_CLIENT_SECRET")
HUBSPOT_REDIRECT_URI = "https://obsidian-api-iyhx.onrender.com/auth/hubspot/callback"
FRONTEND_URL = os.getenv("FRONTEND_URL", "https://obsidian-nick-misewiczs-projects-e72f50c6.vercel.app")


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


# HubSpot OAuth Flow
@router.get("/hubspot/connect")
async def hubspot_connect():
    """
    Initiate HubSpot OAuth flow.
    Redirects user to HubSpot authorization page.
    """
    if not HUBSPOT_CLIENT_ID:
        raise HTTPException(status_code=500, detail="HubSpot Client ID not configured")

    state = secrets.token_urlsafe(32)
    # TODO: Store state in session/Redis for CSRF protection

    scopes = [
        "crm.objects.deals.read",
        "crm.objects.contacts.read",
        "crm.objects.companies.read",
        "crm.objects.owners.read",
        "crm.schemas.deals.read",
        "timeline"
    ]

    auth_url = (
        f"https://app.hubspot.com/oauth/authorize"
        f"?client_id={HUBSPOT_CLIENT_ID}"
        f"&redirect_uri={HUBSPOT_REDIRECT_URI}"
        f"&scope={' '.join(scopes)}"
        f"&state={state}"
    )

    return RedirectResponse(url=auth_url)


@router.get("/hubspot/callback")
async def hubspot_callback(code: str, state: str):
    """
    Handle HubSpot OAuth callback.
    Exchange authorization code for access token.
    """
    if not HUBSPOT_CLIENT_ID or not HUBSPOT_CLIENT_SECRET:
        raise HTTPException(status_code=500, detail="HubSpot credentials not configured")

    # TODO: Verify state token for CSRF protection

    # Exchange code for access token
    token_url = "https://api.hubapi.com/oauth/v1/token"

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                token_url,
                data={
                    "grant_type": "authorization_code",
                    "client_id": HUBSPOT_CLIENT_ID,
                    "client_secret": HUBSPOT_CLIENT_SECRET,
                    "redirect_uri": HUBSPOT_REDIRECT_URI,
                    "code": code
                },
                headers={"Content-Type": "application/x-www-form-urlencoded"}
            )

            if response.status_code != 200:
                raise HTTPException(
                    status_code=400,
                    detail=f"Failed to exchange code for token: {response.text}"
                )

            token_data = response.json()
            access_token = token_data.get("access_token")
            refresh_token = token_data.get("refresh_token")
            expires_in = token_data.get("expires_in")

            # TODO: Store tokens securely in database (encrypted)
            # TODO: Create/update crm_connections record

            # Redirect to frontend with success
            redirect_url = f"{FRONTEND_URL}/onboarding/scanning?status=connected&crm=hubspot"
            return RedirectResponse(url=redirect_url)

        except httpx.RequestError as e:
            raise HTTPException(status_code=500, detail=f"Error connecting to HubSpot: {str(e)}")


@router.get("/hubspot/status")
async def hubspot_status():
    """
    Check if HubSpot OAuth is properly configured.
    """
    return {
        "configured": bool(HUBSPOT_CLIENT_ID and HUBSPOT_CLIENT_SECRET),
        "redirect_uri": HUBSPOT_REDIRECT_URI
    }
