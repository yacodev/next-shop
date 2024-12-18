import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface State {
  address: {
    firstName: string;
    lastName: string;
    address: string;
    address2: string;
    city: string;
    country: string;
    postalCode: string;
    phone: string;
  };
  setAddress: (address: State['address']) => void;
}

export const useAddressStore = create<State>()(
  persist(
    (set) => ({
      address: {
        firstName: '',
        lastName: '',
        address: '',
        address2: '',
        city: '',
        country: '',
        postalCode: '',
        phone: '',
      },
      setAddress: (address) => set({ address }),
    }),
    {
      name: 'address-storage',
    }
  )
);
