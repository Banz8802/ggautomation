import { redirect } from 'next/navigation';

export default function AdminNewsRedirectPage() {
  redirect('/admin?tab=news');
}
