import prisma from '@/lib/prismadb';
import { Listing, User } from '@prisma/client';

interface IParams {
  listingId?: string;
}

interface SerializedUser
  extends Omit<User, 'createdAt' | 'updatedAt' | 'emailVerified'> {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
}

interface SerializedListing extends Omit<Listing, 'createdAt' | 'updatedAt'> {
  createdAt: string;
  updatedAt: string;
  user: SerializedUser;
}

export default async function getListingById(
  params: IParams
): Promise<SerializedListing | null> {
  try {
    const { listingId } = params;

    if (!listingId || typeof listingId !== 'string') {
      throw new Error('Invalid listing ID');
    }

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: { user: true },
    });

    if (!listing) {
      return null;
    }

    return {
      ...listing,
      createdAt: listing.createdAt.toISOString(),
      updatedAt: listing.updatedAt.toISOString(),
      user: {
        ...listing.user,
        createdAt: listing.user.createdAt.toISOString(),
        updatedAt: listing.user.updatedAt.toISOString(),
        emailVerified: listing.user.emailVerified?.toISOString() || null,
      },
    };
  } catch (error: unknown) {
    let errorMessage = 'Failed to fetch listing';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    console.error(errorMessage);
    throw new Error(errorMessage);
  }
}
