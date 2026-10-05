import { redirect } from 'next/navigation';

export default function AdminTrainingsRedirectPage() {
  redirect('/admin?tab=trainings');
}
