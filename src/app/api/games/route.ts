import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/games - Get all games
export async function GET() {
  try {
    const games = await db.game.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json({ games });
  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 });
  }
}

// POST /api/games - Create a new game
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, icon, category, trending } = body;

    const game = await db.game.create({
      data: {
        name,
        icon,
        category,
        trending: trending || false,
      },
    });

    return NextResponse.json({ game });
  } catch (error) {
    console.error('Error creating game:', error);
    return NextResponse.json({ error: 'Failed to create game' }, { status: 500 });
  }
}
