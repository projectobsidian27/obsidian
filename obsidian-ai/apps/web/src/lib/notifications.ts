import { query } from './db';

export type NotificationType = 'zombie_deal' | 'deal_milestone' | 'pipeline_health' | 'system' | 'action_required';
export type NotificationLevel = 'info' | 'warning' | 'critical' | 'success';

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  level: NotificationLevel;
  title: string;
  message: string;
  metadata?: Record<string, unknown>;
  actionUrl?: string;
  actionLabel?: string;
}

/**
 * Create a notification for a specific user
 */
export async function createNotification(params: CreateNotificationParams): Promise<string | null> {
  try {
    const {
      userId,
      type,
      level,
      title,
      message,
      metadata = {},
      actionUrl,
      actionLabel,
    } = params;

    const result = await query(
      `INSERT INTO notifications (
        user_id,
        type,
        level,
        title,
        message,
        metadata,
        action_url,
        action_label
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id`,
      [
        userId,
        type,
        level,
        title,
        message,
        JSON.stringify(metadata),
        actionUrl || null,
        actionLabel || null,
      ]
    );

    return result.rows[0].id;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
}

/**
 * Create a zombie deal alert for the deal owner
 */
export async function createZombieDealAlert(params: {
  userId: string;
  dealName: string;
  dealId: string;
  dealAmount: number;
  daysSinceActivity: number;
  dealAge: number;
  healthScore: number;
}): Promise<string | null> {
  const { userId, dealName, dealId, dealAmount, daysSinceActivity, dealAge, healthScore } = params;

  const level: NotificationLevel = healthScore < 30 ? 'critical' : 'warning';

  const message = `"${dealName}" has been inactive for ${daysSinceActivity} days (${dealAge} days old) with a health score of ${healthScore}%. This deal is at risk and needs immediate attention.`;

  return createNotification({
    userId,
    type: 'zombie_deal',
    level,
    title: `Zombie Deal Alert: ${dealName}`,
    message,
    metadata: {
      deal_id: dealId,
      deal_name: dealName,
      deal_amount: dealAmount,
      days_since_activity: daysSinceActivity,
      deal_age: dealAge,
      health_score: healthScore,
    },
    actionUrl: `/deals/${dealId}`,
    actionLabel: 'Review Deal',
  });
}

/**
 * Create a deal milestone notification
 */
export async function createDealMilestoneAlert(params: {
  userId: string;
  dealName: string;
  dealId: string;
  milestone: string;
  isPositive?: boolean;
}): Promise<string | null> {
  const { userId, dealName, dealId, milestone, isPositive = true } = params;

  return createNotification({
    userId,
    type: 'deal_milestone',
    level: isPositive ? 'success' : 'info',
    title: `Deal Update: ${dealName}`,
    message: milestone,
    metadata: {
      deal_id: dealId,
      deal_name: dealName,
      milestone,
    },
    actionUrl: `/deals/${dealId}`,
    actionLabel: 'View Deal',
  });
}

/**
 * Create a pipeline health alert
 */
export async function createPipelineHealthAlert(params: {
  userId: string;
  metric: string;
  currentValue: number;
  previousValue?: number;
  threshold?: number;
}): Promise<string | null> {
  const { userId, metric, currentValue, previousValue, threshold } = params;

  let level: NotificationLevel = 'info';
  const title = `Pipeline Alert: ${metric}`;
  let message = `Your ${metric} is currently ${currentValue}`;

  if (threshold && currentValue > threshold) {
    level = 'warning';
    message += `, which is above the threshold of ${threshold}`;
  }

  if (previousValue !== undefined) {
    const change = ((currentValue - previousValue) / previousValue) * 100;
    const direction = change > 0 ? 'increased' : 'decreased';
    message += `. This has ${direction} by ${Math.abs(change).toFixed(1)}% from ${previousValue}`;
  }

  return createNotification({
    userId,
    type: 'pipeline_health',
    level,
    title,
    message,
    metadata: {
      metric,
      current_value: currentValue,
      previous_value: previousValue,
      threshold,
    },
    actionUrl: '/dashboard',
    actionLabel: 'View Dashboard',
  });
}

/**
 * Create an action required notification
 */
export async function createActionRequiredAlert(params: {
  userId: string;
  title: string;
  message: string;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, unknown>;
}): Promise<string | null> {
  return createNotification({
    ...params,
    type: 'action_required',
    level: 'warning',
  });
}

/**
 * Create a system notification
 */
export async function createSystemNotification(params: {
  userId: string;
  title: string;
  message: string;
  level?: NotificationLevel;
  actionUrl?: string;
  actionLabel?: string;
}): Promise<string | null> {
  return createNotification({
    ...params,
    type: 'system',
    level: params.level || 'info',
  });
}

/**
 * Batch create notifications for multiple users
 */
export async function createBulkNotifications(
  userIds: string[],
  notificationParams: Omit<CreateNotificationParams, 'userId'>
): Promise<number> {
  let successCount = 0;

  for (const userId of userIds) {
    const result = await createNotification({
      ...notificationParams,
      userId,
    });
    if (result) successCount++;
  }

  return successCount;
}

/**
 * Get user ID by email (helper for notification targeting)
 */
export async function getUserIdByEmail(email: string): Promise<string | null> {
  try {
    const result = await query(`SELECT id FROM users WHERE email = $1`, [email]);
    return result.rows.length > 0 ? result.rows[0].id : null;
  } catch (error) {
    console.error('Error getting user ID by email:', error);
    return null;
  }
}

/**
 * Get user ID by HubSpot owner ID (helper for deal owner notifications)
 */
export async function getUserIdByHubSpotOwner(_ownerId: string): Promise<string | null> {
  try {
    // TODO: Implement mapping between HubSpot owner IDs and user IDs
    // For now, return the most recent user
    const result = await query(`SELECT id FROM users ORDER BY last_login DESC LIMIT 1`);
    return result.rows.length > 0 ? result.rows[0].id : null;
  } catch (error) {
    console.error('Error getting user ID by HubSpot owner:', error);
    return null;
  }
}
