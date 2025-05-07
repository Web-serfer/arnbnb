import prisma from '@/lib/prismadb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { SafeUser } from '@/types';

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser(): Promise<SafeUser | null> {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return null;
    }

    const currentUserFromDb = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!currentUserFromDb) {
      return null;
    }

    // Преобразуем пользователя к SafeUser
    const safeCurrentUser: SafeUser = {
      ...currentUserFromDb,
      createdAt: currentUserFromDb.createdAt.toISOString(),
      updatedAt: currentUserFromDb.updatedAt.toISOString(),
      emailVerified: currentUserFromDb.emailVerified
        ? currentUserFromDb.emailVerified.toISOString()
        : null,
      // hashedPassword не будет включен из-за типа SafeUser и Omit
    };

    return safeCurrentUser;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
}
