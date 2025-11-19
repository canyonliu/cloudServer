import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

/**
 * API handler for creating or updating a user.
 * Handles POST requests to /api/xcx/createUser
 * TEMPORARILY handles GET requests for diagnostics.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Diagnostic GET handler
  if (req.method === 'GET') {
    try {
      const user = await prisma.user.upsert({
        where: { openid: 'get_test_user_001' },
        update: { nickname: 'GET Test' },
        create: { openid: 'get_test_user_001', nickname: 'GET Test' },
      });
      return res.status(200).json({ code: 0, message: 'DIAGNOSTIC GET: User created or updated successfully', data: user });
    } catch (error) {
      console.error('DIAGNOSTIC GET: Error creating or updating user:', error);
      return res.status(500).json({ code: 1, message: 'DIAGNOSTIC GET: Internal Server Error', error: (error as Error).message });
    }
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST', 'GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { openid, nickname, avatarUrl } = req.body;

  if (!openid) {
    return res.status(400).json({ code: 1, message: 'openid is required' });
  }

  try {
    const user = await prisma.user.upsert({
      where: { openid },
      update: { nickname, avatarUrl },
      create: { openid, nickname, avatarUrl },
    });
    return res.status(200).json({ code: 0, message: 'User created or updated successfully', data: user });
  } catch (error) {
    console.error('Error creating or updating user:', error);
    return res.status(500).json({ code: 1, message: 'Internal Server Error' });
  }
}
