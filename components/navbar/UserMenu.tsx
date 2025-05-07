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
  // Хуки для управления состоянием модальных окон
  const { onOpen: registerOpen, onClose: registerClose } = useRegisterModal();
  const { onOpen: loginOpen, onClose: loginClose } = useLoginModal();
  const { onOpen: rentOpen } = useRentModal();

  const [isOpen, setIsOpen] = useState(false); // Состояние открытости выпадающего меню пользователя
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false); // Состояние модального окна выбора языка
  const menuRef = useRef<HTMLDivElement>(null); // Ссылка на DOM-элемент меню для отслеживания кликов вне его
  const router = useRouter();
  const { data: session, status } = useSession(); // Получение данных сессии пользователя

  // Функция для переключения состояния открытости выпадающего меню
  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  // Функция для обработки выхода пользователя из системы
  const handleLogout = async () => {
    setIsOpen(false); // Закрываем меню пользователя
    await signOut({
      callbackUrl: '/', // Перенаправление на главную страницу после выхода
    });
    router.push('/'); // Дополнительное принудительное перенаправление
  };

  // Функция для открытия модального окна выбора языка (пока заглушка)
  const handleLanguageClick = () => {
    setIsOpen(false); // Закрываем меню пользователя
    setIsLanguageModalOpen(true);
  };

  // Функция для закрытия модального окна выбора языка
  const closeLanguageModal = () => {
    setIsLanguageModalOpen(false);
  };

  // Обработчик для открытия модального окна RentModal (аренды жилья)
  const onRent = useCallback(() => {
    setIsOpen(false); // Закрываем меню пользователя
    if (!session) {
      // Если пользователь не авторизован, закрываем модальное окно регистрации (если открыто) и открываем модальное окно входа
      registerClose();
      return loginOpen();
    }
    // Если пользователь авторизован, открываем модальное окно RentModal
    rentOpen();
  }, [session, loginOpen, loginClose, rentOpen, registerClose]);

  // Обработчик для открытия модального окна входа
  const handleLoginClick = useCallback(() => {
    setIsOpen(false); // Закрываем меню пользователя
    registerClose(); // Закрываем модальное окно регистрации, если оно открыто
    loginOpen();
  }, [loginOpen, registerClose]);

  // Обработчик для открытия модального окна регистрации
  const handleRegisterClick = useCallback(() => {
    setIsOpen(false); // Закрываем меню пользователя
    loginClose(); // Закрываем модальное окно входа, если оно открыто
    registerOpen();
  }, [registerOpen, loginClose]);

  // useEffect для закрытия выпадающего меню при клике вне его области
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

  // Отображение спиннера во время загрузки статуса сессии
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
          {/* Кнопка для предложения своего жилья (открывает RentModal) */}
          <div
            onClick={onRent}
            className="cursor-pointer rounded-full px-3 py-3 text-sm font-semibold text-gray-500 transition hover:border hover:text-gray-800 hover:shadow-md active:scale-95 md:px-4 md:py-2"
          >
            SNYStay your home
          </div>
          {/* Кнопка для выбора языка (заглушка) */}
          <div
            className="cursor-pointer rounded-full p-2 transition hover:bg-neutral-100"
            onClick={handleLanguageClick}
          >
            <GiWorld className="h-5 w-5 text-gray-500 hover:text-black" />
          </div>
        </div>

        {/* Кнопка открытия/закрытия выпадающего меню пользователя */}
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

      {/* Выпадающее меню пользователя */}
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 top-12 w-[40vw] overflow-hidden rounded-xl bg-white text-sm shadow-md md:w-3/4"
        >
          <div className="flex cursor-pointer flex-col">
            <>
              {session ? ( // Если пользователь авторизован
                <>
                  <MenuItem
                    label="My Trips"
                    onClick={() => {
                      router.push('/trips');
                      setIsOpen(false);
                    }}
                    icon={<FiCalendar size={16} />}
                  />
                  <MenuItem
                    label="My Favorites"
                    onClick={() => {
                      router.push('/favorites');
                      setIsOpen(false);
                    }}
                    icon={<FiHeart size={16} />}
                  />
                  <MenuItem
                    label="My reservations"
                    onClick={() => {
                      router.push('/reservations');
                      setIsOpen(false);
                    }}
                    icon={<FiBriefcase size={16} />}
                  />
                  <MenuItem
                    label="My properties"
                    onClick={() => {
                      router.push('/properties');
                      setIsOpen(false);
                    }}
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
                // Если пользователь не авторизован
                <>
                  <MenuItem
                    label="Sign In"
                    onClick={handleLoginClick}
                    icon={<FiLogIn size={16} />}
                  />
                  <MenuItem
                    label="Sign Up"
                    onClick={handleRegisterClick}
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-1/2 rounded-lg bg-white p-8 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Choose your language</h2>
              <button
                onClick={closeLanguageModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <AiOutlineClose size={24} />
              </button>
            </div>
            <p className="mt-4">Здесь будут опции выбора языка.</p>
            <button
              className="mt-6 rounded bg-rose-500 px-4 py-2 text-white hover:bg-rose-600"
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
