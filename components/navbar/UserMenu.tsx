'use client';

import { useCallback, useState, useRef, useEffect } from 'react';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import {
  FiLogIn,
  FiUserPlus,
  FiLogOut,
  FiHeart,
  FiBriefcase,
  FiHome,
  FiCalendar,
} from 'react-icons/fi';
import { GiWorld } from 'react-icons/gi';
import Avatar from '../Avatar';
import MenuItem from './MenuItem';
import useRegisterModal from '@/app/hooks/useRegisterModal';
import useLoginModal from '@/app/hooks/useLoginModal';
import useRentModal from '@/app/hooks/useRentModal';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaSpinner } from 'react-icons/fa';

const UserMenu: React.FC = () => {
  const { onOpen: registerOpen } = useRegisterModal();
  const { onOpen: loginOpen } = useLoginModal();
  const { onOpen: rentOpen } = useRentModal();
  const [isOpen, setIsOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { data: session, status } = useSession();

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  const handleLogout = async () => {
    await signOut({
      callbackUrl: '/',
    });
    router.push('/');
  };

  const handleLanguageClick = () => {
    setIsLanguageModalOpen(true);
  };

  const closeLanguageModal = () => {
    setIsLanguageModalOpen(false);
  };

  // Обработчик для открытия модального окна RentModal
  const onRent = useCallback(() => {
    if (!session) {
      return loginOpen(); // Если пользователь не авторизован, открываем модальное окно входа
    }
    rentOpen(); // Если пользователь авторизован, открываем модальное окно RentModal
  }, [session, loginOpen, rentOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center p-4">
        <FaSpinner className="h-6 w-6 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="relative z-50">
      <div className="flex flex-row items-center gap-3">
        <div className="hidden items-center gap-2 md:flex">
          {/* Кнопка для открытия RentModal */}
          <div
            onClick={onRent}
            className="cursor-pointer rounded-full py-3 text-sm font-semibold text-gray-500 transition hover:border hover:text-gray-800 hover:shadow-md active:scale-95 md:px-2 md:py-2"
          >
            Add your home
          </div>
          <div
            className="cursor-pointer rounded-full p-2 transition hover:bg-neutral-100"
            onClick={handleLanguageClick}
          >
            <GiWorld className="h-5 w-5 text-gray-500 hover:text-black" />
          </div>
        </div>

        <div
          onClick={toggleOpen}
          className="flex cursor-pointer flex-row items-center gap-3 rounded-full border-[1px] border-neutral-200 p-2 transition hover:shadow-md active:scale-95 md:px-2 md:py-1"
        >
          <div className="rounded-full p-1 transition hover:bg-neutral-100 focus:outline-none">
            {isOpen ? (
              <AiOutlineClose size={18} />
            ) : (
              <AiOutlineMenu size={18} />
            )}
          </div>
          <div className="hidden md:block">
            <Avatar src={session?.user?.image || undefined} />
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 top-12 w-[40vw] overflow-hidden rounded-xl bg-white text-sm shadow-md md:w-3/4"
        >
          <div className="flex cursor-pointer flex-col">
            <>
              {session ? (
                <>
                  <MenuItem
                    label="My Trips"
                    onClick={() => {}}
                    icon={<FiCalendar size={16} />}
                  />
                  <MenuItem
                    label="My Favorites"
                    onClick={() => {}}
                    icon={<FiHeart size={16} />}
                  />
                  <MenuItem
                    label="My reservations"
                    onClick={() => {}}
                    icon={<FiBriefcase size={16} />}
                  />
                  <MenuItem
                    label="My properties"
                    onClick={() => {}}
                    icon={<FiHome size={16} />}
                  />
                  <MenuItem label="SNYStay your home" onClick={onRent} />
                  <hr />
                  <MenuItem
                    label="Logout"
                    onClick={handleLogout}
                    icon={<FiLogOut size={16} />}
                  />
                </>
              ) : (
                <>
                  <MenuItem
                    label="Sign In"
                    onClick={loginOpen}
                    icon={<FiLogIn size={16} />}
                  />
                  <MenuItem
                    label="Sign Up"
                    onClick={registerOpen}
                    icon={<FiUserPlus size={16} />}
                  />
                </>
              )}
            </>
          </div>
        </div>
      )}

      {/* Модальное окно выбора языка (заглушка) */}
      {isLanguageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-1/2 rounded-lg bg-white p-8 shadow-lg">
            <h2 className="text-2xl font-bold">Choose your language</h2>
            <p>Здесь будут опции выбора языка.</p>
            <button
              className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              onClick={closeLanguageModal}
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
