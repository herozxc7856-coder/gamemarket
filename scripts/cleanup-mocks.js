#!/usr/bin/env node
// scripts/cleanup-mocks.js - Удаление тестовых данных

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanup() {
  console.log('🧹 Очистка тестовых данных...\n');

  try {
    // 1. Удаляем тестовые отзывы
    const reviewsCount = await prisma.review.deleteMany({
      where: {
        OR: [
          { content: { contains: 'Тест' } },
          { content: { contains: 'test' } },
          { author: { email: { contains: 'test' } } }
        ]
      }
    });
    console.log(`🗑️ Удалено отзывов: ${reviewsCount.count}`);

    // 2. Удаляем тестовые сообщения
    const messagesCount = await prisma.message.deleteMany({
      where: {
        OR: [
          { content: { contains: 'Тест' } },
          { sender: { email: { contains: 'test' } } }
        ]
      }
    });
    console.log(`🗑️ Удалено сообщений: ${messagesCount.count}`);

    // 3. Удаляем тестовые товары
    const productsCount = await prisma.product.deleteMany({
      where: {
        OR: [
          { title: { contains: 'Тест' } },
          { title: { contains: 'test' } },
          { seller: { email: { contains: 'test' } } }
        ]
      }
    });
    console.log(`🗑️ Удалено товаров: ${productsCount.count}`);

    // 4. Удаляем тестовые заказы
    const ordersCount = await prisma.order.deleteMany({
      where: {
        OR: [
          { buyer: { email: { contains: 'test' } } },
          { product: { title: { contains: 'Тест' } } }
        ]
      }
    });
    console.log(`🗑️ Удалено заказов: ${ordersCount.count}`);

    // 5. Удаляем тестовых пользователей (кроме реальных)
    const usersCount = await prisma.user.deleteMany({
      where: {
        AND: [
          { email: { contains: 'test' } },
          { email: { not: { contains: '@realdomain.com' } } } // Замените на ваш реальный домен
        ]
      }
    });
    console.log(`🗑️ Удалено пользователей: ${usersCount.count}`);

    // 6. Сбрасываем счётчики (опционально)
    // await prisma.$executeRaw`DELETE FROM sqlite_sequence WHERE name='Product'`;

    console.log('\n✅ Очистка завершена!\n');
    console.log('Теперь база данных готова для продакшена.');
    console.log('Не забудьте настроить реальную авторизацию и оплату!\n');

  } catch (error) {
    console.error('\n❌ Ошибка при очистке:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

cleanup();
