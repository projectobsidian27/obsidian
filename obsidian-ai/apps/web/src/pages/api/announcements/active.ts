import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = await query(
      `SELECT
        id,
        type,
        level,
        title,
        message,
        is_active,
        start_date,
        end_date
      FROM announcements
      WHERE is_active = TRUE
      AND start_date <= NOW()
      AND (end_date IS NULL OR end_date >= NOW())
      ORDER BY created_at DESC`,
      []
    );

    return res.status(200).json({
      success: true,
      announcements: result.rows,
    });
  } catch (error) {
    console.error('Error fetching active announcements:', error);
    return res.status(500).json({ error: 'Failed to fetch announcements' });
  }
}
