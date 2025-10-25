import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { filter = 'unread', limit = 50 } = req.query;

    // TODO: Get actual user_id from session/auth
    // For now, get the most recent user
    const userResult = await query(
      `SELECT id FROM users ORDER BY last_login DESC LIMIT 1`
    );

    if (userResult.rows.length === 0) {
      return res.status(200).json({ notifications: [] });
    }

    const userId = userResult.rows[0].id;

    // Build query based on filter
    let whereClause = 'WHERE user_id = $1 AND is_dismissed = FALSE';
    if (filter === 'unread') {
      whereClause += ' AND is_read = FALSE';
    }

    const result = await query(
      `SELECT
        id,
        type,
        level,
        title,
        message,
        metadata,
        is_read,
        is_dismissed,
        action_url,
        action_label,
        created_at,
        read_at,
        dismissed_at
      FROM notifications
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $2`,
      [userId, limit]
    );

    return res.status(200).json({
      success: true,
      notifications: result.rows,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return res.status(500).json({ error: 'Failed to fetch notifications' });
  }
}
