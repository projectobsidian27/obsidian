import type { NextApiRequest, NextApiResponse } from 'next';

interface QualificationData {
  email: string;
  companyName: string;
  companySize: string;
  industry: string;
  role: string;
  crm: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const qualificationData: QualificationData = req.body;

    // Validate required fields
    const { email, companyName, companySize, industry, role, crm } = qualificationData;

    if (!email || !companyName || !companySize || !industry || !role || !crm) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // TODO: Connect to PostgreSQL database
    // For now, we'll store in localStorage on client-side
    // But we're setting up the API structure for database integration

    // Database integration will look like:
    // const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    // await pool.query(
    //   `INSERT INTO users (email, metadata)
    //    VALUES ($1, $2::jsonb)
    //    ON CONFLICT (email)
    //    DO UPDATE SET metadata = $2::jsonb, last_login = NOW()`,
    //   [email, JSON.stringify({ qualification: qualificationData })]
    // );

    // For MVP, return success and let frontend handle localStorage
    return res.status(200).json({
      success: true,
      message: 'Qualification data saved successfully',
      data: qualificationData,
    });

  } catch (error) {
    console.error('Error saving qualification data:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
