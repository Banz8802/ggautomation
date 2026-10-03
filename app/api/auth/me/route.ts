import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('gg_admin_token')?.value;

  if (token) {
    try {
      const decoded = Buffer.from(token, 'base64').toString('ascii');
      if (decoded.includes('admin') && decoded.includes('ggautomation_secret_session')) {
        return NextResponse.json({
          authenticated: true,
          user: {
            username: 'admin',
            name: 'GG Automation Administrator',
            role: 'Super Admin',
          },
        });
      }
    } catch {
      // Invalid token
    }
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}
