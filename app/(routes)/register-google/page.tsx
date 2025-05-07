'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

export default function RegisterGooglePage() {
  debugger;
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const name = searchParams.get('name');
  const image = searchParams.get('image');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      router.push('/');
      toast.error('Missing email. Please try again.');
    }
  }, [email, router, toast]);

  const handleRegisterAndLink = async () => {
    setIsLoading(true);
    try {
      console.log('Calling /api/register from /register-google with:', {
        name,
        email,
        image,
      });
      await axios.post('/api/register', {
        name: name || 'New User',
        email: email,
        image: image || null,
      });
      toast.success('Account created successfully!');

      console.log("Calling signIn('google') from /register-google");
      const result = await signIn('google', {
        callbackUrl: '/',
      });

      if (result?.error) {
        console.error('Error linking account:', result.error);
        toast.error(`Failed to link Google account: ${result.error}`);
      } else {
        toast.success('Google account linked!');
        router.push('/');
      }
    } catch (error: any) {
      console.error('Error during registration:', error);
      toast.error(`Failed to register: ${error.message || error}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-2xl font-bold">Register with Google</h1>
      <p className="mb-2">Email: {email}</p>
      <p className="mb-2">Name: {name}</p>
      {image && (
        <Image src={image} alt="Google Profile" className="mb-4 rounded-full" />
      )}
      <button
        onClick={handleRegisterAndLink}
        disabled={isLoading}
        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
      >
        {isLoading ? 'Loading...' : 'Register and Link Google Account'}
      </button>
    </div>
  );
}
