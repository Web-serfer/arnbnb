'use client';

import axios from 'axios';
import { useCallback, useMemo, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { SafeUser } from '@/types';
import useLoginModal from './useLoginModal';

interface UseFavoriteProps {
  listingId: string;
  currentUser?: SafeUser | null;
}

const useFavorite = ({ listingId, currentUser }: UseFavoriteProps) => {
  const router = useRouter();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);

  // Проверяем, есть ли listing в избранном
  const actualHasFavorited = useMemo(() => {
    const favorites = currentUser?.favoriteIds || [];
    return favorites.includes(listingId);
  }, [currentUser?.favoriteIds, listingId]);

  // Оптимистичное обновление состояния
  const [optimisticFavorited, setOptimisticFavorited] =
    useState(actualHasFavorited);

  // Синхронизация с актуальным состоянием
  useEffect(() => {
    setOptimisticFavorited(actualHasFavorited);
  }, [actualHasFavorited]);

  // Обработчик добавления/удаления из избранного
  const toggleFavorite = useCallback(
    async (
      e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>
    ) => {
      e.stopPropagation();
      e.preventDefault();

      // Проверка авторизации
      if (!currentUser) {
        loginModal.onOpen();
        return;
      }

      setIsLoading(true);
      const previousState = optimisticFavorited;
      setOptimisticFavorited(!previousState); // Оптимистичное обновление

      try {
        if (previousState) {
          await axios.delete(`/api/favorites/${listingId}`);
          toast.success('Удалено из избранного');
        } else {
          await axios.post(`/api/favorites/${listingId}`);
          toast.success('Добавлено в избранное');
        }
        router.refresh();
      } catch (error) {
        setOptimisticFavorited(previousState); // Откат при ошибке
        toast.error('Ошибка. Попробуйте снова.');
      } finally {
        setIsLoading(false);
      }
    },
    [currentUser, listingId, loginModal, optimisticFavorited, router]
  );

  return {
    hasFavorited: optimisticFavorited,
    toggleFavorite,
    isLoading,
  };
};

export default useFavorite;
