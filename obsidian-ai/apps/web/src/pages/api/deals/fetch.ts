import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchHubSpotDeals, fetchHubSpotOwners, transformHubSpotDeal } from '../../../lib/hubspot';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // TODO: Get userId from session/auth
    // For now, get the most recent HubSpot connection
    const { query: db } = await import('../../../lib/db');

    const userResult = await db(
      `SELECT id FROM users
       WHERE auth0_user_id LIKE 'hubspot_%'
       ORDER BY last_login DESC
       LIMIT 1`
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'No HubSpot connection found' });
    }

    const userId = userResult.rows[0].id;

    // Fetch deals and owners from HubSpot
    const [deals, owners] = await Promise.all([
      fetchHubSpotDeals(userId),
      fetchHubSpotOwners(userId),
    ]);

    // Create owner map for quick lookup
    const ownerMap = new Map(
      owners.map((owner: { id: string; firstName: string; lastName: string }) => [
        owner.id,
        `${owner.firstName} ${owner.lastName}`.trim() || owner.id
      ])
    );

    // Transform deals to our format
    const transformedDeals = deals.map(deal => transformHubSpotDeal(deal, ownerMap));

    // Calculate metrics
    const metrics = {
      totalDeals: transformedDeals.length,
      zombieDeals: transformedDeals.filter(d => d.status === 'zombie').length,
      atRiskDeals: transformedDeals.filter(d => d.status === 'at-risk').length,
      healthyDeals: transformedDeals.filter(d => d.status === 'healthy').length,
      totalValue: transformedDeals.reduce((sum, d) => sum + d.amount, 0),
      revenueAtRisk: transformedDeals
        .filter(d => d.status === 'zombie' || d.status === 'at-risk')
        .reduce((sum, d) => sum + d.amount, 0),
      avgDealAge: Math.round(
        transformedDeals.reduce((sum, d) => sum + d.dealAge, 0) / transformedDeals.length
      ),
    };

    return res.status(200).json({
      success: true,
      deals: transformedDeals,
      metrics,
      fetchedAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error fetching deals:', error);
    return res.status(500).json({
      error: 'Failed to fetch deals',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
