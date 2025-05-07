import bcrypt from 'bcryptjs';
import prisma from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    // 1. Получение данных из запроса
    const body = await request.json();
    const { email, password } = body;

    // 2. Проверка наличия обязательных полей
    if (!email || !password) {
      return new Response('Missing fields', { status: 400 });
    }

    // 3. Проверка формата email с помощью регулярного выражения
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response('Invalid email format', { status: 400 });
    }

    // 4. Поиск пользователя по email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // 5. Проверка, существует ли пользователь
    if (!user) {
      return new Response('Invalid credentials', { status: 401 }); // Unauthorized
    }

    // 6. Сравнение паролей
    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);

    // 7. Если пароли не совпадают, возвращаем ошибку
    if (!passwordMatch) {
      return new Response('Invalid credentials', { status: 401 }); // Unauthorized
    }

    // 8. Создание JWT токена
    const token = sign({ userId: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: '1h', // токен будет действителен 1 час, можно изменить
    });

    // 9. Возвращаем успешный ответ (можно вернуть токен)
    return NextResponse.json(
      { message: 'Login successful', token },
      { status: 200 }
    ); // Возвращаем JSON с сообщением
  } catch (error) {
    // Если произошла ошибка, выполняем этот блок кода
    // 10. Логирование ошибки
    console.error('Error during login:', error);

    if (error instanceof Error) {
      // Если ошибка является экземпляром Error, логируем сообщение и стек ошибки
      console.error('Error during login:', error.message, error.stack);
    } else {
      // Если ошибка не является экземпляром Error, логируем сообщение об ошибке и саму ошибку
      console.error('Error during login: Unknown error', error);
    }

    // 11. Возвращаем сообщение об ошибке
    return new Response('Failed to log in', { status: 500 });
  }
}
