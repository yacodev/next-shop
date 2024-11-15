'use client';

import { IoAddCircleOutline, IoRemoveCircleOutline } from 'react-icons/io5';
import { useRouter } from 'next/navigation';
interface QuantitySelectorProps {
  quantity: number;
  onQuantityChanged: (quantity: number) => void;
}

export const QuantitySelector = ({
  quantity,
  onQuantityChanged,
}: QuantitySelectorProps) => {
  const router = useRouter();

  const onValueChanged = (value: number) => {
    if (quantity + value < 1) return;

    onQuantityChanged(quantity + value);
    router.refresh();
  };

  return (
    <div className='flex'>
      <button onClick={() => onValueChanged(-1)}>
        <IoRemoveCircleOutline size={30} />
      </button>

      <span className='w-20 mx-3 px-5 bg-gray-100 text-center rounded'>
        {quantity}
      </span>

      <button onClick={() => onValueChanged(+1)}>
        <IoAddCircleOutline size={30} />
      </button>
    </div>
  );
};
