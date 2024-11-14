export const revalidate = 60;

import { ProductGrid, Title, Pagination } from '@/components';
import { getPaginatedProductsWithImages } from '@/actions';
import { redirect } from 'next/navigation';

//const products = initialData.products;

interface HomeProps {
  searchParams: {
    page?: string;
  };
}

export default async function Home({ searchParams }: HomeProps) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const { products, totalPages } = await getPaginatedProductsWithImages({
    page,
  });

  if (products.length === 0) {
    redirect('/');
  }

  return (
    <>
      <Title title='Tienda' subtitle='todos los productos' className='mb-2' />
      <ProductGrid products={products} />
      <Pagination totalPages={totalPages} />
    </>
  );
}
