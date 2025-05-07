'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import logo from '../../public/images/logo.png';

const Logo = () => {
  const router = useRouter();

  return (
    <Link href="/">
      <Image
        src={logo}
        alt="logo"
        width={100}
        height={50}
        onClick={() => router.push('/')}
        className="hidden cursor-pointer md:block"
      />
    </Link>
  );
};

export default Logo;
