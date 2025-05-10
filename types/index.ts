import { User, Listing } from '@prisma/client';

// SafeUser
export type SafeUser = Omit<
  User,
  'hashedPassword' | 'createdAt' | 'updatedAt' | 'emailVerified'
> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};

// SafeListing
export type SafeListing = Omit<Listing, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};
