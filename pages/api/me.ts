import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const token = req.cookies.auth_token;

  if (!token) {
    return res.status(200).json({ user: null });
  }

  try {
    // In a real app, you'd verify a JWT here. For this demo, we'll just decode it.
    const userData = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    return res.status(200).json({ user: userData });
  } catch (error) {
    // If the token is malformed
    return res.status(200).json({ user: null });
  }
}
