'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SellForm from '@/components/SellForm';

export default function SellPage() {
  const [showForm, setShowForm] = useState(false);
  const [productCreated, setProductCreated] = useState(false);

  const handleSuccess = (productId: string) => {
    // Показываем успех на той же странице вместо редиректа
    setProductCreated(true);
    console.log('✅ Product created:', productId);
  };

  const handleBackToCatalog = () => {
    window.location.href = '/';
  };

  const handleCreateAnother = () => {
    setProductCreated(false);
    setShowForm(true);
  };

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Button 
          variant="ghost" 
          className="mb-4 text-muted-foreground hover:text-white"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад
        </Button>
        <h1 className="text-2xl font-bold">Продать товар</h1>
        <p className="text-muted-foreground">
          Создайте объявление и начните продавать
        </p>
      </motion.div>

      {/* Экран успеха после создания товара */}
      {productCreated && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-8 text-center max-w-lg mx-auto"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-neon-green/20 to-emerald-500/20 flex items-center justify-center">
            <Package className="w-10 h-10 text-neon-green" />
          </div>
          <h2 className="text-xl font-bold text-neon-green mb-3">
            🎉 Товар опубликован!
          </h2>
          <p className="text-muted-foreground mb-6">
            Ваш товар добавлен в каталог и теперь доступен для покупки.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              className="cyber-btn"
              onClick={handleBackToCatalog}
            >
              Перейти в каталог
            </Button>
            <Button 
              variant="outline"
              className="border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10"
              onClick={handleCreateAnother}
            >
              Создать ещё один
            </Button>
          </div>
        </motion.div>
      )}

      {/* Форма продажи или стартовый экран */}
      {!productCreated && (
        !showForm ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card rounded-2xl p-8 text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-neon-cyan/20 to-neon-magenta/20 flex items-center justify-center">
              <span className="text-4xl">🎮</span>
            </div>
            <h2 className="text-xl font-bold mb-3">Готовы начать продавать?</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Разместите свой товар в каталоге, получайте заказы и зарабатывайте. 
              Комиссия платформы — всего 10%.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-8 text-sm">
              <div className="p-3 rounded-lg bg-white/5">
                <div className="text-neon-cyan font-bold">10%</div>
                <div className="text-muted-foreground">Комиссия</div>
              </div>
              <div className="p-3 rounded-lg bg-white/5">
                <div className="text-neon-green font-bold">24/7</div>
                <div className="text-muted-foreground">Поддержка</div>
              </div>
              <div className="p-3 rounded-lg bg-white/5">
                <div className="text-neon-magenta font-bold">Мгновенно</div>
                <div className="text-muted-foreground">Публикация</div>
              </div>
            </div>
            <Button 
              className="cyber-btn px-8"
              onClick={() => setShowForm(true)}
            >
              Создать объявление
            </Button>
          </motion.div>
        ) : (
          <SellForm 
            onSuccess={handleSuccess}
            onCancel={() => setShowForm(false)}
          />
        )
      )}
    </div>
  );
}
