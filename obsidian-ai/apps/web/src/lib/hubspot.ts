// HubSpot API client with automatic token refresh
import { query, decryptToken, encryptToken } from './db';

interface HubSpotTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  hubId: string;
  userId: string;
}

interface HubSpotDeal {
  id: string;
  properties: {
    dealname: string;
    amount: string;
    dealstage: string;
    hubspot_owner_id: string;
    createdate: string;
    closedate: string;
    notes_last_updated: string;
    hs_lastmodifieddate: string;
    pipeline: string;
    hs_deal_stage_probability: string;
  };
}

/**
 * Get HubSpot tokens for a user from database
 */
export async function getHubSpotTokens(userId: string): Promise<HubSpotTokens | null> {
  try {
    const result = await query(
      `SELECT
        access_token_encrypted,
        refresh_token_encrypted,
        token_expires_at,
        tenant_id,
        metadata
       FROM crm_connections
       WHERE user_id = $1 AND crm_type = 'hubspot' AND is_active = true
       LIMIT 1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    const metadata = row.metadata || {};

    return {
      accessToken: decryptToken(row.access_token_encrypted),
      refreshToken: row.refresh_token_encrypted ? decryptToken(row.refresh_token_encrypted) : '',
      expiresAt: new Date(row.token_expires_at),
      hubId: row.tenant_id,
      userId: metadata.user_id || '',
    };
  } catch (error) {
    console.error('Error getting HubSpot tokens:', error);
    return null;
  }
}

/**
 * Refresh HubSpot access token
 */
async function refreshAccessToken(userId: string, refreshToken: string): Promise<string | null> {
  try {
    const response = await fetch('https://api.hubapi.com/oauth/v1/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: process.env.HUBSPOT_CLIENT_ID || '',
        client_secret: process.env.HUBSPOT_CLIENT_SECRET || '',
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      console.error('Failed to refresh HubSpot token:', await response.text());
      return null;
    }

    const data = await response.json();
    const newAccessToken = data.access_token;
    const newRefreshToken = data.refresh_token || refreshToken;
    const expiresIn = data.expires_in;

    // Update tokens in database
    const expiresAt = new Date(Date.now() + expiresIn * 1000);
    await query(
      `UPDATE crm_connections
       SET access_token_encrypted = $1,
           refresh_token_encrypted = $2,
           token_expires_at = $3,
           last_sync_at = NOW()
       WHERE user_id = $4 AND crm_type = 'hubspot'`,
      [
        encryptToken(newAccessToken),
        encryptToken(newRefreshToken),
        expiresAt,
        userId
      ]
    );

    return newAccessToken;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return null;
  }
}

/**
 * Get a valid HubSpot access token (refreshes if expired)
 */
export async function getValidAccessToken(userId: string): Promise<string | null> {
  const tokens = await getHubSpotTokens(userId);

  if (!tokens) {
    return null;
  }

  // Check if token is expired or will expire in next 5 minutes
  const now = new Date();
  const expiresIn5Min = new Date(now.getTime() + 5 * 60 * 1000);

  if (tokens.expiresAt <= expiresIn5Min) {
    console.log('Token expired or expiring soon, refreshing...');
    return await refreshAccessToken(userId, tokens.refreshToken);
  }

  return tokens.accessToken;
}

/**
 * Fetch all deals from HubSpot
 */
export async function fetchHubSpotDeals(userId: string): Promise<HubSpotDeal[]> {
  const accessToken = await getValidAccessToken(userId);

  if (!accessToken) {
    throw new Error('No valid HubSpot access token available');
  }

  try {
    const deals: HubSpotDeal[] = [];
    let after: string | undefined;

    // HubSpot pagination
    do {
      const url = new URL('https://api.hubapi.com/crm/v3/objects/deals');
      url.searchParams.set('limit', '100');
      url.searchParams.set('properties', [
        'dealname',
        'amount',
        'dealstage',
        'hubspot_owner_id',
        'createdate',
        'closedate',
        'notes_last_updated',
        'hs_lastmodifieddate',
        'pipeline',
        'hs_deal_stage_probability'
      ].join(','));

      if (after) {
        url.searchParams.set('after', after);
      }

      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HubSpot API error: ${response.status} ${await response.text()}`);
      }

      const data = await response.json();
      deals.push(...data.results);

      after = data.paging?.next?.after;
    } while (after);

    return deals;
  } catch (error) {
    console.error('Error fetching HubSpot deals:', error);
    throw error;
  }
}

/**
 * Fetch deal owners from HubSpot
 */
export async function fetchHubSpotOwners(userId: string) {
  const accessToken = await getValidAccessToken(userId);

  if (!accessToken) {
    throw new Error('No valid HubSpot access token available');
  }

  try {
    const response = await fetch('https://api.hubapi.com/crm/v3/owners', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HubSpot API error: ${response.status}`);
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching HubSpot owners:', error);
    throw error;
  }
}

/**
 * Transform HubSpot deal to our Deal format
 */
export function transformHubSpotDeal(hubspotDeal: HubSpotDeal, owners: Map<string, string>) {
  const props = hubspotDeal.properties;

  const createDate = new Date(props.createdate);
  const lastModified = new Date(props.hs_lastmodifieddate || props.notes_last_updated || props.createdate);
  const now = new Date();

  const dealAge = Math.floor((now.getTime() - createDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysSinceLastActivity = Math.floor((now.getTime() - lastModified.getTime()) / (1000 * 60 * 60 * 24));

  // Calculate health score based on activity and age
  let healthScore = 100;

  // Penalize for no recent activity
  if (daysSinceLastActivity > 30) healthScore -= 40;
  else if (daysSinceLastActivity > 14) healthScore -= 25;
  else if (daysSinceLastActivity > 7) healthScore -= 10;

  // Penalize for old age without progress
  if (dealAge > 90 && daysSinceLastActivity > 14) healthScore -= 30;
  else if (dealAge > 60 && daysSinceLastActivity > 7) healthScore -= 15;

  healthScore = Math.max(0, Math.min(100, healthScore));

  // Determine status
  let status: 'healthy' | 'at-risk' | 'zombie';
  if (healthScore >= 70) status = 'healthy';
  else if (healthScore >= 40) status = 'at-risk';
  else status = 'zombie';

  const ownerName = owners.get(props.hubspot_owner_id) || 'Unassigned';

  return {
    id: hubspotDeal.id,
    name: props.dealname || 'Untitled Deal',
    amount: parseFloat(props.amount || '0'),
    stage: props.dealstage || 'Unknown',
    owner: ownerName,
    ownerId: props.hubspot_owner_id || '',
    createDate: props.createdate,
    lastActivityDate: props.hs_lastmodifieddate || props.notes_last_updated || props.createdate,
    closeDate: props.closedate || null,
    dealAge,
    daysSinceLastActivity,
    contactCount: 0, // TODO: Fetch from associations
    companyName: '', // TODO: Fetch from associations
    healthScore,
    status,
    signals: {
      noRecentActivity: daysSinceLastActivity > 14,
      missingNextSteps: false, // TODO: Check for tasks
      stuckInStage: dealAge > 60,
      lowEngagement: daysSinceLastActivity > 30,
      ownershipGap: !props.hubspot_owner_id,
    },
  };
}
