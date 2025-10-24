import type { NextApiRequest, NextApiResponse } from 'next';

// Simple Auth0 proxy handler
// For MVP, we'll create a basic implementation
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { auth0 } = req.query;
  const route = Array.isArray(auth0) ? auth0.join('/') : auth0;

  // For now, redirect to onboarding since we're in MVP mode
  if (route === 'login') {
    // In production, this would redirect to Auth0
    // For MVP, let's just go straight to onboarding
    res.redirect('/onboarding/trust-contract');
    return;
  }

  if (route === 'logout') {
    res.redirect('/');
    return;
  }

  if (route === 'callback') {
    res.redirect('/onboarding/trust-contract');
    return;
  }

  if (route === 'me') {
    res.status(200).json({ user: null });
    return;
  }

  res.status(404).json({ error: 'Not found' });
}
