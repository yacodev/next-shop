'use server';

import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';

export const getOrderById = async (orderId: string) => {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, error: 'User should be authenticate' };
  }
  try {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        OrderAddress: true,
        OrderItem: {
          select: {
            price: true,
            quantity: true,
            size: true,
            product: {
              select: {
                title: true,
                slug: true,
                ProductImage: {
                  select: {
                    url: true,
                  },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!order) throw 'Order not found';

    if (session.user.role === 'user') {
      if (order.userId !== session.user.id) {
        throw 'User not authorized';
      }
    }

    return { ok: true, order };
  } catch (e) {
    console.log(e);
    return { ok: false, error: 'Order not found' };
  }
};
