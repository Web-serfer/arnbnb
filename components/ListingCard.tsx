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
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Блок обработки отсутствующих данных
  if (!data) {
    return (
      <div className="col-span-1 p-4 border border-red-500 rounded-xl bg-red-50">
        <p className="text-red-600 font-semibold">Listing display error</p>
        <p className="text-xs text-neutral-600">
          No listing data was received.
        </p>
      </div>
    );
  }

  // Обработчики клика по карточке
  const handleCardClick = useCallback(() => {
    router.push(`/listings/${data._id}`);
  }, [router, data._id]);

  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (disabled) return;
      onAction?.(actionId);
    },
    [disabled, onAction, actionId]
  );

  // Блок работы с изображениями
  const safeImageSrc = useMemo(() => {
    if (!data.imageSrc || !Array.isArray(data.imageSrc)) {
      return [];
    }
    return data.imageSrc;
  }, [data.imageSrc]);

  const handleImageNavigation = useCallback(
    (direction: 'prev' | 'next') => (e: React.MouseEvent) => {
      e.stopPropagation();
      if (safeImageSrc.length === 0) return;

      setCurrentImageIndex((prev) => {
        if (direction === 'next') {
          return prev === safeImageSrc.length - 1 ? 0 : prev + 1;
        } else {
          return prev === 0 ? safeImageSrc.length - 1 : prev - 1;
        }
      });
    },
    [safeImageSrc.length]
  );

  // Блок работы с ценами
  const displayPrice = useMemo(
    () => (reservation ? reservation.totalPrice : (data.price ?? 0)),
    [reservation, data.price]
  );

  const priceLabel = useMemo(
    () => (reservation ? '' : 'per night'),
    [reservation]
  );

  // Блок работы с датами
  const reservationDateRange = useMemo(() => {
    if (!reservation) return null;
    try {
      const start = new Date(reservation.startDate);
      const end = new Date(reservation.endDate);
      return `${format(start, 'PP')} - ${format(end, 'PP')}`;
    } catch {
      return null;
    }
  }, [reservation]);

  // Блок работы с локацией
  const locationText = useMemo(
    () =>
      data.locationValue
        ? `${data.locationValue.region ? `${data.locationValue.region}, ` : ''}${data.locationValue.label || ''}`
        : 'Location not specified',
    [data.locationValue]
  );

  // Блок работы с удобствами
  const amenitiesText = useMemo(
    () => `${data.roomCount ?? 0} rooms · ${data.bathroomCount ?? 0} baths`,
    [data.roomCount, data.bathroomCount]
  );

  // Текущее изображение и управление галереей
  const currentImageUrl =
    safeImageSrc[currentImageIndex] || '/images/placeholder.jpg';
  const hasMultipleImages = safeImageSrc.length > 1;
  const imageCounterText = hasMultipleImages
    ? `${currentImageIndex + 1}/${safeImageSrc.length}`
    : '';

  return (
    <div
      onClick={handleCardClick}
      className="col-span-1 cursor-pointer group"
      role="button"
      aria-label={`View listing ${data.title || 'Untitled'}`}
      tabIndex={0}
    >
      <div className="flex flex-col gap-2 w-full">
        <div className="aspect-square w-full relative overflow-hidden rounded-xl">
          <Image
            src={currentImageUrl}
            alt={`${data.title || 'Listing'} - Image ${currentImageIndex + 1}`}
            fill
            className="object-cover h-full w-full group-hover:scale-110 transition"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={currentImageIndex === 0}
          />

          {hasMultipleImages && (
            <>
              <button
                onClick={handleImageNavigation('prev')}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full z-10 hover:bg-black/50 transition"
                aria-label="Previous image"
              >
                <AiOutlineLeft size={20} />
              </button>
              <button
                onClick={handleImageNavigation('next')}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full z-10 hover:bg-black/50 transition"
                aria-label="Next image"
              >
                <AiOutlineRight size={20} />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-2 py-1 rounded-full z-10">
                {imageCounterText}
              </div>
            </>
          )}

          <div className="absolute top-3 right-3 z-10">
            <HeartButton listingId={data._id} currentUser={currentUser} />
          </div>

          {data.hasPool && (
            <div className="absolute bottom-3 left-3 bg-white/90 px-2 py-1 rounded-md flex items-center gap-1 z-10">
              <AiFillStar className="text-amber-400" />
              <span className="text-xs font-semibold">Pool</span>
            </div>
          )}
        </div>

        <div className="flex justify-between items-start">
          <p className="font-semibold text-sm truncate" title={locationText}>
            {locationText}
          </p>
        </div>

        <div className="text-neutral-500 text-sm">
          {reservationDateRange || data.category || 'No category specified'}
        </div>

        <div className="flex items-center justify-between">
          <div className="font-semibold flex items-center gap-1">
            $ {displayPrice}
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
