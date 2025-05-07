import prisma from '@/lib/prismadb';
import { Prisma } from '@prisma/client';

interface LocationValue {
  flag: string;
  label: string;
  latlng: [number, number];
  region: string;
  value: string;
}

interface ListingFromPrisma {
  id: string;
  title: string;
  description: string;
  imageSrc: string[];
  category: string;
  roomCount: number;
  bathroomCount: number;
  guestCount: number;
  locationValue: Prisma.JsonValue;
  price: number;
  hasWifi: boolean;
  hasPool: boolean;
  hasKitchen: boolean;
  hasParking: boolean;
  hasTV: boolean;
  hasAC: boolean;
  hasHeating: boolean;
  hasWasher: boolean;
  hasDryer: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

interface SafeListing {
  _id: string;
  id: string;
  title: string;
  description: string;
  imageSrc: string[];
  category: string;
  roomCount: number;
  bathroomCount: number;
  guestCount: number;
  locationValue: LocationValue;
  price: number;
  hasWifi: boolean;
  hasPool: boolean;
  hasKitchen: boolean;
  hasParking: boolean;
  hasTV: boolean;
  hasAC: boolean;
  hasHeating: boolean;
  hasWasher: boolean;
  hasDryer: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface GetListingsParams {
  userId?: string;
  category?: string;
  roomCount?: number;
  guestCount?: number;
  bathroomCount?: number;
  startDate?: string;
  endDate?: string;
  locationValue?: string;
  minPrice?: number;
  maxPrice?: number;
  amenities?: {
    hasWifi?: boolean;
    hasPool?: boolean;
    hasKitchen?: boolean;
    hasParking?: boolean;
    hasTV?: boolean;
    hasAC?: boolean;
    hasHeating?: boolean;
    hasWasher?: boolean;
    hasDryer?: boolean;
  };
}

// Вспомогательная функция для безопасного парсинга Prisma.JsonValue в LocationValue
function parseLocationValue(
  jsonValue: Prisma.JsonValue | null | undefined
): LocationValue {
  const defaultValue: LocationValue = {
    flag: '',
    label: 'Unknown Location',
    latlng: [0, 0],
    region: 'Unknown Region',
    value: '',
  };

  if (jsonValue && typeof jsonValue === 'object' && !Array.isArray(jsonValue)) {
    const potentialLocation = jsonValue as Record<string, unknown>;
    if (
      typeof potentialLocation.flag === 'string' &&
      typeof potentialLocation.label === 'string' &&
      Array.isArray(potentialLocation.latlng) &&
      potentialLocation.latlng.length === 2 &&
      typeof potentialLocation.latlng[0] === 'number' &&
      typeof potentialLocation.latlng[1] === 'number' &&
      typeof potentialLocation.region === 'string' &&
      typeof potentialLocation.value === 'string'
    ) {
      return {
        flag: potentialLocation.flag,
        label: potentialLocation.label,
        latlng: potentialLocation.latlng as [number, number],
        region: potentialLocation.region,
        value: potentialLocation.value,
      };
    }
  }
  console.warn(
    'getListings: Invalid or missing locationValue in a listing, returning default. Received:',
    jsonValue
  );
  return defaultValue;
}

export default async function getListings(
  params?: GetListingsParams
): Promise<SafeListing[]> {
  try {
    const {
      userId,
      category,
      roomCount,
      guestCount,
      bathroomCount,
      locationValue: locationSearchString,
      startDate,
      endDate,
      minPrice,
      maxPrice,
      amenities,
    } = params || {};

    const query: Prisma.ListingWhereInput = {};

    // Формирование объекта запроса Prisma на основе параметров фильтрации
    if (userId) query.userId = userId;
    if (category) query.category = category;
    if (roomCount) query.roomCount = { gte: +roomCount };
    if (guestCount) query.guestCount = { gte: +guestCount };
    if (bathroomCount) query.bathroomCount = { gte: +bathroomCount };

    if (locationSearchString) {
      query.locationValue = {
        path: ['label'],
        string_contains: locationSearchString,
        mode: 'insensitive',
      } as Prisma.JsonFilter;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.gte = +minPrice;
      if (maxPrice) query.price.lte = +maxPrice;
    }

    if (startDate && endDate) {
      query.NOT = {
        reservations: {
          some: {
            OR: [
              { endDate: { gte: startDate }, startDate: { lte: startDate } },
              { startDate: { lte: endDate }, endDate: { gte: endDate } },
              { startDate: { gte: startDate }, endDate: { lte: endDate } },
            ],
          },
        },
      };
    }

    if (amenities) {
      for (const [key, value] of Object.entries(amenities)) {
        if (value !== undefined) {
          query[key as keyof ListingFromPrisma] = value as boolean;
        }
      }
    }

    // Запрос к базе данных для получения объявлений
    const listingsFromDb: ListingFromPrisma[] = await prisma.listing.findMany({
      where: query,
      orderBy: { createdAt: 'desc' },
    });

    // Преобразование данных для безопасной передачи клиенту
    const safeListings: SafeListing[] = listingsFromDb.map(
      (listing: ListingFromPrisma): SafeListing => {
        return {
          ...listing,
          _id: listing.id,
          createdAt: listing.createdAt.toISOString(),
          updatedAt: listing.updatedAt.toISOString(),
          locationValue: parseLocationValue(listing.locationValue),
        };
      }
    );

    return safeListings;
  } catch (error: unknown) {
    // Обработка ошибок
    let errorMessage = 'Failed to fetch listings';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    console.error('Error in getListings:', errorMessage, error);
    throw new Error(errorMessage);
  }
}
