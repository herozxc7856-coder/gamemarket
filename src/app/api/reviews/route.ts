// src/app/api/reviews/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/reviews - получить отзывы для товара
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!productId) {
      return NextResponse.json({ error: 'productId required' }, { status: 400 });
    }

    const reviews = await db.review.findMany({
      where: { productId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            verified: true,
            rating: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    return NextResponse.json({ 
      reviews, 
      averageRating: Math.round(avgRating * 10) / 10,
      total: reviews.length 
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

// POST /api/reviews - создать отзыв
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, authorId, rating, content } = body;

    if (!productId || !authorId || !rating || !content) {
      return NextResponse.json(
        { error: 'Все поля обязательны: productId, authorId, rating, content' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Рейтинг должен быть от 1 до 5' }, { status: 400 });
    }

    // Проверка: пользователь купил этот товар
    const order = await db.order.findFirst({
      where: { productId, buyerId: authorId, status: 'completed' }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Только покупатели могут оставлять отзывы' },
        { status: 403 }
      );
    }

    // Проверка: отзыв уже есть
    const existing = await db.review.findFirst({ where: { productId, authorId } });
    if (existing) {
      return NextResponse.json(
        { error: 'Вы уже оставили отзыв для этого товара' },
        { status: 400 }
      );
    }

    const review = await db.review.create({
      data: {
        productId,
        authorId,
        rating: parseInt(rating),
        content
      },
      include: {
        author: {
          select: { id: true, name: true, avatar: true, verified: true }
        }
      }
    });

    // Обновляем рейтинг товара
    const allReviews = await db.review.findMany({ where: { productId } });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await db.product.update({
      where: { id: productId },
      data: {
        rating: Math.round(avgRating * 10) / 10,
        reviews: { increment: 1 }
      }
    });

    return NextResponse.json({ success: true, review });
  } catch (error: any) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Не удалось создать отзыв', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/reviews - удалить отзыв
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (!reviewId || !userId) {
      return NextResponse.json({ error: 'id и userId обязательны' }, { status: 400 });
    }

    const review = await db.review.findUnique({ where: { id: reviewId }, include: { author: true } });
    if (!review) return NextResponse.json({ error: 'Отзыв не найден' }, { status: 404 });
    if (review.authorId !== userId) {
      return NextResponse.json({ error: 'Нет прав для удаления' }, { status: 403 });
    }

    await db.review.delete({ where: { id: reviewId } });

    // Пересчитать рейтинг
    const remaining = await db.review.findMany({ where: { productId: review.productId } });
    const newAvg = remaining.length > 0
      ? remaining.reduce((sum, r) => sum + r.rating, 0) / remaining.length
      : 0;

    await db.product.update({
      where: { id: review.productId },
      data: { rating: Math.round(newAvg * 10) / 10, reviews: { decrement: 1 } }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json({ error: 'Ошибка удаления' }, { status: 500 });
  }
}
