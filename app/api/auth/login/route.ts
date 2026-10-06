import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    const validUser = process.env.ADMIN_USERNAME || 'admin';
    const validPass = process.env.ADMIN_PASSWORD || 'Qwe123automation!@#';

    if (username === validUser && password === validPass) {
      const token = Buffer.from(`${username}:${Date.now()}:ggautomation_secret_session`).toString('base64');
      
      const response = NextResponse.json({
        success: true,
        user: {
          username: 'admin',
          name: 'GG Automation Administrator',
          role: 'Super Admin',
        },
      });

      // Set auth cookie
      response.cookies.set({
        name: 'gg_admin_token',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      return response;
    }

    return NextResponse.json(
      { success: false, error: 'Invalid username or password.' },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Server authentication error.' },
      { status: 500 }
    );
  }
}
