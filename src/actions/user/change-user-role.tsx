'use server';

import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const changeUserRole = async (
  userId: string,
  role: 'admin' | 'user'
) => {
  const session = await auth();
  if (session?.user.role !== 'admin') {
    return { ok: false, message: 'unauthorized' };
  }

  try {
    const newRole = role === 'admin' ? 'admin' : 'user';
    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    revalidatePath('/admin/users');
    return { ok: true };
  } catch (e) {
    console.error(e);
    return { ok: false, message: 'cant update role' };
  }
};
