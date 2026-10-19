import { cookies } from 'next/headers';

/**
 * Server-side helper to verify if the request has a valid admin session cookie.
 * Matches the authentication token format established in /api/auth/login.
 */
export async function verifyAdminSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('gg_admin_token')?.value;

    if (!token) {
      return false;
    }

    const decoded = Buffer.from(token, 'base64').toString('ascii');
    return decoded.includes('admin') && decoded.includes('ggautomation_secret_session');
  } catch {
    return false;
  }
}
