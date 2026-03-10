'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, X, Image as ImageIcon, Tag, DollarSign, 
  CheckCircle, AlertCircle, Loader2, Trash2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Commission } from '@/lib/commission';

interface SellFormProps {
  onSuccess?: (productId: string) => void;
  onCancel?: () => void;
}

export default function SellForm({ onSuccess, onCancel }: SellFormProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [createdProduct, setCreatedProduct] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    originalPrice: '',
    server: 'RU',
    gameId: '',
    category: '',
    tags: [] as string[],
  });
  
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  
  const price = parseFloat(formData.price) || 0;
  const commission = Commission.calculate(price, {
    category: formData.category || undefined,
    sellerVerified: true,
    sellerTotalSales: 0,
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      e.preventDefault();
      const tag = e.currentTarget.value.trim();
      if (!formData.tags.includes(tag) && formData.tags.length < 10) {
        handleChange('tags', [...formData.tags, tag]);
        e.currentTarget.value = '';
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    handleChange('tags', formData.tags.filter(t => t !== tagToRemove));
  };

  const handleImageSelect = useCallback((files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).slice(0, 10 - images.length);
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...newFiles]);
    setPreviewUrls(prev => [...prev, ...newPreviews]);
  }, [images.length]);

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    handleImageSelect(e.dataTransfer.files);
  }, [handleImageSelect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Подготовка данных
      const productData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        server: formData.server,
        gameId: formData.gameId || '2', // CS2 по умолчанию
        sellerId: 'default-seller',
        tags: formData.tags,
        images: [], // Фото можно добавить позже
        commissionRate: commission.commissionRate,
        commissionAmount: commission.commissionAmount,
        sellerRevenue: commission.sellerRevenue,
      };

      console.log('📦 Отправка товара:', productData);

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      const data = await res.json();
      console.log('📥 Ответ API:', data);

      if (!res.ok) {
        throw new Error(data.error || 'Ошибка создания товара');
      }

      setCreatedProduct(data.product);
      setSuccess('✅ Товар успешно опубликован!');
      
      // Не редиректим сразу, показываем успех
      setTimeout(() => {
        if (onSuccess && data.product?.id) {
          onSuccess(data.product.id);
        }
      }, 2000);

    } catch (err: any) {
      console.error('❌ Ошибка:', err);
      setError(err.message || 'Произошла ошибка при создании товара');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStep1Valid = formData.title && formData.description;
  const isStep2Valid = parseFloat(formData.price) > 0;
  const canSubmit = isStep1Valid && isStep2Valid;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6 max-w-3xl mx-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">Продать товар</h2>
          <p className="text-muted-foreground text-sm">
            Шаг {step} из 3
          </p>
        </div>
        {onCancel && (
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4 mr-1" /> Закрыть
          </Button>
        )}
      </div>

      <div className="flex gap-2 mb-6">
        {[1, 2, 3].map(s => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full transition-colors ${
              s <= step ? 'bg-neon-cyan' : 'bg-white/10'
            }`}
          />
        ))}
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-4 p-3 rounded-lg bg-neon-red/10 border border-neon-red/30 text-neon-red flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-4 p-3 rounded-lg bg-neon-green/10 border border-neon-green/30 text-neon-green flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">{success}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">
                Игра *
              </label>
              <select
                value={formData.gameId}
                onChange={(e) => handleChange('gameId', e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-black/30 border border-white/10 text-white focus:border-neon-cyan focus:outline-none"
              >
                <option value="">Выберите игру</option>
                <option value="1">🎮 World of Tanks</option>
                <option value="2">🔫 CS2</option>
                <option value="3">🚗 GTA V</option>
                <option value="4">⚔️ Dota 2</option>
                <option value="5">🏗️ Fortnite</option>
                <option value="6">🎯 Valorant</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">
                Категория
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-black/30 border border-white/10 text-white focus:border-neon-cyan focus:outline-none"
              >
                <option value="">Не выбрано</option>
                <option value="accounts">Аккаунт</option>
                <option value="currency">Валюта</option>
                <option value="boost">Буст/Прокачка</option>
                <option value="items">Предметы</option>
                <option value="services">Услуги</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">
                Название товара *
              </label>
              <Input
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Например: Прокачка до 4К урона"
                className="bg-black/30 border-white/10"
                required
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">
                Описание *
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Подробное описание услуги..."
                className="bg-black/30 border-white/10 min-h-[100px]"
                required
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" /> Теги (Enter для добавления)
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map(tag => (
                  <Badge 
                    key={tag} 
                    variant="secondary"
                    className="cursor-pointer hover:bg-neon-cyan/20"
                    onClick={() => removeTag(tag)}
                  >
                    {tag} <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
              <Input
                onKeyDown={handleTagInput}
                placeholder="Быстро, Гарантия, 24/7..."
                className="bg-black/30 border-white/10"
                disabled={formData.tags.length >= 10}
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                type="button" 
                onClick={() => setStep(2)}
                disabled={!isStep1Valid}
                className="cyber-btn"
              >
                Далее
              </Button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5" /> Цена *
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="1"
                  value={formData.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  placeholder="0.00"
                  className="bg-black/30 border-white/10"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">
                  Старая цена (для скидки)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.originalPrice}
                  onChange={(e) => handleChange('originalPrice', e.target.value)}
                  placeholder="0.00"
                  className="bg-black/30 border-white/10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">
                Сервер
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['RU', 'EU', 'US', 'ASIA'].map(server => (
                  <button
                    key={server}
                    type="button"
                    onClick={() => handleChange('server', server)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      formData.server === server
                        ? 'bg-neon-cyan/20 border border-neon-cyan text-neon-cyan'
                        : 'bg-white/5 border border-white/10 hover:border-white/20'
                    }`}
                  >
                    {server}
                  </button>
                ))}
              </div>
            </div>

            {price > 0 && (
              <motion.div 
                className="p-4 rounded-xl bg-gradient-to-r from-neon-cyan/10 to-neon-magenta/10 border border-neon-cyan/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-neon-cyan" />
                  Расчёт дохода
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Цена товара:</span>
                    <span>{Commission.format(price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Комиссия платформы ({(commission.commissionRate * 100).toFixed(0)}%):</span>
                    <span className="text-neon-red">-{Commission.format(commission.commissionAmount)}</span>
                  </div>
                  <div className="border-t border-white/10 pt-2 flex justify-between font-semibold">
                    <span>Вы получите:</span>
                    <span className="text-neon-green">{Commission.format(commission.sellerRevenue)}</span>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="flex justify-between pt-4">
              <Button type="button" variant="ghost" onClick={() => setStep(1)}>
                Назад
              </Button>
              <Button 
                type="button" 
                onClick={() => setStep(3)}
                disabled={!isStep2Valid}
                className="cyber-btn"
              >
                Далее
              </Button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="p-4 rounded-xl bg-white/5 space-y-3">
              <h4 className="font-semibold">Проверьте данные:</h4>
              <div className="text-sm space-y-2">
                <p><span className="text-muted-foreground">Товар:</span> {formData.title}</p>
                <p><span className="text-muted-foreground">Игра:</span> {formData.gameId || 'CS2 (по умолчанию)'}</p>
                <p><span className="text-muted-foreground">Цена:</span> {Commission.format(price)}</p>
                <p><span className="text-muted-foreground">Сервер:</span> {formData.server}</p>
                <p><span className="text-muted-foreground">Фото:</span> {images.length} шт.</p>
                <div className="border-t border-white/10 pt-2">
                  <p className="text-neon-green font-medium">
                    Ваш доход: {Commission.format(commission.sellerRevenue)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 text-sm">
              <AlertCircle className="w-4 h-4 text-neon-cyan flex-shrink-0 mt-0.5" />
              <p className="text-muted-foreground">
                После публикации товар появится в каталоге. 
                Комиссия платформы {(commission.commissionRate * 100).toFixed(0)}% будет удержана автоматически.
              </p>
            </div>

            <div className="flex justify-between pt-4">
              <Button type="button" variant="ghost" onClick={() => setStep(2)}>
                Назад
              </Button>
              <Button 
                type="submit" 
                disabled={!canSubmit || isSubmitting || uploading}
                className="cyber-btn min-w-[140px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Публикация...
                  </>
                ) : (
                  'Опубликовать товар'
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </form>

      {success && createdProduct && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 p-4 rounded-xl bg-neon-green/10 border border-neon-green/30"
        >
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle className="w-6 h-6 text-neon-green" />
            <h3 className="font-bold text-neon-green">Товар создан!</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            ID товара: <code className="bg-white/10 px-2 py-1 rounded">{createdProduct.id}</code>
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10"
              onClick={() => window.location.href = '/'}
            >
              В каталог
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setSuccess(null);
                setCreatedProduct(null);
                setStep(1);
                setFormData({
                  title: '',
                  description: '',
                  price: '',
                  originalPrice: '',
                  server: 'RU',
                  gameId: '',
                  category: '',
                  tags: [],
                });
              }}
            >
              Создать ещё один
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
