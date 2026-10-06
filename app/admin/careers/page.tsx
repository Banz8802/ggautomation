import { redirect } from 'next/navigation';

export default function AdminCareersRedirectPage() {
  redirect('/admin?tab=careers');
}
