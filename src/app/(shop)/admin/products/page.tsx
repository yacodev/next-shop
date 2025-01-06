export const revalidate = 0;
import { Title, Pagination, ProductImage } from '@/components';

import Link from 'next/link';
import { getPaginatedProductsWithImages } from '@/actions';
import { currencyFormat } from '@/utils';

interface ProductsProps {
  searchParams: {
    page?: string;
  };
}

export default async function ProductsPage({ searchParams }: ProductsProps) {
  const { page } = await searchParams;
  const newPage = page ? parseInt(page) : 1;
  const { products, totalPages } = await getPaginatedProductsWithImages({
    page: newPage,
  });

  return (
    <>
      <Title title='Mantenimiento de Productos' />
      <div className='flex justify-end mb-5'>
        <Link href='/admin/product/new' className='btn btn-primary'>
          Nuevo producto
        </Link>
      </div>
      <div className='mb-10'>
        <table className='min-w-full'>
          <thead className='bg-gray-200 border-b'>
            <tr>
              <th
                scope='col'
                className='text-sm font-medium text-gray-900 px-6 py-4 text-left'
              >
                Imagen
              </th>
              <th
                scope='col'
                className='text-sm font-medium text-gray-900 px-6 py-4 text-left'
              >
                Titulo
              </th>
              <th
                scope='col'
                className='text-sm font-medium text-gray-900 px-6 py-4 text-left'
              >
                Precio
              </th>
              <th
                scope='col'
                className='text-sm font-medium text-gray-900 px-6 py-4 text-left'
              >
                Genero
              </th>
              <th
                scope='col'
                className='text-sm font-medium text-gray-900 px-6 py-4 text-left'
              >
                Inventario
              </th>
              <th
                scope='col'
                className='text-sm font-medium text-gray-900 px-6 py-4 text-left'
              >
                Tallas
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className='bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100'
              >
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                  <Link href={`/product/${product.slug}`}>
                    <ProductImage
                      src={product.ProductImage[0]?.url}
                      width={80}
                      height={80}
                      alt={product.title}
                      className='w-20 h-20 object-cover rounded'
                    />
                  </Link>
                </td>
                <td className='text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap'>
                  <Link
                    href={`/admin/product/${product.slug}`}
                    className='hover:underline'
                  >
                    {product.title}
                  </Link>
                </td>
                <td className=' text-sm font-bold  text-gray-900 font-light px-6 py-4 whitespace-nowrap'>
                  {currencyFormat(product.price)}
                </td>
                <td className=' text-sm  text-gray-900 font-light px-6 py-4 whitespace-nowrap'>
                  {product.gender}
                </td>
                <td className=' text-sm  text-gray-900 font-light px-6 py-4 whitespace-nowrap'>
                  {product.inStock}
                </td>
                <td className=' text-sm  text-gray-900 font-light px-6 py-4 whitespace-nowrap'>
                  {product.sizes.join(', ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination totalPages={totalPages} />
      </div>
    </>
  );
}
