import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/users - Get user by ID
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        avatar: true,
        balance: true,
        rating: true,
        totalSales: true,
        verified: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

// POST /api/users - Create a new user
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, avatar } = body;

    const user = await db.user.create({
      data: {
        name,
        email,
        avatar,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

// PATCH /api/users - Update user balance
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { userId, balance, addToBalance } = body;

    let updateData: any = {};
    
    if (balance !== undefined) {
      updateData.balance = balance;
    } else if (addToBalance !== undefined) {
      const user = await db.user.findUnique({
        where: { id: userId },
        select: { balance: true },
      });
      
      if (user) {
        updateData.balance = user.balance + addToBalance;
      }
    }

    const user = await db.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
