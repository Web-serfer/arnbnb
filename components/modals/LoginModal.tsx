'use client';

import React from 'react';
import { useState, useMemo, useCallback } from 'react';
import useLoginModalStore from '@/app/hooks/useLoginModal';
import useRegisterModalStore from '@/app/hooks/useRegisterModal';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import Modal from './Modal';
import Heading from '../Heading';
import Input from '../inputs/Input';
import Button from '../Button';
import { CredentialsSignInCallback, signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
import { BsGithub } from 'react-icons/bs';
import { useRouter } from 'next/navigation';

interface InputField {
  id: string;
  label: string;
  type: 'email' | 'password';
  validation: { required: string; [key: string]: any };
  pattern?: { value: RegExp; message: string };
  minLength?: { value: number; message: string };
}

const LoginModal = () => {
  const router = useRouter();
  const loginModal = useLoginModalStore();
  const registerModal = useRegisterModalStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  });

  // Обработчик входа
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    try {
      const callback = (await signIn('credentials', {
        ...data,
        redirect: false,
      })) as CredentialsSignInCallback;

      if (callback?.error) {
        console.error('Authentication error:', callback.error);
        toast.error(
          typeof callback.error === 'string'
            ? callback.error
            : callback.error.message || 'Authentication failed'
        );
      }

      if (callback?.ok) {
        toast.success('Logged in');
        router.refresh();
        loginModal.onClose();
      }
    } catch (error: any) {
      console.error('Unexpected error during sign in:', error);
      toast.error(error?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  // Общий обработчик входа через социальные сети
  const handleSocialSignIn = useCallback(
    async (provider: 'google' | 'github') => {
      setIsLoading(true);

      try {
        await signIn(provider, { callbackUrl: '/' });
        loginModal.onClose();
      } catch (error: any) {
        console.error(`Error during ${provider} sign in:`, error);
        toast.error(error?.message || 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    },
    [loginModal.onClose, setIsLoading]
  );

  // Обработчик входа через Google
  const onGoogleClick = () => {
    handleSocialSignIn('google');
  };
  // Обработчик входа через Github
  const onGithubClick = () => {
    handleSocialSignIn('github');
  };

  // Поля ввода только для логина
  const inputFields: InputField[] = [
    {
      id: 'email',
      label: 'Email',
      type: 'email',
      validation: {
        required: 'Email is required',
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: 'Invalid email address',
        },
      },
    },
    {
      id: 'password',
      label: 'Password',
      type: 'password',
      validation: { required: 'Password is required' },
      minLength: {
        value: 6,
        message: 'Password must be at least 6 characters',
      },
    },
  ];

  // Контент тела модального окна
  const BodyContent = useMemo(
    () => (
      <div className="flex flex-col gap-4">
        <Heading title="Welcome back" subtitle="Login to your account!" />
        {inputFields.map((input) => (
          <Input
            key={input.id}
            id={input.id}
            label={input.label}
            type={input.type}
            register={register}
            error={errors[input.id]?.message}
            disabled={isLoading}
            required
            validation={input.validation}
            isError={!!errors[input.id] && !!touchedFields[input.id]}
            pattern={input.pattern}
            minLength={input.minLength}
          />
        ))}
      </div>
    ),
    [errors, inputFields, isLoading, register, touchedFields]
  );

  // Контент футера модального окна
  const FooterContent = useMemo(
    () => (
      <div className="mt-3 flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <Button
            outline
            label="Sign in with Google"
            icon={FcGoogle}
            onClick={onGoogleClick}
            disabled={isLoading}
          />
          <Button
            outline
            label="Sign in with Github"
            icon={BsGithub}
            onClick={onGithubClick}
            disabled={isLoading}
          />
        </div>
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-500">
            Don't have an account?
            <span
              onClick={() => {
                loginModal.onClose();
                registerModal.onOpen();
              }}
              className="ml-1 cursor-pointer text-sm text-black transition-colors hover:text-gray-700 hover:underline"
            >
              Sign up
            </span>
          </span>
        </div>
      </div>
    ),
    [
      isLoading,
      onGoogleClick,
      onGithubClick,
      loginModal.onClose,
      registerModal.onOpen,
    ]
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={loginModal.isOpen}
      title="Login"
      actionLabel="Continue"
      onClose={loginModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={BodyContent}
      footer={FooterContent}
    />
  );
};

export default LoginModal;
