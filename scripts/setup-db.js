// scripts/setup-db.js - Принудительная настройка БД
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function setup() {
  console.log('🔧 Настройка базы данных...\n');

  try {
    // 1. Создаём игры
    console.log('📦 Создание игр...');
    const games = [
      { id: '1', name: 'World of Tanks', icon: '🎮', category: 'Tanks' },
      { id: '2', name: 'CS2', icon: '🔫', category: 'FPS' },
      { id: '3', name: 'GTA V', icon: '🚗', category: 'Action' },
      { id: '4', name: 'Dota 2', icon: '⚔️', category: 'MOBA' },
      { id: '5', name: 'Fortnite', icon: '🏗️', category: 'Battle Royale' },
      { id: '6', name: 'Valorant', icon: '🎯', category: 'FPS' },
    ];

    for (const game of games) {
      await prisma.game.upsert({
        where: { id: game.id },
        update: {},
        create: game,
      });
      console.log(`   ✅ ${game.name}`);
    }

    // 2. Создаём тестового пользователя
    console.log('\n👤 Создание пользователя...');
    const user = await prisma.user.upsert({
      where: { id: 'default-seller' },
      update: {},
      create: {
        id: 'default-seller',
        name: 'Test Seller',
        email: 'test@gamemarket.local',
        avatar: '',
        balance: 10000,
        rating: 4.9,
        totalSales: 0,
        verified: true,
      },
    });
    console.log(`   ✅ ${user.name} (ID: ${user.id})`);

    // 3. Создаём тестовый товар
    console.log('\n🛍️ Создание тестового товара...');
    const product = await prisma.product.create({
      data: {
        title: 'Тестовый товар - Прокачка CS2',
        description: 'Быстрая прокачка аккаунта. Гарантия качества.',
        price: 299.99,
        originalPrice: 399.99,
        server: 'RU',
        gameId: '2',
        sellerId: 'default-seller',
        tags: JSON.stringify(['Прокачка', 'Быстро', 'Гарантия']),
        images: JSON.stringify([]),
        commissionRate: 0.10,
        commissionAmount: 30.00,
        sellerRevenue: 269.99,
        status: 'online',
        rating: 5.0,
        reviews: 0,
        sales: 0,
      },
    });
    console.log(`   ✅ ${product.title}`);

    console.log('\n✅ Настройка завершена!\n');
    console.log(' Теперь запустите: npm run dev');
    console.log('🌐 Сайт: http://localhost:3000\n');

  } catch (error) {
    console.error('\n❌ Ошибка:', error.message);
    console.error('\nПопробуйте:\n  1. npx prisma generate\n  2. npx prisma db push --accept-data-loss\n  3. node scripts/setup-db.js\n');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setup();
