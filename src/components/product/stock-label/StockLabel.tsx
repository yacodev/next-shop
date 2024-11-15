'use client';
import React, { useEffect, useState } from 'react';
import { getStockBySlug } from '@/actions/';

interface StockLabelProps {
  slug: string;
}

export const StockLabel = ({ slug }: StockLabelProps) => {
  const [stock, setStock] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    getStock();
  }, []);

  const getStock = async () => {
    const stock = await getStockBySlug(slug);
    console.log(stock);
    setStock(stock);
    setIsLoading(false);
  };

  return (
    <>
      {isLoading ? (
        <h1
          className={'antialiased font-bold text-lg bg-gray-200 animate-pulse'}
        >
          {' '}
          &nbsp;
        </h1>
      ) : (
        <h1 className={'antialiased font-bold text-lg'}>stock: {stock}</h1>
      )}
    </>
  );
};
