import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.query;
  // const state = req.query.state; // TODO: Verify state token for CSRF protection

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Missing authorization code' });
  }

  const HUBSPOT_CLIENT_ID = process.env.HUBSPOT_CLIENT_ID;
  const HUBSPOT_CLIENT_SECRET = process.env.HUBSPOT_CLIENT_SECRET;
  const CALLBACK_URL = `${process.env.NEXT_PUBLIC_URL || 'https://obsidian-nick-misewiczs-projects-e72f50c6.vercel.app'}/api/hubspot/callback`;

  if (!HUBSPOT_CLIENT_ID || !HUBSPOT_CLIENT_SECRET) {
    return res.status(500).json({ error: 'HubSpot credentials not configured' });
  }

  try {
    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://api.hubapi.com/oauth/v1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: HUBSPOT_CLIENT_ID,
        client_secret: HUBSPOT_CLIENT_SECRET,
        redirect_uri: CALLBACK_URL,
        code: code,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('HubSpot token exchange failed:', errorText);
      return res.redirect(
        `/onboarding/connect-crm?error=token_exchange_failed&details=${encodeURIComponent(errorText)}`
      );
    }

    const tokenData = await tokenResponse.json();
    const { access_token, refresh_token, expires_in } = tokenData;

    // TODO: Store tokens securely in database
    // For MVP, we'll just verify the token works by fetching account info
    const accountResponse = await fetch('https://api.hubapi.com/oauth/v1/access-tokens/' + access_token);

    if (!accountResponse.ok) {
      console.error('Failed to verify HubSpot token');
      return res.redirect('/onboarding/connect-crm?error=token_verification_failed');
    }

    const accountData = await accountResponse.json();
    const { hub_id, user_id } = accountData;

    console.log('HubSpot OAuth successful:', {
      hub_id,
      user_id,
      expires_in,
      has_refresh_token: !!refresh_token
    });

    // TODO: Store in database:
    // - access_token (encrypted)
    // - refresh_token (encrypted)
    // - expires_at (current time + expires_in)
    // - hub_id
    // - user_id

    // Redirect to scanning page with success
    res.redirect('/onboarding/scanning?status=connected&crm=hubspot&hub_id=' + hub_id);

  } catch (error) {
    console.error('HubSpot OAuth error:', error);
    return res.redirect(
      `/onboarding/connect-crm?error=oauth_failed&details=${encodeURIComponent(String(error))}`
    );
  }
}
