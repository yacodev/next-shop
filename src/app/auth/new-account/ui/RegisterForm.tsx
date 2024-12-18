'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { SubmitHandler, useForm } from 'react-hook-form';
import clsx from 'clsx';
import { login, registerUser } from '@/actions';
//import { useRouter } from 'next/navigation';

type FormInputs = {
  name: string;
  email: string;
  password: string;
};

export const RegisterForm = () => {
  const [errorMessage, setErrorMessage] = useState('');
  //const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    const { name, email, password } = data;
    const response = await registerUser(name, email, password);
    if (!response.ok) {
      setErrorMessage(response?.message ?? 'Error al crear usuario');
      return;
    }
    await login(email.toLowerCase(), password);
    //router.replace('/');
    window.location.replace('/');
  };

  return (
    <form className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor='email'>Nombre completo</label>
      <input
        className={clsx('px-5 py-2 border bg-gray-200 rounded mb-5', {
          'border-red-500': errors.name,
        })}
        type='text'
        {...register('name', { required: true })}
      />

      <label htmlFor='email'>Correo electrónico</label>
      <input
        className={clsx('px-5 py-2 border bg-gray-200 rounded mb-5', {
          'border-red-500': errors.email,
        })}
        type='email'
        {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
      />

      <label htmlFor='email'>Contraseña</label>
      <input
        className={clsx('px-5 py-2 border bg-gray-200 rounded mb-5', {
          'border-red-500': errors.password,
        })}
        type='password'
        {...register('password', { required: true })}
      />

      {errorMessage && <p className='text-red-500 mb-5'>{errorMessage}</p>}
      <button className='btn-primary'>Crear cuenta</button>

      {/* divisor l ine */}
      <div className='flex items-center my-5'>
        <div className='flex-1 border-t border-gray-500'></div>
        <div className='px-2 text-gray-800'>O</div>
        <div className='flex-1 border-t border-gray-500'></div>
      </div>

      <Link href='/auth/login' className='btn-secondary text-center'>
        Ingresar
      </Link>
    </form>
  );
};
