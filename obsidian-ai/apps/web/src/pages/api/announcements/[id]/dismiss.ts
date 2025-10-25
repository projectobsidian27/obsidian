import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid announcement ID' });
    }

    // TODO: Get actual user_id from session/auth
    // For now, get the most recent user
    const userResult = await query(
      `SELECT id FROM users ORDER BY last_login DESC LIMIT 1`
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = userResult.rows[0].id;

    // Record dismissal
    await query(
      `INSERT INTO announcement_dismissals (announcement_id, user_id)
       VALUES ($1, $2)
       ON CONFLICT (announcement_id, user_id) DO NOTHING`,
      [id, userId]
    );

    return res.status(200).json({
      success: true,
      message: 'Announcement dismissed',
    });
  } catch (error) {
    console.error('Error dismissing announcement:', error);
    return res.status(500).json({ error: 'Failed to dismiss announcement' });
  }
}
