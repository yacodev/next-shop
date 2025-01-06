//import { getPaginatedProductsWithImages } from '@/actions';
import { Title } from '@/components';

//const products = initialData.products;

export default async function ProductsPage() {
  //const products2 = await getPaginatedProductsWithImages();

  return (
    <>
      <Title title='Tienda' subtitle='Todos los productos' className='mb-2' />

      {/* <ProductGrid products={products} /> */}
    </>
  );
}
