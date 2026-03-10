import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/orders - Get all orders for a user
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    let where: any = {};
    
    if (userId) {
      where.buyerId = userId;
    }
    
    if (status) {
      where.status = status;
    }

    const orders = await db.order.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        product: {
          include: {
            game: true,
            seller: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// POST /api/orders - Create a new order
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, buyerId, quantity } = body;

    // Get product price
    const product = await db.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const amount = product.price * (quantity || 1);

    const order = await db.order.create({
      data: {
        productId,
        buyerId,
        quantity: quantity || 1,
        amount,
        status: 'pending',
      },
      include: {
        product: {
          include: {
            game: true,
            seller: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

// PATCH /api/orders - Update order status
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { orderId, status } = body;

    const order = await db.order.update({
      where: { id: orderId },
      data: { status },
    });

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
