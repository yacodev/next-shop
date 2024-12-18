'use server';

import prisma from '@/lib/prisma';

export const getCountries = async () => {
  try {
    const countries = await prisma.country.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    return countries;
  } catch (e) {
    console.log(e);
    return [];
  }
};
