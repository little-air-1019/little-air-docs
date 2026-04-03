import type { VercelRequest, VercelResponse } from '@vercel/node';

const COOKIE_NAME = 'notes_access';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password, redirect } = req.body as { password: string; redirect?: string };
  const secret = process.env.NOTES_SECRET;

  if (!secret) {
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  if (password !== secret) {
    return res.status(401).json({ error: 'Incorrect password' });
  }

  const redirectTo = redirect && redirect.startsWith('/docs/notes') ? redirect : '/docs/notes';

  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=1; Path=/; Secure; SameSite=Strict; Max-Age=${COOKIE_MAX_AGE}`
  );

  return res.status(200).json({ ok: true, redirect: redirectTo });
}
