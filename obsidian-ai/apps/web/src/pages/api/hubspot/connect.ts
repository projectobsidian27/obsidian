import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const HUBSPOT_CLIENT_ID = process.env.HUBSPOT_CLIENT_ID;
  const CALLBACK_URL = `${process.env.NEXT_PUBLIC_URL || 'https://obsidian-nick-misewiczs-projects-e72f50c6.vercel.app'}/api/hubspot/callback`;

  if (!HUBSPOT_CLIENT_ID) {
    return res.status(500).json({ error: 'HubSpot Client ID not configured' });
  }

  // Generate state token for CSRF protection
  const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

  // TODO: Store state in session/cookie for verification in callback

  const scopes = [
    'crm.objects.deals.read',
    'crm.objects.contacts.read',
    'crm.objects.companies.read',
    'crm.objects.owners.read',
    'crm.schemas.deals.read',
    'timeline'
  ];

  const authUrl = new URL('https://app.hubspot.com/oauth/authorize');
  authUrl.searchParams.set('client_id', HUBSPOT_CLIENT_ID);
  authUrl.searchParams.set('redirect_uri', CALLBACK_URL);
  authUrl.searchParams.set('scope', scopes.join(' '));
  authUrl.searchParams.set('state', state);

  // Redirect to HubSpot authorization page
  res.redirect(302, authUrl.toString());
}
