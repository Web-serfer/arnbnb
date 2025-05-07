'use client';

import React, { useCallback, useState, useMemo } from 'react';
import axios from 'axios';
import useRegisterModalStore from '@/app/hooks/useRegisterModal';
import useLoginModalStore from '@/app/hooks/useLoginModal';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import Modal from './Modal';
import Heading from '../Heading';
import Input from '../inputs/Input';
import Button from '../Button';
import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
import { BsGithub } from 'react-icons/bs';
import { useRouter } from 'next/navigation';

interface InputField {
  id: string;
  label: string;
  type: 'email' | 'text' | 'password';
  validation: { required: string; [key: string]: any };
  pattern?: { value: RegExp; message: string };
  minLength?: { value: number; message: string };
}

const RegisterModal = () => {
  const registerModal = useRegisterModalStore();
  const loginModal = useLoginModalStore();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    mode: 'onBlur',
  });

  const handleAuthError = useCallback((error: unknown, message: string) => {
    console.error(message, error);
    let errorMessage = message;

    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    toast.error(errorMessage);
  }, []);

  const handleSocialSignIn = useCallback(
    async (provider: 'google' | 'github') => {
      setIsLoading(true);
      try {
        const result = await signIn(provider, { callbackUrl: '/' });

        if (!result?.error) {
          toast.success(`Sign-in with ${provider} initiated!`);
          registerModal.onClose();
        } else if (result.error === 'OAuthAccountNotLinked') {
          const { email, name, image } = result.user || {};
          if (!email) {
            toast.error('Could not retrieve email from account.');
            return;
          }
          router.push(
            `/register-${provider}?email=${encodeURIComponent(
              email
            )}&name=${encodeURIComponent(name || '')}&image=${encodeURIComponent(
              image || ''
            )}`
          );
          registerModal.onClose();
        } else {
          toast.error(`Sign-in with ${provider} failed: ${result.error}`);
        }
      } catch (error: unknown) {
        handleAuthError(
          error,
          `Something went wrong during ${provider} sign up`
        );
      } finally {
        setIsLoading(false);
      }
    },
    [registerModal.onClose, handleAuthError, router]
  );

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    try {
      await axios.post('/api/register', data);
      toast.success('Registered via Email!');
      registerModal.onClose();
      loginModal.onOpen();
      reset();
    } catch (error: unknown) {
      handleAuthError(error, 'Something went wrong during email registration');
    } finally {
      setIsLoading(false);
    }
  };

  const inputFields: InputField[] = [
    {
      id: 'email',
      label: 'Email',
      type: 'email',
      validation: {
        required: 'Email is required',
        pattern: {
          value:
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          message: 'Invalid email address',
        },
      },
    },
    {
      id: 'name',
      label: 'Name',
      type: 'text',
      validation: { required: 'Name is required' },
      minLength: { value: 2, message: 'Name must be at least 2 characters' },
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

  const BodyContent = useMemo(
    () => (
      <div className="flex flex-col gap-4">
        <Heading title="Welcome to Airbnb" subtitle="Create an account!" />
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
            pattern={input.pattern}
            minLength={input.minLength}
          />
        ))}
      </div>
    ),
    [errors, isLoading, register]
  );

  const FooterContent = useMemo(
    () => (
      <div className="mt-3 flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <Button
            outline
            label="Sign up with Google"
            onClick={() => handleSocialSignIn('google')}
            disabled={isLoading}
            icon={FcGoogle}
          />
          <Button
            outline
            label="Sign up with Github"
            onClick={() => handleSocialSignIn('github')}
            disabled={isLoading}
            icon={BsGithub}
          />
        </div>
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-500">
            Already have an account?
            <span
              onClick={() => {
                registerModal.onClose();
                loginModal.onOpen();
              }}
              className="ml-1 cursor-pointer text-sm text-black transition-colors hover:text-gray-700 hover:underline"
            >
              Sign in
            </span>
          </span>
        </div>
      </div>
    ),
    [isLoading, handleSocialSignIn, registerModal, loginModal]
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title="Register"
      actionLabel="Continue"
      onClose={registerModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={BodyContent}
      footer={FooterContent}
    />
  );
};

export default RegisterModal;
