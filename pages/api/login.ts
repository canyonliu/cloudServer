import { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  // IMPORTANT: In a real application, you would validate the credentials against a database.
  if (email === 'admin@example.com' && password === process.env.MOCK_USER_PASSWORD) {
    // Create a mock session token or user data to store in the cookie
    const user = { email: 'admin@example.com', name: 'Admin User' };
    const token = Buffer.from(JSON.stringify(user)).toString('base64'); // Simple encoding for demo

    const cookie = serialize('auth_token', token, {
      httpOnly: true, // The cookie is not accessible via client-side JavaScript
      secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
      sameSite: 'strict', // Prevent CSRF attacks
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/', // The cookie is available for all pages
    });

    res.setHeader('Set-Cookie', cookie);
    return res.status(200).json({ user });
  }

  return res.status(401).json({ error: 'Invalid credentials' });
}
