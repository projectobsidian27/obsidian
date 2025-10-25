import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      type,
      level,
      title,
      message,
      startDate,
      endDate,
    } = req.body;

    // TODO: Add admin authentication check here
    // Verify that the requesting user has super admin privileges

    if (!type || !level || !title || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await query(
      `INSERT INTO announcements (type, level, title, message, start_date, end_date, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, TRUE)
       RETURNING id`,
      [
        type,
        level,
        title,
        message,
        startDate || new Date().toISOString(),
        endDate || null,
      ]
    );

    return res.status(200).json({
      success: true,
      announcementId: result.rows[0].id,
      message: 'Announcement created successfully',
    });
  } catch (error) {
    console.error('Error creating announcement:', error);
    return res.status(500).json({
      error: 'Failed to create announcement',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
