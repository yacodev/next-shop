'use client';

import Link from 'next/link';
import clsx from 'clsx';
import {
  IoCloseOutline,
  IoLogInOutline,
  IoLogOutOutline,
  IoPeopleOutline,
  IoPersonOutline,
  IoSearchOutline,
  IoShirtOutline,
  IoTicketOutline,
} from 'react-icons/io5';

import { useUIStore } from '@/store';
import { logout } from '@/actions';
import { useSession } from 'next-auth/react';

import { useMemo } from 'react';

export const Sidebar = () => {
  const isSideMenuOpen = useUIStore((state) => state.isSideMenuOpen);
  const closeMenu = useUIStore((state) => state.closeSideMenu);

  const { data: session } = useSession();

  const isAuthenticated = useMemo(() => !!session?.user, [session]);

  const isAdmin = session?.user?.role === 'admin';
  console.log('isAuthenticated', isAuthenticated);

  return (
    <div>
      {/* Background black */}
      {isSideMenuOpen && (
        <div className='fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30' />
      )}

      {/* Blur */}
      {isSideMenuOpen && (
        <div
          onClick={closeMenu}
          className='fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm'
        />
      )}

      {/* Sidemenu */}
      <nav
        className={clsx(
          'fixed p-5 right-0 top-0 w-[500px] h-screen bg-white z-20 shadow-2xl transform transition-all duration-300',
          {
            'translate-x-full': !isSideMenuOpen,
          }
        )}
      >
        <IoCloseOutline
          size={50}
          className='absolute top-5 right-5 cursor-pointer'
          onClick={() => closeMenu()}
        />

        {/* Input */}
        <div className='relative mt-14'>
          <IoSearchOutline size={20} className='absolute top-2 left-2' />
          <input
            type='text'
            placeholder='Buscar'
            className='w-full bg-gray-50 rounded pl-10 py-1 pr-10 border-b-2 text-xl border-gray-200 focus:outline-none focus:border-blue-500'
          />
        </div>

        {/* Menú */}

        {isAuthenticated && (
          <>
            <Link
              href='/profile'
              className='flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all'
              onClick={() => closeMenu()}
            >
              <IoPersonOutline size={30} />
              <span className='ml-3 text-xl'>Perfil</span>
            </Link>

            <Link
              href='/orders'
              className='flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all'
              onClick={() => closeMenu()}
            >
              <IoTicketOutline size={30} />
              <span className='ml-3 text-xl'>Ordenes</span>
            </Link>
          </>
        )}

        {!isAuthenticated && (
          <Link
            href='/auth/login'
            className='flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all'
            onClick={() => closeMenu()}
          >
            <IoLogInOutline size={30} />
            <span className='ml-3 text-xl'>Ingresar</span>
          </Link>
        )}

        {isAuthenticated && (
          <button
            className='flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all'
            onClick={async () => {
              await logout();
              closeMenu();
              //router.refresh();
              //console.log('Logout');
            }}
          >
            <IoLogOutOutline size={30} />
            <span className='ml-3 text-xl'>Salir</span>
          </button>
        )}

        {isAdmin && (
          <>
            <div className='w-full h-px bg-gray-200 my-10' />

            <Link
              href='/admin/products'
              onClick={() => closeMenu()}
              className='flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all'
            >
              <IoShirtOutline size={30} />
              <span className='ml-3 text-xl'>Productos</span>
            </Link>

            <Link
              href='/admin/orders'
              className='flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all'
              onClick={() => closeMenu()}
            >
              <IoTicketOutline size={30} />
              <span className='ml-3 text-xl'>Ordenes</span>
            </Link>

            <Link
              href='/admin/users'
              className='flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all'
              onClick={() => closeMenu()}
            >
              <IoPeopleOutline size={30} />
              <span className='ml-3 text-xl'>Usuarios</span>
            </Link>
          </>
        )}
        {/* Line Separator */}
      </nav>
    </div>
  );
};
