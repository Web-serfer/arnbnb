import prisma from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

interface LocationValue {
  value: string;
  label: string;
  latlng: [number, number];
  region: string;
  flag: string;
}

interface ImageData {
  url: string;
  publicId: string;
}

interface ListingRequestBody {
  category: string;
  location: LocationValue;
  guestCount: number;
  roomCount: number;
  bathroomCount: number;
  imageSrc: ImageData[];
  price: number;
  title: string;
  description: string;
  hasWifi?: boolean;
  hasPool?: boolean;
  hasKitchen?: boolean;
  hasParking?: boolean;
  hasTV?: boolean;
  hasAC?: boolean;
  hasHeating?: boolean;
  hasWasher?: boolean;
  hasDryer?: boolean;
}

export async function POST(request: Request) {
  try {
    // 1. Проверка аутентификации
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Парсинг тела запроса
    let body: ListingRequestBody;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    // 3. Валидация данных
    if (
      !body.imageSrc ||
      !Array.isArray(body.imageSrc) ||
      body.imageSrc.length === 0
    ) {
      return NextResponse.json(
        { error: 'At least one image is required' },
        { status: 400 }
      );
    }

    // 4. Преобразование изображений в массив URL
    const imageUrls = body.imageSrc.map((img) => img.url);

    // 5. Создание listing
    const listing = await prisma.listing.create({
      data: {
        userId: session.user.id,
        title: body.title,
        description: body.description,
        imageSrc: imageUrls,
        category: body.category,
        roomCount: Number(body.roomCount),
        bathroomCount: Number(body.bathroomCount),
        guestCount: Number(body.guestCount),
        locationValue: body.location,
        price: Number(body.price),
        hasWifi: Boolean(body.hasWifi),
        hasPool: Boolean(body.hasPool),
        hasKitchen: Boolean(body.hasKitchen),
        hasParking: Boolean(body.hasParking),
        hasTV: Boolean(body.hasTV),
        hasAC: Boolean(body.hasAC),
        hasHeating: Boolean(body.hasHeating),
        hasWasher: Boolean(body.hasWasher),
        hasDryer: Boolean(body.hasDryer),
      },
    });

    // 6. Возвращаем созданный listing
    return NextResponse.json(
      {
        success: true,
        data: {
          ...listing,
          imageSrc: body.imageSrc,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Listing creation error:', error);

    // Обработка ошибок Prisma
    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
      return NextResponse.json({ error: 'Duplicate entry' }, { status: 409 });
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
