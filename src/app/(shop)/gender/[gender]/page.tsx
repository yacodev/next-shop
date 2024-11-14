export const revalidate = 60;

import { ProductGrid, Title, Pagination } from '@/components';
import { getPaginatedProductsWithImages } from '@/actions';
import { redirect } from 'next/navigation';
import { Gender } from '@prisma/client';

interface GenderPageProps {
  params: {
    gender: string;
  };
  searchParams: {
    page?: string;
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: GenderPageProps) {
  const { gender } = params;

  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  const { products, totalPages } = await getPaginatedProductsWithImages({
    page,
    gender: gender as Gender,
  });

  if (products.length === 0) {
    redirect(`/gender/${gender}`);
  }

  //const products = seedProducts.filter((product) => product.gender === id);
  const labels: Record<string, string> = {
    men: 'para Hombres',
    women: 'para Mujeres',
    kid: 'para Niños',
    unisex: 'Unisex',
  };

  /* if (id === 'kids') {
    notFound();
  } */

  return (
    <div>
      <h1>Category Page {gender}</h1>
      <Title
        title={`Articulos de ${labels[gender]}`}
        subtitle='Todos los productos'
        className='mb-2'
      />

      <ProductGrid products={products} />
      <Pagination totalPages={totalPages} />
    </div>
  );
}
