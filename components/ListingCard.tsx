'use client';

import Image from 'next/image';
import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { AiFillStar, AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import HeartButton from './HeartButton';
import { SafeUser } from '@/types';

interface LocationValue {
  value: string;
  label: string;
  latlng: [number, number];
  region: string;
  flag: string;
}

interface ListingData {
  _id: string;
  userId: string;
  title: string;
  description: string;
  imageSrc: string[];
  category: string;
  roomCount: number;
  bathroomCount: number;
  guestCount: number;
  locationValue: LocationValue;
  price: number;
  hasPool: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Reservation {
  startDate: Date;
  endDate: Date;
  totalPrice: number;
}

interface ListingCardProps {
  data: ListingData;
  reservation?: Reservation;
  currentUser?: SafeUser | null;
  onAction?: (id: string) => void;
  actionLabel?: string;
  actionId?: string;
  disabled?: boolean;
}

const ListingCard = ({
  data,
  reservation,
  currentUser,
  onAction,
  actionLabel,
  actionId = '',
  disabled,
}: ListingCardProps) => {
  console.log(
    `[ListingCard] ID: ${data?._id || 'НЕТ ID'}, Рендер/Перерендер. Получены data:`,
    JSON.parse(
      JSON.stringify(
        data || { ошибка: 'ПРОП DATA ОТСУТСТВУЕТ (null или undefined)' }
      )
    )
  );

  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // --- Начальная проверка на существование data ---
  if (!data) {
    console.error(
      '[ListingCard] КРИТИЧЕСКАЯ ОШИБКА: Проп "data" отсутствует (undefined или null). Рендеринг прерван.'
    );
    // Возвращаем заглушку, чтобы избежать падения всего приложения
    return (
      <div className="col-span-1 p-4 border border-red-500 rounded-xl bg-red-50">
        <p className="text-red-600 font-semibold">
          Ошибка отображения карточки
        </p>
        <p className="text-xs text-neutral-600">
          Данные для этого объявления не были получены. Проверьте консоль
          разработчика (ListingCard).
        </p>
      </div>
    );
  }

  // --- Проверка ключевых полей в data, если data существует ---
  if (!data._id) {
    console.warn(
      `[ListingCard] ВНИМАНИЕ: У объекта "data" отсутствует свойство "_id". Это может вызвать проблемы с навигацией или кнопкой "HeartButton". Текущие data:`,
      JSON.parse(JSON.stringify(data))
    );
    // Если _id критичен, можно здесь тоже вернуть заглушку или специальное состояние.
  }

  const handleCardClick = useCallback(() => {
    if (!data._id) {
      console.error(
        '[ListingCard] Ошибка навигации: data._id отсутствует. Навигация невозможна.'
      );
      return;
    }
    router.push(`/listings/${data._id}`);
  }, [router, data._id]); // Зависимость от data._id важна

  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (disabled) return;
      onAction?.(actionId);
    },
    [disabled, onAction, actionId]
  );

  // Безопасное получение imageSrc
  const safeImageSrc = useMemo(() => {
    if (!data.imageSrc || !Array.isArray(data.imageSrc)) {
      console.warn(
        `[ListingCard] ID: ${data._id || 'НЕТ ID'}, data.imageSrc отсутствует или не является массивом. Используется placeholder. data.imageSrc:`,
        data.imageSrc
      );
      return [];
    }
    return data.imageSrc;
  }, [data._id, data.imageSrc]);

  const handleImageNavigation = useCallback(
    (direction: 'prev' | 'next') => (e: React.MouseEvent) => {
      e.stopPropagation();
      if (safeImageSrc.length === 0) {
        console.warn(
          `[ListingCard] ID: ${data._id || 'НЕТ ID'}, Попытка навигации по изображениям, но safeImageSrc пуст.`
        );
        return;
      }
      setCurrentImageIndex((prev) => {
        if (direction === 'next') {
          return prev === safeImageSrc.length - 1 ? 0 : prev + 1;
        } else {
          return prev === 0 ? safeImageSrc.length - 1 : prev - 1;
        }
      });
    },
    [safeImageSrc.length, data._id]
  );

  // --- Вычисление цены с логгированием и защитой ---
  const displayPrice = useMemo(() => {
    if (data.price === undefined) {
      // СТРОГАЯ ПРОВЕРКА НА UNDEFINED
      console.warn(
        `[ListingCard] ID: ${data._id || 'НЕТ ID'}, ВНИМАНИЕ: data.price === undefined. Будет использовано значение 0 или totalPrice из reservation. Текущие data:`,
        JSON.parse(JSON.stringify(data)),
        `Reservation:`,
        reservation
      );
    }
    return reservation ? reservation.totalPrice : (data.price ?? 0); // Используем ?? для обработки null и undefined
  }, [reservation, data.price, data._id]);

  const priceLabel = useMemo(
    () => (reservation ? '' : 'за ночь'),
    [reservation]
  );

  // --- Даты резервации ---
  const reservationDateRange = useMemo(() => {
    if (!reservation) return null;
    try {
      const start = new Date(reservation.startDate);
      const end = new Date(reservation.endDate);
      // Проверка на валидность дат перед форматированием
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        console.error(
          `[ListingCard] ID: ${data._id || 'НЕТ ID'}, Невалидные даты в reservation:`,
          reservation
        );
        return 'Некорректные даты';
      }
      return `${format(start, 'PP')} - ${format(end, 'PP')}`; // Убедитесь, что локаль для format настроена
    } catch (error) {
      console.error(
        `[ListingCard] ID: ${data._id || 'НЕТ ID'}, Ошибка форматирования дат резервации:`,
        error,
        reservation
      );
      return 'Ошибка дат';
    }
  }, [reservation, data._id]);

  // --- Текст местоположения с защитой ---
  const locationText = useMemo(() => {
    if (!data.locationValue) {
      console.warn(
        `[ListingCard] ID: ${data._id || 'НЕТ ID'}, ВНИМАНИЕ: data.locationValue отсутствует. Будет использован текст по умолчанию. Текущие data:`,
        JSON.parse(JSON.stringify(data))
      );
      return 'Местоположение не указано';
    }
    return `${data.locationValue.region ? `${data.locationValue.region}, ` : ''}${data.locationValue.label || 'Название места отсутствует'}`;
  }, [data.locationValue, data._id]);

  // --- Текст удобств с защитой ---
  const amenitiesText = useMemo(() => {
    if (data.roomCount === undefined || data.bathroomCount === undefined) {
      console.warn(
        `[ListingCard] ID: ${data._id || 'НЕТ ID'}, ВНИМАНИЕ: data.roomCount (${data.roomCount}) или data.bathroomCount (${data.bathroomCount}) отсутствуют. Будут использованы значения по умолчанию (0). Текущие data:`,
        JSON.parse(JSON.stringify(data))
      );
    }
    return `${data.roomCount ?? 0} комнат · ${data.bathroomCount ?? 0} ванных`;
  }, [data.roomCount, data.bathroomCount, data._id]);

  const currentImageUrl = useMemo(() => {
    const url = safeImageSrc[currentImageIndex] || '/images/placeholder.jpg';
    return url;
  }, [safeImageSrc, currentImageIndex]);

  const hasMultipleImages = safeImageSrc.length > 1;
  const imageCounterText = hasMultipleImages
    ? `${currentImageIndex + 1}/${safeImageSrc.length}`
    : '';

  return (
    <div
      onClick={handleCardClick}
      className="col-span-1 cursor-pointer group"
      role="button"
      aria-label={`Посмотреть объявление ${data.title || 'Без названия'}`} // Защита для data.title
      tabIndex={0}
    >
      <div className="flex flex-col gap-2 w-full">
        <div className="aspect-square w-full relative overflow-hidden rounded-xl">
          <Image
            src={currentImageUrl}
            alt={`${data.title || 'Объявление'} - Изображение ${currentImageIndex + 1}`} // Защита для data.title
            fill
            className="object-cover h-full w-full group-hover:scale-110 transition"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={currentImageIndex === 0}
            onError={(e) => {
              console.error(
                `[ListingCard] ID: ${data._id || 'НЕТ ID'}, Ошибка загрузки Image src: ${currentImageUrl}`,
                e
              );
              // Можно попытаться установить другой src или скрыть изображение
            }}
          />

          {hasMultipleImages && (
            <>
              <button
                onClick={handleImageNavigation('prev')}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full z-10 hover:bg-black/50 transition"
                aria-label="Предыдущее изображение"
              >
                <AiOutlineLeft size={20} />
              </button>
              <button
                onClick={handleImageNavigation('next')}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full z-10 hover:bg-black/50 transition"
                aria-label="Следующее изображение"
              >
                <AiOutlineRight size={20} />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-2 py-1 rounded-full z-10">
                {imageCounterText}
              </div>
            </>
          )}

          <div className="absolute top-3 right-3 z-10">
            {data._id ? (
              <HeartButton listingId={data._id} currentUser={currentUser} />
            ) : (
              console.warn(
                `[ListingCard] HeartButton не рендерится, так как data._id (${data._id}) отсутствует.`
              )
            )}
          </div>

          {data.hasPool && (
            <div className="absolute bottom-3 left-3 bg-white/90 px-2 py-1 rounded-md flex items-center gap-1 z-10">
              <AiFillStar className="text-amber-400" />
              <span className="text-xs font-semibold">Бассейн</span>
            </div>
          )}
        </div>

        <div className="flex justify-between items-start">
          <p className="font-semibold text-sm truncate" title={locationText}>
            {locationText}
          </p>
        </div>

        <div className="text-neutral-500 text-sm">
          {reservationDateRange || data.category || 'Категория не указана'}{' '}
          {/* Защита для data.category */}
        </div>

        <div className="flex items-center justify-between">
          <div className="font-semibold flex items-center gap-1">
            $ {displayPrice}
            {/* Показываем "за ночь" только если это не резервация И цена была изначально определена (не undefined) */}
            {priceLabel && data.price !== undefined && (
              <span className="font-light text-sm">{priceLabel}</span>
            )}
          </div>
          <div className="text-sm text-neutral-500">{amenitiesText}</div>
        </div>

        {onAction && actionLabel && (
          <button
            onClick={handleCancel}
            disabled={disabled}
            className={`mt-2 py-2 px-4 rounded-md w-full ${
              disabled
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-rose-500 text-white hover:opacity-90 transition'
            }`}
            aria-disabled={disabled}
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default ListingCard;
