// types/index.ts
import { User } from '@prisma/client'; // Если Prisma генерирует типы

export type SafeUser = Omit<
  User,
  'hashedPassword' | 'createdAt' | 'updatedAt' | 'emailVerified'
> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};
