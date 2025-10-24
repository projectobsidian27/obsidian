import type { NextApiRequest, NextApiResponse } from 'next';
import { query, encryptToken } from '../../../lib/db';

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

    // Store tokens in database
    try {
      // Get qualification data from localStorage (via session/cookie in production)
      // For now, we'll create a user with just the hub_id as identifier
      const email = `hubspot_${hub_id}@temp.obsidian.app`; // Temporary email until we implement proper auth

      // Upsert user
      const userResult = await query(
        `INSERT INTO users (email, auth0_user_id, metadata)
         VALUES ($1, $2, $3::jsonb)
         ON CONFLICT (email)
         DO UPDATE SET last_login = NOW(), metadata = $3::jsonb
         RETURNING id`,
        [email, `hubspot_${hub_id}`, JSON.stringify({ hub_id, user_id })]
      );

      const userId = userResult.rows[0].id;

      // Calculate token expiration
      const expiresAt = new Date(Date.now() + expires_in * 1000);

      // Encrypt and store tokens
      const encryptedAccessToken = encryptToken(access_token);
      const encryptedRefreshToken = refresh_token ? encryptToken(refresh_token) : null;

      // Upsert CRM connection
      await query(
        `INSERT INTO crm_connections (
          user_id, crm_type, access_token_encrypted, refresh_token_encrypted,
          token_expires_at, tenant_id, is_active, metadata
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb)
         ON CONFLICT (user_id, crm_type)
         DO UPDATE SET
           access_token_encrypted = $3,
           refresh_token_encrypted = $4,
           token_expires_at = $5,
           tenant_id = $6,
           is_active = $7,
           last_sync_at = NOW(),
           metadata = $8::jsonb`,
        [
          userId,
          'hubspot',
          encryptedAccessToken,
          encryptedRefreshToken,
          expiresAt,
          hub_id.toString(),
          true,
          JSON.stringify({ user_id, connected_via: 'oauth' })
        ]
      );

      console.log('Tokens stored successfully in database');
    } catch (dbError) {
      console.error('Database error storing tokens:', dbError);
      // Don't fail the OAuth flow if database fails - redirect anyway
    }

    // Redirect to scanning page with success
    res.redirect('/onboarding/scanning?status=connected&crm=hubspot&hub_id=' + hub_id);

  } catch (error) {
    console.error('HubSpot OAuth error:', error);
    return res.redirect(
      `/onboarding/connect-crm?error=oauth_failed&details=${encodeURIComponent(String(error))}`
    );
  }
}
