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
import { signIn, SignInResponse } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
import { BsGithub } from 'react-icons/bs';
import { useRouter } from 'next/navigation';

// Конфигурация полей формы входа
const LOGIN_FIELDS: Array<{
  id: keyof FieldValues;
  label: string;
  type: 'email' | 'password';
  validation: Record<string, unknown>;
}> = [
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
    validation: {
      required: 'Password is required',
      minLength: {
        value: 6,
        message: 'Password must be at least 6 characters',
      },
    },
  },
];

// Компонент LoginModal отвечает за функциональность входа пользователя.
const LoginModal = () => {
  const router = useRouter();
  const loginModal = useLoginModalStore();
  const registerModal = useRegisterModalStore();
  const [isLoading, setIsLoading] = useState(false);

  // Инициализация react-hook-form для управления формой и валидации, с режимом 'onBlur'.
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<FieldValues>({
    defaultValues: { email: '', password: '' },
    mode: 'onBlur',
  });

  // Обрабатывает отправку формы для входа по email/паролю.
  const onSubmit: SubmitHandler<FieldValues> = useCallback(
    async (credentials) => {
      setIsLoading(true);

      try {
        const response: SignInResponse | undefined = await signIn(
          'credentials',
          {
            ...credentials,
            redirect: false,
          }
        );

        if (response?.error) {
          throw new Error(response.error);
        }

        if (response?.ok) {
          toast.success('Logged in');
          router.refresh();
          loginModal.onClose();
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Authentication failed';
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [loginModal, router]
  );

  // Обрабатывает логику входа через социальные сети для различных провайдеров (Google, GitHub).
  const handleSocialSignIn = useCallback(
    (provider: 'google' | 'github') => async () => {
      setIsLoading(true);
      try {
        await signIn(provider, { callbackUrl: '/' });
        loginModal.onClose();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Social sign-in failed';
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [loginModal]
  );

  // Мемоизированный рендеринг полей ввода формы на основе конфигурации LOGIN_FIELDS.
  const formFields = useMemo(
    () =>
      LOGIN_FIELDS.map((field) => (
        <Input
          key={field.id}
          id={field.id}
          label={field.label}
          type={field.type}
          register={register}
          error={errors[field.id]?.message as string | undefined}
          disabled={isLoading}
          required
          validation={field.validation}
          isError={!!errors[field.id] && !!touchedFields[field.id]}
        />
      )),
    [errors, isLoading, register, touchedFields]
  );

  // Мемоизированный рендеринг футера модального окна, включая кнопки входа через соцсети и ссылку на модальное окно регистрации.
  const modalFooter = useMemo(
    () => (
      <div className="mt-3 flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <Button
            outline
            label="Sign in with Google"
            icon={FcGoogle}
            onClick={handleSocialSignIn('google')}
            disabled={isLoading}
            className="w-full"
          />
          <Button
            outline
            label="Sign in with Github"
            icon={BsGithub}
            onClick={handleSocialSignIn('github')}
            disabled={isLoading}
            className="w-full"
          />
        </div>

        <div className="mt-4 text-center">
          <span className="text-sm text-gray-500">
            Don't have an account?{' '}
            <button
              onClick={() => {
                loginModal.onClose();
                registerModal.onOpen();
              }}
              className="cursor-pointer text-black transition-colors hover:text-gray-700 hover:underline"
            >
              Sign up
            </button>
          </span>
        </div>
      </div>
    ),
    [handleSocialSignIn, isLoading, loginModal, registerModal]
  );

  // Рендерит компонент Modal, передавая необходимые пропсы для отображения и функциональности.
  return (
    <Modal
      disabled={isLoading}
      isOpen={loginModal.isOpen}
      title="Login"
      actionLabel="Continue"
      onClose={loginModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={
        <div className="flex flex-col gap-4">
          <Heading
            title="Welcome back"
            subtitle="Login to your account!"
            center
          />
          {formFields}
        </div>
      }
      footer={modalFooter}
    />
  );
};

export default LoginModal;
