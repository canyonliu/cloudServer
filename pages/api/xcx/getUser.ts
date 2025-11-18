import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

/**
 * API handler for fetching a user by their openid from a query parameter.
 * Handles GET requests to /api/xcx/getUser?openid=...
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { openid } = req.query;

  if (!openid || typeof openid !== 'string') {
    return res.status(400).json({ code: 1, message: 'A valid openid is required as a query parameter' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { openid },
    });

    if (!user) {
      return res.status(404).json({ code: 1, message: 'User not found' });
    }
    return res.status(200).json({ code: 0, message: 'User fetched successfully', data: user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ code: 1, message: 'Internal Server Error' });
  }
}
