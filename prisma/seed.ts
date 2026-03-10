import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Дефолтные игры для маркетплейса
const defaultGames = [
  { id: '1', name: 'World of Tanks', icon: '🎮', category: 'Tanks' },
  { id: '2', name: 'CS2', icon: '🔫', category: 'FPS' },
  { id: '3', name: 'GTA V', icon: '🚗', category: 'Action' },
  { id: '4', name: 'Dota 2', icon: '⚔️', category: 'MOBA' },
  { id: '5', name: 'Fortnite', icon: '🏗️', category: 'Battle Royale' },
  { id: '6', name: 'Valorant', icon: '🎯', category: 'FPS' },
  { id: '7', name: 'PUBG Mobile', icon: '📱', category: 'Battle Royale' },
  { id: '8', name: 'Minecraft', icon: '⛏️', category: 'Sandbox' },
  { id: '9', name: 'League of Legends', icon: '🏆', category: 'MOBA' },
  { id: '10', name: 'Apex Legends', icon: '🦸', category: 'Battle Royale' },
];

async function main() {
  console.log('🌱 Seeding database...');

  // Создаём игры если их нет
  for (const game of defaultGames) {
    await prisma.game.upsert({
      where: { id: game.id },
      update: {},
      create: {
        id: game.id,
        name: game.name,
        icon: game.icon,
        category: game.category,
        trending: ['1', '2', '5'].includes(game.id), // Трендовые игры
      },
    });
    console.log(`  ✅ Game: ${game.name}`);
  }

  // Создаём тестового пользователя если нет
  const testUser = await prisma.user.upsert({
    where: { email: 'test@gamemarket.local' },
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
  console.log(`  ✅ User: ${testUser.name}`);

  // Создаём тестовые товары если их мало
  const productCount = await prisma.product.count();
  if (productCount < 5) {
    const sampleProducts = [
      {
        title: 'Прокачка аккаунта до 4К урона',
        description: 'Быстрая и качественная прокачка. Гарантия результата.',
        price: 299.99,
        server: 'RU',
        gameId: '1',
        tags: ['Прокачка', 'Быстро', 'Гарантия'],
      },
      {
        title: 'Prime аккаунт CS2 | Level 40+',
        description: 'Готовый аккаунт с высоким уровнем и инвентарём.',
        price: 890,
        server: 'EU',
        gameId: '2',
        tags: ['Аккаунт', 'Prime', 'Скины'],
      },
      {
        title: '100M GTA$ + Все бизнесы',
        description: 'Быстрый заработок в GTA Online. Мгновенная доставка.',
        price: 450,
        server: 'PC',
        gameId: '3',
        tags: ['Валюта', 'Бизнес', 'PC'],
      },
    ];

    for (const prod of sampleProducts) {
      await prisma.product.create({
        data: {
          ...prod,
          sellerId: 'default-seller',
          tags: JSON.stringify(prod.tags),
          images: JSON.stringify([]),
          commissionRate: 0.10,
          commissionAmount: prod.price * 0.10,
          sellerRevenue: prod.price * 0.90,
          status: 'online',
          rating: 4.5 + Math.random() * 0.5,
          reviews: Math.floor(Math.random() * 50),
          sales: Math.floor(Math.random() * 200),
        },
      });
      console.log(`  ✅ Product: ${prod.title}`);
    }
  }

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
