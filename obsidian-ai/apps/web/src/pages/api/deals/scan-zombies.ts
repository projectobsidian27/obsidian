import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../lib/db';
import { fetchHubSpotDeals, fetchHubSpotOwners, transformHubSpotDeal } from '../../../lib/hubspot';
import { createZombieDealAlert, getUserIdByHubSpotOwner } from '../../../lib/notifications';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get most recent HubSpot connection
    const userResult = await query(
      `SELECT id FROM users WHERE auth0_user_id LIKE 'hubspot_%' ORDER BY last_login DESC LIMIT 1`
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'No HubSpot connection found' });
    }

    const userId = userResult.rows[0].id;

    // Fetch deals and owners in parallel
    const [deals, owners] = await Promise.all([
      fetchHubSpotDeals(userId),
      fetchHubSpotOwners(userId),
    ]);

    if (!deals || deals.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No deals to scan',
        zombieCount: 0,
        notificationsCreated: 0,
      });
    }

    // Create owner map for name lookup
    const ownerMap = new Map<string, string>();
    if (owners && Array.isArray(owners)) {
      owners.forEach((owner: { id: string; firstName?: string; lastName?: string }) => {
        const name = `${owner.firstName || ''} ${owner.lastName || ''}`.trim() || 'Unknown';
        ownerMap.set(owner.id, name);
      });
    }

    // Transform deals and find zombies
    const transformedDeals = deals.map(deal => transformHubSpotDeal(deal, ownerMap));
    const zombieDeals = transformedDeals.filter(deal => deal.status === 'zombie');

    // Create notifications for zombie deals
    let notificationsCreated = 0;
    const notificationPromises = zombieDeals.map(async (deal) => {
      // TODO: Map HubSpot owner to actual user ID
      // For now, use the connected user's ID
      const targetUserId = userId;

      const notificationId = await createZombieDealAlert({
        userId: targetUserId,
        dealName: deal.name,
        dealId: deal.id,
        dealAmount: deal.amount,
        daysSinceActivity: deal.daysSinceLastActivity,
        dealAge: deal.dealAge,
        healthScore: deal.healthScore,
      });

      if (notificationId) {
        notificationsCreated++;
      }
    });

    await Promise.all(notificationPromises);

    return res.status(200).json({
      success: true,
      message: `Scanned ${deals.length} deals and found ${zombieDeals.length} zombie deals`,
      totalDeals: deals.length,
      zombieCount: zombieDeals.length,
      notificationsCreated,
      zombieDeals: zombieDeals.map(deal => ({
        id: deal.id,
        name: deal.name,
        owner: deal.owner,
        healthScore: deal.healthScore,
        daysSinceActivity: deal.daysSinceLastActivity,
      })),
    });
  } catch (error) {
    console.error('Error scanning for zombie deals:', error);
    return res.status(500).json({
      error: 'Failed to scan for zombie deals',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
