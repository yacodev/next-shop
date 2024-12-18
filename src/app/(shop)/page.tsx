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
  const { page } = await searchParams;
  const newPage = page ? parseInt(page) : 1;
  const { products, totalPages } = await getPaginatedProductsWithImages({
    page: newPage,
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
