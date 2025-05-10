import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/actions/getCurrentUser';
import prisma from '@/lib/prismadb';

interface IParams {
  listingId?: string;
}

// Обработчик ошибок API
const handleError = (error: unknown, context: string) => {
  console.error(`[API_ERROR] ${context}:`, error);
  const statusCode =
    error instanceof Error && error.message.includes('not found') ? 404 : 500;
  const message = error instanceof Error ? error.message : 'Server error';
  return NextResponse.json(
    { success: false, error: message },
    { status: statusCode }
  );
};

// Проверка авторизации и валидности listingId
const validateRequest = async (params: IParams) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error('Требуется авторизация');

  const { listingId } = params;
  if (!listingId || typeof listingId !== 'string')
    throw new Error('Некорректный ID объявления');

  const listingExists = await prisma.listing.findUnique({
    where: { id: listingId },
  });
  if (!listingExists) throw new Error('Объявление не найдено');

  return { currentUser, listingId };
};

// Добавление в избранное
export async function POST(request: Request, { params }: { params: IParams }) {
  try {
    const { currentUser, listingId } = await validateRequest(params);

    // Проверка на дублирование
    if (currentUser.favoriteIds.includes(listingId)) {
      return NextResponse.json(
        { success: true, message: 'Уже в избранном' },
        { status: 200 }
      );
    }

    // Обновление списка избранного
    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: { favoriteIds: { push: listingId } },
      select: { id: true, favoriteIds: true },
    });

    return NextResponse.json({
      success: true,
      message: 'Добавлено в избранное',
      data: updatedUser,
    });
  } catch (error) {
    return handleError(error, 'POST_FAVORITE');
  }
}

// Удаление из избранного
export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const { currentUser, listingId } = await validateRequest(params);

    // Проверка наличия в избранном
    if (!currentUser.favoriteIds.includes(listingId)) {
      throw new Error('Не найдено в избранном');
    }

    // Удаление из списка
    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        favoriteIds: currentUser.favoriteIds.filter((id) => id !== listingId),
      },
      select: { id: true, favoriteIds: true },
    });

    return NextResponse.json({
      success: true,
      message: 'Удалено из избранного',
      data: updatedUser,
    });
  } catch (error) {
    return handleError(error, 'DELETE_FAVORITE');
  }
}
