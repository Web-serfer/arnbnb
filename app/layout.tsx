import './globals.css';
import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import Navbar from '@/components/navbar/Navbar';
import RegisterModal from '@/components/modals/RegisterModal';
import ToasterProvider from '@/providers/ToasterProvider';
import LoginModal from '@/components/modals/LoginModal';
import Providers from '@/providers/Providers';
import RentModal from '@/components/modals/(rentalModal)/RentModal';

const nunito = Nunito({
  display: 'swap',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SNYStay - Аренда жилья в Абхазии: квартиры, дома, гостиницы',
  description:
    'Снять жилье в Абхазии посуточно и на длительный срок. SNYStay (Апсны) - большой выбор апартаментов, домов, вилл, отелей и гостевых домов по выгодным ценам.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={nunito.className}>
      <body className="antialiased">
        <Providers>
          <ToasterProvider />
          <RegisterModal />
          <RentModal />
          <LoginModal />
          <Navbar />
          <div className="py-6">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
