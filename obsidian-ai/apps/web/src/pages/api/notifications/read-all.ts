import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // TODO: Get actual user_id from session/auth
    // For now, get the most recent user
    const userResult = await query(
      `SELECT id FROM users ORDER BY last_login DESC LIMIT 1`
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = userResult.rows[0].id;

    const result = await query(
      `UPDATE notifications
       SET is_read = TRUE, read_at = NOW()
       WHERE user_id = $1
       AND is_read = FALSE
       RETURNING id`,
      [userId]
    );

    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
      count: result.rows.length,
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
}
