import type { NextApiRequest, NextApiResponse} from 'next';
import { createNotification, NotificationType, NotificationLevel } from '../../../lib/notifications';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      userId,
      type,
      level,
      title,
      message,
      metadata,
      actionUrl,
      actionLabel,
    } = req.body;

    // TODO: Add admin authentication check here
    // Verify that the requesting user has super admin privileges

    if (!userId || !type || !level || !title || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const notificationId = await createNotification({
      userId,
      type: type as NotificationType,
      level: level as NotificationLevel,
      title,
      message,
      metadata: metadata || {},
      actionUrl: actionUrl || undefined,
      actionLabel: actionLabel || undefined,
    });

    if (!notificationId) {
      return res.status(500).json({ error: 'Failed to create notification' });
    }

    return res.status(200).json({
      success: true,
      notificationId,
      message: 'Notification sent successfully',
    });
  } catch (error) {
    console.error('Error sending admin notification:', error);
    return res.status(500).json({
      error: 'Failed to send notification',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
