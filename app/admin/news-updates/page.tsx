import { redirect } from 'next/navigation';

export default function AdminNewsUpdatesRedirectPage() {
  redirect('/admin?tab=news');
}
