// src/lib/commission.ts
// Логика расчёта комиссий платформы

// Конфигурация комиссий
export const COMMISSION_CONFIG = {
  defaultRate: 0.10, // 10% по умолчанию
  minRate: 0.05,     // Минимум 5%
  maxRate: 0.25,     // Максимум 25%
  
  // Категории с особыми ставками
  categoryRates: {
    'accounts': 0.15,    // Аккаунты - 15%
    'currency': 0.12,    // Игровая валюта - 12%
    'boost': 0.10,       // Буст/прокачка - 10%
    'items': 0.08,       // Предметы - 8%
    'services': 0.10,    // Услуги - 10%
  },
  
  // Скидки для проверенных продавцов
  verifiedSellerDiscount: 0.02, // -2% для проверенных
  topSellerDiscount: 0.03,      // -3% для топ-продавцов (1000+ продаж)
};

// Интерфейс расчёта
export interface CommissionCalculation {
  price: number;           // Исходная цена
  commissionRate: number;  // Ставка комиссии
  commissionAmount: number;// Сумма комиссии
  sellerRevenue: number;   // Доход продавца
  platformFee: number;     // Комиссия платформы
}

/**
 * Рассчитать комиссию для товара/заказа
 */
export function calculateCommission(
  price: number,
  options: {
    category?: string;
    sellerVerified?: boolean;
    sellerTotalSales?: number;
    customRate?: number;
  } = {}
): CommissionCalculation {
  // Базовая ставка
  let rate = COMMISSION_CONFIG.defaultRate;
  
  // Ставка по категории
  if (options.category && COMMISSION_CONFIG.categoryRates[options.category]) {
    rate = COMMISSION_CONFIG.categoryRates[options.category];
  }
  
  // Пользовательская ставка (приоритет)
  if (options.customRate !== undefined) {
    rate = Math.max(
      COMMISSION_CONFIG.minRate,
      Math.min(COMMISSION_CONFIG.maxRate, options.customRate)
    );
  }
  
  // Скидка для проверенного продавца
  if (options.sellerVerified) {
    rate -= COMMISSION_CONFIG.verifiedSellerDiscount;
  }
  
  // Скидка для топ-продавца
  if ((options.sellerTotalSales || 0) >= 1000) {
    rate -= COMMISSION_CONFIG.topSellerDiscount;
  }
  
  // Ограничения
  rate = Math.max(
    COMMISSION_CONFIG.minRate,
    Math.min(COMMISSION_CONFIG.maxRate, rate)
  );
  
  // Расчёты
  const commissionAmount = price * rate;
  const sellerRevenue = price - commissionAmount;
  
  return {
    price,
    commissionRate: rate,
    commissionAmount: Math.round(commissionAmount * 100) / 100,
    sellerRevenue: Math.round(sellerRevenue * 100) / 100,
    platformFee: Math.round(commissionAmount * 100) / 100,
  };
}

/**
 * Форматировать сумму для отображения
 */
export function formatMoney(amount: number, currency: string = '₽'): string {
  return `${amount.toLocaleString('ru-RU', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}${currency}`;
}

/**
 * Создать запись комиссии для БД
 */
export function createCommissionRecord(
  orderId: string,
  calculation: CommissionCalculation
) {
  return {
    orderId,
    rate: calculation.commissionRate,
    amount: calculation.commissionAmount,
    status: 'pending' as const,
    metadata: JSON.stringify({
      originalPrice: calculation.price,
      sellerRevenue: calculation.sellerRevenue,
      calculatedAt: new Date().toISOString(),
    }),
  };
}

// Экспорт для удобного использования
export const Commission = {
  calculate: calculateCommission,
  format: formatMoney,
  createRecord: createCommissionRecord,
  config: COMMISSION_CONFIG,
};
