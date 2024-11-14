'use server';
import prisma from '@/lib/prisma';
//import { sleep } from '@/utils';

export const getStockBySlug = async (slug: string): Promise<number> => {
  try {
    //await sleep(3);
    const stock = await prisma.product.findFirst({
      select: {
        inStock: true,
      },
      where: {
        slug: slug,
      },
    });

    return stock?.inStock ?? 0;
  } catch (e) {
    console.error('Error fetching stock', e);
    return 0;
  }
};
