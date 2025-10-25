import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // TODO: Get actual user_id from session/auth
    // For now, get the most recent user
    const userResult = await query(
      `SELECT id FROM users ORDER BY last_login DESC LIMIT 1`
    );

    if (userResult.rows.length === 0) {
      return res.status(200).json({ count: 0 });
    }

    const userId = userResult.rows[0].id;

    const result = await query(
      `SELECT COUNT(*) as count
       FROM notifications
       WHERE user_id = $1
       AND is_read = FALSE
       AND is_dismissed = FALSE`,
      [userId]
    );

    return res.status(200).json({
      success: true,
      count: parseInt(result.rows[0].count, 10),
    });
  } catch (error) {
    console.error('Error fetching notification count:', error);
    return res.status(500).json({ error: 'Failed to fetch notification count' });
  }
}
