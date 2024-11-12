import { initialData } from '@/seed/seed';
//import { notFound } from 'next/navigation';
import { ProductGrid, Title } from '@/components';
import { Category } from '@/interfaces';

const seedProducts = initialData.products;
interface CategoryPageProps {
  params: {
    id: Category;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { id } = params;

  const products = seedProducts.filter((product) => product.gender === id);
  const labels: Record<Category, string> = {
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
      <h1>Category Page {id}</h1>
      <Title
        title={`Articulos de ${labels[id]}`}
        subtitle='Todos los productos'
        className='mb-2'
      />

      <ProductGrid products={products} />
    </div>
  );
}
