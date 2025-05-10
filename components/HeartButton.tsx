'use client';

import { SafeUser } from '@/types';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import useFavorite from '@/app/hooks/useFavorite';

interface HeartButtonProps {
  listingId: string;
  currentUser?: SafeUser | null;
}

const HeartButton: React.FC<HeartButtonProps> = ({
  listingId,
  currentUser,
}) => {
  // Получаем состояние и методы из хука избранного
  const { hasFavorited, toggleFavorite, isLoading } = useFavorite({
    listingId,
    currentUser,
  });

  // Обработчик клика
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isLoading) toggleFavorite(e);
  };

  // Обработчик клавиатуры (для доступности)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isLoading && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      toggleFavorite(e);
    }
  };

  return (
    <div
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-pressed={hasFavorited}
      aria-label={hasFavorited ? 'Remove from favorites' : 'Add to favorites'}
      className={`
        relative
        hover:opacity-80
        transition
        cursor-pointer
        ${isLoading ? 'cursor-not-allowed opacity-50' : ''}
      `}
    >
      {/* Белый контур сердца */}
      <AiOutlineHeart
        size={28}
        className="
          fill-white
          absolute
          -top-[2px]
          -right-[2px]
        "
      />

      {/* Основное сердце */}
      <AiFillHeart
        size={24}
        className={hasFavorited ? 'fill-rose-500' : 'fill-neutral-500/70'}
      />
    </div>
  );
};

export default HeartButton;
