import bcrypt from 'bcryptjs';
import prisma from '@/lib/prismadb';
import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';

interface GoogleProfile extends Record<string, any> {
  image?: string;
}

interface GithubProfile extends Record<string, any> {
  avatar_url?: string;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'Email' },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'Password',
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please provide email and password.');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.hashedPassword) {
          throw new Error('User not found or password not set.');
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isPasswordCorrect) {
          throw new Error('Invalid password');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  pages: {
    signIn: '/',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        if (user.image) {
          token.image = user.image;
        }
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token?.id) {
        session.user.id = token.id as string;
        if (token?.image) {
          session.user.image = token.image as string;
        }
      }
      return session;
    },

    // signIn
    async signIn({ user, account, profile }) {
      if (account?.provider === 'credentials') return true;

      let avatarUrl: string | null = null;

      // Определение аватара для разных провайдеров
      if (account?.provider === 'google') {
        // Исправление: Google использует поле 'picture' вместо 'image'
        avatarUrl = (profile as GoogleProfile)?.picture || null;
      } else if (account?.provider === 'github') {
        avatarUrl = (profile as GithubProfile)?.avatar_url || null;
      }

      // Поиск существующего пользователя
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email as string },
        include: { accounts: true },
      });

      if (existingUser) {
        // Обновление данных с принудительной заменой аватара
        await prisma.$transaction([
          prisma.account.upsert({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            },
            update: {
              userId: existingUser.id,
              // Обновляем access_token и expires_at
              access_token: account.access_token,
              expires_at: account.expires_at,
            },
            create: {
              userId: existingUser.id,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              type: 'oauth',
              access_token: account.access_token,
              expires_at: account.expires_at,
            },
          }),
          prisma.user.update({
            where: { id: existingUser.id },
            data: {
              image: avatarUrl, // Принудительная перезапись
              name: user.name || existingUser.name,
              // Обновляем emailVerified для Google
              emailVerified:
                account.provider === 'google'
                  ? new Date()
                  : existingUser.emailVerified,
            },
          }),
        ]);

        // Обновляем данные сессии
        user.id = existingUser.id;
        user.image = avatarUrl;
        user.name = user.name || existingUser.name;
      } else {
        // Создание нового пользователя
        const newUser = await prisma.user.create({
          data: {
            email: user.email as string,
            name: user.name as string,
            image: avatarUrl,
            emailVerified: account.provider === 'google' ? new Date() : null,
          },
        });

        await prisma.account.create({
          data: {
            userId: newUser.id,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            type: 'oauth',
            access_token: account.access_token,
            expires_at: account.expires_at,
          },
        });

        user.id = newUser.id;
        user.image = avatarUrl;
      }

      return true;
    },
  },
  debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions);
