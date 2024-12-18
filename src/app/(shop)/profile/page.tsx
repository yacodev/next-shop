import React from 'react';
import { Title } from '@/components';
import { auth } from '@/auth.config';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    //redirect('aut/login?returnTo=/perfil')
    redirect('/');
  }

  return (
    <>
      <Title title='perfil ' />
      <pre>{JSON.stringify(session.user, null, 2)}</pre>
      <h2> {session.user.role}</h2>
    </>
  );
}
