'use client';
import { useCartStore, useAddressStore } from '@/store';
import { useEffect, useState } from 'react';
import { currencyFormat } from '@/utils';
import clsx from 'clsx';
import { placeOrder } from '@/actions';
import { useRouter } from 'next/navigation';

export const PlaceOrder = () => {
  const [loaded, setLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const address = useAddressStore((state) => state.address);
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);
  const router = useRouter();

  const getSummaryInformation = useCartStore(
    (state) => state.getSummaryInformation
  );

  const { itemsInCart, subTotal, tax, total } = getSummaryInformation();

  useEffect(() => {
    setLoaded(true);
  }, []);

  const onPlaceOrder = async () => {
    setIsPlacingOrder(true);

    const productsToOrder = cart.map((product) => ({
      productId: product.id,
      quantity: product.quantity,
      size: product.size,
    }));
    //server action
    const response = await placeOrder(productsToOrder, address);
    if (!response.ok) {
      setIsPlacingOrder(false);
      setErrorMessage(response.message);
      return;
    }
    clearCart();
    router.replace('/orders/' + response.order?.id);
  };

  if (!loaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className='bg-white rounded-xl shadow-xl p-7'>
      <h2 className='text-2xl mb-2'>Dirección de entrega</h2>
      <div className='mb-10'>
        <p className='text-xl'>
          {address.firstName} {address.lastName}
        </p>
        <p>{address.address}</p>
        <p>{address.address2}</p>
        <p>{address.postalCode}</p>
        <p>
          {address.city} {address.country}
        </p>
        <p>{address.phone}</p>
      </div>

      {/* Divider */}
      <div className='w-full h-0.5 rounded bg-gray-200 mb-10' />

      <h2 className='text-2xl mb-2'>Resumen de orden</h2>

      <div className='grid grid-cols-2'>
        <span>No. Productos</span>
        <span className='text-right'>
          {itemsInCart === 1 ? '1 artículo' : `${itemsInCart} artículos`}
        </span>

        <span>Subtotal</span>
        <span className='text-right'>{currencyFormat(subTotal)}</span>

        <span>Impuestos (15%)</span>
        <span className='text-right'>{currencyFormat(tax)}</span>

        <span className='mt-5 text-2xl'>Total:</span>
        <span className='mt-5 text-2xl text-right'>
          {currencyFormat(total)}
        </span>
      </div>

      <div className='mt-5 mb-2 w-full'>
        <p className='mb-5'>
          {/* Disclaimer */}
          <span className='text-xs'>
            Al hacer clic en Colocar orden, aceptas nuestros{' '}
            <a href='#' className='underline'>
              términos y condiciones
            </a>{' '}
            y{' '}
            <a href='#' className='underline'>
              política de privacidad
            </a>
          </span>
        </p>

        <p className='text-red-500'> {errorMessage} </p>
        <button
          className={clsx({
            'btn-primary': !isPlacingOrder,
            'btn-disabled': isPlacingOrder,
          })}
          onClick={onPlaceOrder}
        >
          Colocar orden
        </button>
      </div>
    </div>
  );
};
