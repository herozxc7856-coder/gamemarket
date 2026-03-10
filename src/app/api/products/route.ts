import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - получить все товары
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get('gameId');
    const server = searchParams.get('server');
    const search = searchParams.get('search');

    const where: any = {};

    if (gameId) where.gameId = gameId;
    if (server && server !== 'All') where.server = server;

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' as const } },
        { description: { contains: search, mode: 'insensitive' as const } },
      ];
    }

    const products = await db.product.findMany({
      where,
      include: {
        game: true,
        seller: {
          select: {
            id: true,
            name: true,
            avatar: true,
            verified: true,
            rating: true,
            totalSales: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ products: [], error: 'Failed to fetch' }, { status: 500 });
  }
}

// POST - создать новый товар (с автоматическим созданием foreign keys)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      title, 
      description, 
      price, 
      originalPrice, 
      server, 
      gameId, 
      sellerId,
      tags = [],
      images = [] 
    } = body;

    // Валидация
    if (!title || !price) {
      return NextResponse.json(
        { error: 'Заполните название и цену' },
        { status: 400 }
      );
    }

    // Дефолтные значения
    const finalSellerId = sellerId || 'default-seller';
    const finalGameId = gameId || '2'; // CS2 по умолчанию

    // === АВТО-СОЗДАНИЕ FOREIGN KEYS ===
    
    // 1. Создаём игру если нет
    let game = await db.game.findUnique({ where: { id: finalGameId } });
    if (!game) {
      try {
        game = await db.game.create({
          data: {
            id: finalGameId,
            name: `Game ${finalGameId}`,
            icon: '🎮',
            category: 'Other',
            trending: false,
          },
        });
        console.log(`🎮 Created game: ${finalGameId}`);
      } catch (e: any) {
        // Если не удалось создать, берём первую существующую
        game = await db.game.findFirst();
        if (!game) {
          return NextResponse.json(
            { error: 'Нет доступных игр. Сначала добавьте игру.' },
            { status: 400 }
          );
        }
      }
    }

    // 2. Создаём пользователя если нет
    let seller = await db.user.findUnique({ where: { id: finalSellerId } });
    if (!seller) {
      try {
        seller = await db.user.create({
          data: {
            id: finalSellerId,
            name: 'Seller',
            email: `${finalSellerId}@gamemarket.local`,
            avatar: '',
            balance: 0,
            rating: 0,
            totalSales: 0,
            verified: false,
          },
        });
        console.log(`👤 Created seller: ${finalSellerId}`);
      } catch (e: any) {
        // Если не удалось, берём первого пользователя
        seller = await db.user.findFirst();
        if (!seller) {
          return NextResponse.json(
            { error: 'Нет доступных пользователей.' },
            { status: 400 }
          );
        }
      }
    }

    // === РАСЧЁТ КОМИССИИ ===
    const numericPrice = parseFloat(price);
    const commissionRate = 0.10;
    const commissionAmount = numericPrice * commissionRate;
    const sellerRevenue = numericPrice - commissionAmount;

    // === СОЗДАНИЕ ТОВАРА ===
    const product = await db.product.create({
      data: {
        title,
        description: description || '',
        price: numericPrice,
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        server: server || 'RU',
        gameId: game.id,
        sellerId: seller.id,
        tags: JSON.stringify(tags),
        images: JSON.stringify(images),
        commissionRate,
        commissionAmount,
        sellerRevenue,
        status: 'online',
      },
      include: {
        game: true,
        seller: {
          select: {
            id: true,
            name: true,
            avatar: true,
            verified: true,
          },
        },
      },
    });

    return NextResponse.json({ 
      success: true, 
      product,
      message: '✅ Товар создан!' 
    });

  } catch (error: any) {
    console.error('❌ Error creating product:', error);
    
    // Дружелюбные сообщения об ошибках
    if (error.code === 'P2003') {
      return NextResponse.json({
        error: 'Ошибка связи с базой данных',
        hint: 'Запустите: node scripts/setup-db.js',
        code: error.code
      }, { status: 500 });
    }
    
    return NextResponse.json(
      { error: 'Не удалось создать товар', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - удалить товар
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Укажите ID' }, { status: 400 });
    }

    await db.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка удаления' }, { status: 500 });
  }
}
