// Fallback API - работает без базы данных
// Используется для тестирования интерфейса

import { NextResponse } from 'next/server';

// Mock данные для тестирования
const mockProducts: any[] = [
  {
    id: 'mock-1',
    title: 'Тестовый товар #1',
    description: 'Это тестовый товар для проверки интерфейса',
    price: 299.99,
    originalPrice: 399.99,
    server: 'RU',
    gameId: '2',
    tags: ['Тест', 'Демо'],
    images: [],
    rating: 5.0,
    reviews: 12,
    sales: 45,
    status: 'online',
    seller: {
      id: 'test-seller',
      name: 'TestSeller',
      avatar: '',
      verified: true,
      rating: 4.9,
      totalSales: 120,
    },
    createdAt: new Date().toISOString(),
  },
];

// GET - вернуть моковые данные
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    
    let products = [...mockProducts];
    
    if (search) {
      products = products.filter(p => 
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Mock API error:', error);
    return NextResponse.json({ products: [] });
  }
}

// POST - имитация создания товара
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Имитация задержки сети
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Создаём "виртуальный" товар
    const newProduct = {
      id: `mock-${Date.now()}`,
      ...body,
      price: parseFloat(body.price),
      originalPrice: body.originalPrice ? parseFloat(body.originalPrice) : null,
      rating: 0,
      reviews: 0,
      sales: 0,
      status: 'online',
      seller: {
        id: 'current-user',
        name: 'Вы',
        avatar: '',
        verified: false,
        rating: 0,
        totalSales: 0,
      },
      createdAt: new Date().toISOString(),
    };

    // Добавляем в "память" (только для текущей сессии)
    mockProducts.unshift(newProduct);

    return NextResponse.json({ 
      success: true, 
      product: newProduct,
      message: '✅ Товар создан (тестовый режим)' 
    });
  } catch (error: any) {
    console.error('Mock POST error:', error);
    return NextResponse.json(
      { error: 'Ошибка создания товара' },
      { status: 500 }
    );
  }
}

// DELETE - имитация удаления
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id && id.startsWith('mock-')) {
      const index = mockProducts.findIndex(p => p.id === id);
      if (index !== -1) {
        mockProducts.splice(index, 1);
        return NextResponse.json({ success: true, message: 'Удалено (тест)' });
      }
    }

    return NextResponse.json({ success: false, message: 'Товар не найден' });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка удаления' }, { status: 500 });
  }
}
