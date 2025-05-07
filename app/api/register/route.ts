import bcrypt from 'bcryptjs';
import prisma from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, image } = body;

    console.log('API /api/register received:', {
      body,
      name,
      email,
      password,
      image,
    }); 
    if (!name || !email) {
      return new NextResponse('Missing name or email', { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    console.log('API /api/register user:', existingUser); 

    if (existingUser) {
      return new NextResponse('User with this email already exists', {
        status: 409,
      });
    }

    let hashedPassword = null;

    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword: hashedPassword,
        image: image || null,
      },
    });

    console.log('API /api/register created user:', user); 

    return NextResponse.json(user);
  } catch (error) {    
    console.error('Error during user creation:', error);

    return new NextResponse('Failed to create user', { status: 500 });
  }
}
