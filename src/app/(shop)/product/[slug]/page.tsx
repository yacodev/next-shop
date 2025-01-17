export const revalidate = 604800; // 7 days

import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/actions';
//import { Metadata, ResolvingMetadata } from 'next';
import { Metadata } from 'next';
import { AddToCart } from './ui/AddToCart';
import {
  ProductSlideshow,
  ProductMobileSlideshow,
  StockLabel,
} from '@/components';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: ProductPageProps): //parent: ResolvingMetadata
Promise<Metadata> {
  // read route params
  const slug = (await params).slug;

  // fetch data
  const product = await getProductBySlug(slug);

  // optionally access and extend (rather than replace) parent metadata
  // const previousImages = (await parent).openGraph?.images || []

  return {
    title: product?.title ?? 'Product not found',
    description: product?.description ?? 'Product not found',
    openGraph: {
      title: product?.title ?? 'Product not found',
      description: product?.description ?? 'Product not found',
      images: [`/products/${product?.images[1]}`],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = params;

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className='mt-5 mb-20 grid grid-cols-1 md:grid-cols-3 gap-3'>
      {/* Slideshow */}
      <div className='col-span-1 md:col-span-2 '>
        {/* Mobile Slideshow */}
        <ProductMobileSlideshow
          title={product.title}
          images={product.images}
          className='block md:hidden'
        />

        {/* Desktop Slideshow */}
        <ProductSlideshow
          title={product.title}
          images={product.images}
          className='hidden md:block'
        />
      </div>

      {/* Detalles */}
      <div className='col-span-1 px-5'>
        <StockLabel slug={product.slug} />
        <h1 className={'antialiased font-bold text-xl'}>{product.title}</h1>
        <p className='text-lg mb-5'>${product.price}</p>

        <AddToCart product={product} />

        {/* Descripción */}
        <h3 className='font-bold text-sm'>Descripción</h3>
        <p className='font-light'>{product.description}</p>
      </div>
    </div>
  );
}
