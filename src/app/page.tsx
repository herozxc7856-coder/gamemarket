'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Menu, X, Bell, Wallet, ChevronDown, Star, Clock,
  TrendingUp, Package, MessageCircle, User, BarChart3, Settings,
  Heart, ShoppingCart, Filter, Grid, List, ChevronRight, Send,
  Paperclip, Smile, MoreVertical, CheckCircle, XCircle, AlertCircle,
  Play, Pause, SkipForward, Zap, Shield, Award, Users, DollarSign,
  ArrowUpRight, ArrowDownRight, Calendar, Globe, Server
} from 'lucide-react';
import { useStore, mockProducts, mockGames, type Product, type Game } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';

// Animation variants
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const slideIn = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 }
};

// Particle Background Component
const ParticleBackground = () => (
  <div className="particles">
    {[...Array(30)].map((_, i) => (
      <div
        key={i}
        className="particle"
        style={{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 20}s`,
          animationDuration: `${15 + Math.random() * 10}s`,
        }}
      />
    ))}
  </div>
);

// Header Component
const Header = () => {
  const { user, searchQuery, setSearchQuery, toggleChat, setCurrentPage, chatOpen } = useStore();
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-neon-cyan/20">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        {/* Logo */}
        <motion.div 
          className="flex items-center gap-3 cursor-pointer"
          whileHover={{ scale: 1.02 }}
          onClick={() => setCurrentPage('catalog')}
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-magenta flex items-center justify-center">
              <Zap className="w-6 h-6 text-background" />
            </div>
            <div className="absolute inset-0 rounded-lg bg-neon-cyan/30 blur-lg" />
          </div>
          <span className="text-2xl font-bold neon-text-gradient hidden sm:block">
            NexaTrade
          </span>
        </motion.div>

        {/* Search Bar */}
        <div className={`flex-1 max-w-xl mx-4 lg:mx-8 relative transition-all duration-300 ${searchFocused ? 'scale-105' : ''}`}>
          <div className={`relative rounded-xl transition-all duration-300 ${searchFocused ? 'neon-border-cyan' : 'border border-white/10'}`}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Поиск игр, предметов, услуг..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="pl-10 pr-4 py-3 bg-black/30 border-0 text-white placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Balance */}
          <motion.div 
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl glass cursor-pointer"
            whileHover={{ scale: 1.02 }}
            onClick={() => setCurrentPage('balance')}
          >
            <Wallet className="w-5 h-5 text-neon-cyan" />
            <span className="font-semibold text-neon-green">{user.balance.toLocaleString()}₽</span>
          </motion.div>

          {/* Notifications */}
          <motion.button 
            className="relative p-2 rounded-lg glass hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-neon-magenta" />
          </motion.button>

          {/* Chat Toggle */}
          <motion.button 
            className="relative p-2 rounded-lg glass hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleChat}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-neon-green" />
          </motion.button>

          {/* User Profile */}
          <motion.div 
            className="flex items-center gap-2 px-2 lg:px-3 py-1.5 rounded-xl glass cursor-pointer hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.02 }}
            onClick={() => setCurrentPage('dashboard')}
          >
            <div className="relative">
              <Avatar className="w-8 h-8 border-2 border-neon-cyan/50">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-neon-cyan/20 text-neon-cyan">
                  {user.name[0]}
                </AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-neon-green border-2 border-background" />
            </div>
            <span className="hidden lg:block font-medium">{user.name}</span>
            <ChevronDown className="w-4 h-4 hidden lg:block text-muted-foreground" />
          </motion.div>
        </div>
      </div>
    </header>
  );
};

// Sidebar Component
const Sidebar = () => {
  const { games, selectedGame, setSelectedGame, sidebarCollapsed, setCurrentPage } = useStore();

  const menuItems = [
    { icon: Grid, label: 'Каталог', page: 'catalog' as const, active: true },
    { icon: Package, label: 'Мои заказы', page: 'orders' as const, badge: 3 },
    { icon: BarChart3, label: 'Статистика', page: 'dashboard' as const },
    { icon: Wallet, label: 'Баланс', page: 'balance' as const },
    { icon: Heart, label: 'Избранное', page: 'catalog' as const },
  ];

  return (
    <motion.aside 
      className={`fixed left-0 top-16 bottom-0 z-40 glass-dark border-r border-neon-cyan/10 transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      }`}
      initial={false}
    >
      <div className="flex flex-col h-full">
        {/* Navigation Menu */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => (
            <motion.button
              key={item.label}
              onClick={() => setCurrentPage(item.page)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                item.active ? 'bg-neon-cyan/10 text-neon-cyan' : 'text-muted-foreground hover:bg-white/5 hover:text-white'
              }`}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${item.active ? 'text-neon-cyan' : 'group-hover:text-neon-cyan'}`} />
              {!sidebarCollapsed && (
                <>
                  <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-neon-magenta text-white">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </motion.button>
          ))}
        </nav>

        <Separator className="mx-3 bg-neon-cyan/10" />

        {/* Games List */}
        <ScrollArea className="flex-1 p-3">
          <div className="mb-2">
            {!sidebarCollapsed && (
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
                Популярные игры
              </h3>
            )}
          </div>
          <div className="space-y-1">
            {games.slice(0, 8).map((game) => (
              <motion.button
                key={game.id}
                onClick={() => setSelectedGame(selectedGame?.id === game.id ? null : game)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                  selectedGame?.id === game.id 
                    ? 'bg-neon-cyan/15 border border-neon-cyan/40 neon-glow-cyan' 
                    : 'text-muted-foreground hover:bg-white/5 hover:text-white border border-transparent'
                }`}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-lg flex-shrink-0">{game.icon}</span>
                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1 text-left text-sm font-medium truncate">{game.name}</span>
                    {game.trending && (
                      <TrendingUp className="w-4 h-4 text-neon-green" />
                    )}
                  </>
                )}
              </motion.button>
            ))}
          </div>
        </ScrollArea>

        {/* Collapse Button */}
        <div className="p-3 border-t border-neon-cyan/10">
          <motion.button
            onClick={() => useStore.getState().toggleSidebar()}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-muted-foreground hover:bg-white/5 hover:text-white transition-colors"
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${sidebarCollapsed ? '' : 'rotate-180'}`} />
          </motion.button>
        </div>
      </div>
    </motion.aside>
  );
};

// Star Rating Component
const StarRating = ({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`${sizeClasses[size]} ${
            i < Math.floor(rating) 
              ? 'text-neon-cyan fill-neon-cyan/30' 
              : 'text-muted-foreground/30'
          } transition-all duration-200`}
        />
      ))}
      <span className="ml-1 text-sm text-muted-foreground">{rating.toFixed(1)}</span>
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product }: { product: Product }) => {
  const { setSelectedProduct } = useStore();

  return (
    <motion.div
      className="glass-card rounded-xl overflow-hidden card-hover cursor-pointer"
      initial="initial"
      animate="animate"
      variants={fadeIn}
      whileHover={{ y: -4 }}
      onClick={() => setSelectedProduct(product)}
    >
      {/* Product Image Placeholder */}
      <div className="relative h-40 bg-gradient-to-br from-neon-cyan/10 to-neon-magenta/10 flex items-center justify-center">
        <div className="text-5xl">{mockGames.find(g => g.id === product.gameId)?.icon || '🎮'}</div>
        {product.originalPrice && (
          <Badge className="absolute top-2 right-2 bg-neon-magenta text-white border-0">
            -{Math.round((1 - product.price / product.originalPrice) * 100)}%
          </Badge>
        )}
      </div>

      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-white mb-2 line-clamp-2 text-sm leading-tight">
          {product.title}
        </h3>

        {/* Seller Info */}
        <div className="flex items-center gap-2 mb-3">
          <div className="relative">
            <Avatar className="w-6 h-6 border border-neon-cyan/30">
              <AvatarImage src={product.seller.avatar} />
              <AvatarFallback className="bg-neon-cyan/20 text-neon-cyan text-xs">
                {product.seller.name[0]}
              </AvatarFallback>
            </Avatar>
            {product.status === 'online' && (
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-neon-green border-2 border-background" />
            )}
          </div>
          <span className="text-xs text-muted-foreground truncate">{product.seller.name}</span>
          {product.seller.verified && (
            <Shield className="w-3.5 h-3.5 text-neon-cyan flex-shrink-0" />
          )}
        </div>

        {/* Rating & Sales */}
        <div className="flex items-center justify-between mb-3">
          <StarRating rating={product.rating} />
          <span className="text-xs text-muted-foreground">{product.sales} продаж</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-neon-green">{product.price.toLocaleString()}₽</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through ml-2">
                {product.originalPrice}₽
              </span>
            )}
          </div>
          <Badge variant="outline" className="border-neon-cyan/30 text-neon-cyan text-xs">
            {product.server}
          </Badge>
        </div>
      </div>
    </motion.div>
  );
};

// Catalog Page Component
const CatalogPage = () => {
  const { products, selectedGame, sortBy, setSortBy, searchQuery } = useStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredProducts = products.filter(p => {
    if (selectedGame && p.gameId !== selectedGame.id) return false;
    if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price_asc': return a.price - b.price;
      case 'price_desc': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      case 'sales': return b.sales - a.sales;
      default: return 0;
    }
  });

  return (
    <div className="p-4 lg:p-6">
      {/* Banner Slider */}
      <motion.div 
        className="relative h-48 lg:h-64 rounded-2xl overflow-hidden mb-6 glass-card"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/20 via-neon-magenta/20 to-neon-purple/20" />
        <div className="absolute inset-0 flex items-center justify-between px-6 lg:px-12">
          <div>
            <h2 className="text-2xl lg:text-4xl font-bold mb-2 neon-text-gradient">
              НОВЫЙ СЕЗОН
            </h2>
            <p className="text-muted-foreground text-sm lg:text-base mb-4">
              Скидки до 40% на все услуги
            </p>
            <Button className="cyber-btn">
              <Zap className="w-4 h-4 mr-2" />
              Смотреть предложения
            </Button>
          </div>
          <div className="hidden lg:block">
            <div className="text-8xl opacity-20">🎮</div>
          </div>
        </div>
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent pointer-events-none" />
      </motion.div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          {selectedGame && (
            <Badge 
              className="bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30 px-3 py-1.5 cursor-pointer hover:bg-neon-cyan/30"
              onClick={() => useStore.getState().setSelectedGame(null)}
            >
              {selectedGame.name}
              <X className="w-3 h-3 ml-2" />
            </Badge>
          )}
          <span className="text-sm text-muted-foreground">
            {sortedProducts.length} предложений
          </span>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-sm text-white focus:outline-none focus:border-neon-cyan"
          >
            <option value="rating">По рейтингу</option>
            <option value="sales">По продажам</option>
            <option value="price_asc">Цена ↑</option>
            <option value="price_desc">Цена ↓</option>
          </select>
          <div className="flex rounded-lg overflow-hidden border border-white/10">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-neon-cyan/20 text-neon-cyan' : 'text-muted-foreground hover:text-white'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-neon-cyan/20 text-neon-cyan' : 'text-muted-foreground hover:text-white'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <motion.div 
        className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}
        layout
      >
        <AnimatePresence mode="popLayout">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </AnimatePresence>
      </motion.div>

      {sortedProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
          <p className="text-muted-foreground">Нет предложений по вашему запросу</p>
        </div>
      )}
    </div>
  );
};

// Product Detail Page Component
const ProductDetailPage = () => {
  const { selectedProduct, setSelectedProduct, user } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedServer, setSelectedServer] = useState<string | null>(null);

  if (!selectedProduct) return null;

  const servers = ['RU', 'EU', 'US', 'ASIA'];

  return (
    <div className="p-4 lg:p-6 max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <motion.div 
        className="flex items-center gap-2 text-sm text-muted-foreground mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button onClick={() => setSelectedProduct(null)} className="hover:text-neon-cyan transition-colors">
          Каталог
        </button>
        <ChevronRight className="w-4 h-4" />
        <span className="text-neon-cyan">{selectedProduct.title}</span>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Product Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Image */}
          <motion.div 
            className="glass-card rounded-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="h-64 bg-gradient-to-br from-neon-cyan/10 to-neon-magenta/10 flex items-center justify-center relative">
              <div className="text-8xl">{mockGames.find(g => g.id === selectedProduct.gameId)?.icon || '🎮'}</div>
              {selectedProduct.originalPrice && (
                <Badge className="absolute top-4 right-4 bg-neon-magenta text-white border-0 text-lg px-4 py-1">
                  -{Math.round((1 - selectedProduct.price / selectedProduct.originalPrice) * 100)}%
                </Badge>
              )}
              {/* Decorative element */}
            </div>
          </motion.div>

          {/* Description */}
          <motion.div 
            className="glass-card rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-xl font-bold mb-4">Описание</h2>
            <p className="text-muted-foreground leading-relaxed">{selectedProduct.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedProduct.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="border-neon-cyan/30 text-neon-cyan">
                  {tag}
                </Badge>
              ))}
            </div>
          </motion.div>

          {/* Seller Info */}
          <motion.div 
            className="glass-card rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-bold mb-4">Продавец</h2>
            <div className="flex items-start gap-4">
              <div className="relative">
                <Avatar className="w-16 h-16 border-2 border-neon-cyan/50">
                  <AvatarImage src={selectedProduct.seller.avatar} />
                  <AvatarFallback className="bg-neon-cyan/20 text-neon-cyan text-xl">
                    {selectedProduct.seller.name[0]}
                  </AvatarFallback>
                </Avatar>
                {selectedProduct.status === 'online' && (
                  <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-neon-green border-3 border-background shadow-lg shadow-neon-green/50" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-lg">{selectedProduct.seller.name}</span>
                  {selectedProduct.seller.verified && (
                    <Badge className="bg-neon-cyan/20 text-neon-cyan border-0 text-xs">
                      <Shield className="w-3 h-3 mr-1" /> Проверенный
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                  <span>На сайте с {new Date(selectedProduct.seller.memberSince).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long' })}</span>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <StarRating rating={selectedProduct.seller.rating} size="md" />
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <ShoppingCart className="w-4 h-4" />
                    <span>{selectedProduct.seller.totalSales} продаж</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Reviews */}
          <motion.div 
            className="glass-card rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Отзывы</h2>
              <Badge variant="outline" className="border-neon-cyan/30">
                {selectedProduct.reviews} отзывов
              </Badge>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 rounded-xl bg-white/5">
                <div className="text-2xl font-bold text-neon-cyan">{selectedProduct.rating}</div>
                <div className="text-xs text-muted-foreground">Средний рейтинг</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5">
                <div className="text-2xl font-bold text-neon-green">{selectedProduct.reviews}</div>
                <div className="text-xs text-muted-foreground">Отзывов</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5">
                <div className="text-2xl font-bold text-neon-magenta">{selectedProduct.sales}</div>
                <div className="text-xs text-muted-foreground">Продаж</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5">
                <div className="text-2xl font-bold text-neon-orange">24/7</div>
                <div className="text-xs text-muted-foreground">Поддержка</div>
              </div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-neon-magenta/20 text-neon-magenta">П{i}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm">Покупатель{i}</div>
                      <div className="text-xs text-muted-foreground">{i} дн. назад</div>
                    </div>
                    <StarRating rating={5} size="sm" />
                  </div>
                  <p className="text-sm text-muted-foreground">Отличный продавец! Быстро и качественно выполнил заказ. Рекомендую!</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column - Purchase Panel */}
        <div className="space-y-4">
          <motion.div 
            className="glass-card rounded-2xl p-6 sticky top-20"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-xl font-bold mb-4 leading-tight">{selectedProduct.title}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <StarRating rating={selectedProduct.rating} size="md" />
              <span className="text-sm text-muted-foreground">({selectedProduct.reviews} отзывов)</span>
            </div>

            {/* Server Selection */}
            <div className="mb-6">
              <label className="text-sm text-muted-foreground mb-2 block">Сервер</label>
              <div className="grid grid-cols-2 gap-2">
                {servers.map((server) => (
                  <button
                    key={server}
                    onClick={() => setSelectedServer(server)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      (selectedServer || selectedProduct.server) === server
                        ? 'bg-neon-cyan/20 border border-neon-cyan text-neon-cyan'
                        : 'bg-white/5 border border-white/10 text-muted-foreground hover:border-white/20'
                    }`}
                  >
                    {server}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <label className="text-sm text-muted-foreground mb-2 block">Количество</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  -
                </button>
                <span className="flex-1 text-center text-lg font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-neon-green">
                  {(selectedProduct.price * quantity).toLocaleString()}₽
                </span>
                {selectedProduct.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    {(selectedProduct.originalPrice * quantity).toLocaleString()}₽
                  </span>
                )}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Ваш баланс: <span className="text-neon-cyan">{user.balance.toLocaleString()}₽</span>
              </div>
            </div>

            {/* Buy Button */}
            <motion.button
              className="w-full cyber-btn text-lg py-4 mb-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ShoppingCart className="w-5 h-5 mr-2 inline" />
              Купить сейчас
            </motion.button>

            <Button variant="outline" className="w-full border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10">
              <MessageCircle className="w-4 h-4 mr-2" />
              Написать продавцу
            </Button>

            {/* Guarantees */}
            <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Shield className="w-5 h-5 text-neon-green" />
                <span className="text-muted-foreground">Гарантия возврата средств</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-5 h-5 text-neon-cyan" />
                <span className="text-muted-foreground">Среднее время: 2-4 часа</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Award className="w-5 h-5 text-neon-magenta" />
                <span className="text-muted-foreground">Проверенный продавец</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Dashboard Page Component
const DashboardPage = () => {
  const { orders, user } = useStore();

  const statsData = [
    { name: 'Продажи', value: '124,500₽', change: '+12.5%', positive: true, icon: DollarSign },
    { name: 'Заказы', value: '47', change: '+8', positive: true, icon: Package },
    { name: 'Покупатели', value: '32', change: '+3', positive: true, icon: Users },
    { name: 'Рейтинг', value: '4.9', change: '+0.2', positive: true, icon: Star },
  ];

  const chartData = [
    { name: 'Янв', value: 4000, value2: 2400 },
    { name: 'Фев', value: 3000, value2: 1398 },
    { name: 'Мар', value: 5000, value2: 3800 },
    { name: 'Апр', value: 2780, value2: 3908 },
    { name: 'Май', value: 1890, value2: 4800 },
    { name: 'Июн', value: 2390, value2: 3800 },
    { name: 'Июл', value: 3490, value2: 4300 },
  ];

  const statusColors: Record<string, string> = {
    completed: 'bg-neon-green/20 text-neon-green border-neon-green/30',
    in_progress: 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30',
    pending: 'bg-neon-orange/20 text-neon-orange border-neon-orange/30',
    refunded: 'bg-neon-red/20 text-neon-red border-neon-red/30',
  };

  const statusLabels: Record<string, string> = {
    completed: 'Выполнен',
    in_progress: 'В процессе',
    pending: 'Ожидание',
    refunded: 'Возврат',
  };

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold mb-2">Личный кабинет</h1>
        <p className="text-muted-foreground">Добро пожаловать, {user.name}!</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsData.map((stat, i) => (
          <motion.div
            key={stat.name}
            className="glass-card rounded-xl p-4 lg:p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-cyan/20 to-neon-magenta/20 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-neon-cyan" />
              </div>
              <div className={`flex items-center gap-1 text-xs ${stat.positive ? 'text-neon-green' : 'text-neon-red'}`}>
                {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.name}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart */}
        <motion.div 
          className="lg:col-span-2 glass-card rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-bold mb-4">Статистика продаж</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--neon-cyan)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--neon-cyan)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorValue2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--neon-magenta)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--neon-magenta)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#8888aa" fontSize={12} />
              <YAxis stroke="#8888aa" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(18, 18, 28, 0.95)', 
                  border: '1px solid rgba(0, 243, 255, 0.2)',
                  borderRadius: '8px',
                  boxShadow: '0 0 20px rgba(0, 243, 255, 0.1)'
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="value" stroke="var(--neon-cyan)" fillOpacity={1} fill="url(#colorValue)" />
              <Area type="monotone" dataKey="value2" stroke="var(--neon-magenta)" fillOpacity={1} fill="url(#colorValue2)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top Products */}
        <motion.div 
          className="glass-card rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-lg font-bold mb-4">Популярные услуги</h2>
          <div className="space-y-3">
            {mockProducts.slice(0, 4).map((product, i) => (
              <div key={product.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-cyan/20 to-neon-magenta/20 flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{product.title}</div>
                  <div className="text-xs text-muted-foreground">{product.sales} продаж</div>
                </div>
                <div className="text-neon-green font-semibold">{product.price}₽</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div 
        className="glass-card rounded-xl p-6 mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Последние заказы</h2>
          <Button variant="ghost" size="sm" className="text-neon-cyan hover:text-neon-cyan hover:bg-neon-cyan/10">
            Все заказы <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-muted-foreground border-b border-white/10">
                <th className="pb-3 font-medium">Заказ</th>
                <th className="pb-3 font-medium">Продавец</th>
                <th className="pb-3 font-medium">Дата</th>
                <th className="pb-3 font-medium">Сумма</th>
                <th className="pb-3 font-medium">Статус</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="text-lg">{mockGames.find(g => g.id === order.product.gameId)?.icon}</div>
                      <div>
                        <div className="font-medium text-sm">{order.product.title}</div>
                        <div className="text-xs text-muted-foreground">#{order.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={order.product.seller.avatar} />
                        <AvatarFallback className="bg-neon-cyan/20 text-neon-cyan text-xs">
                          {order.product.seller.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{order.product.seller.name}</span>
                    </div>
                  </td>
                  <td className="py-4 text-sm text-muted-foreground">
                    {new Date(order.date).toLocaleDateString('ru-RU')}
                  </td>
                  <td className="py-4 font-semibold text-neon-green">{order.amount.toLocaleString()}₽</td>
                  <td className="py-4">
                    <Badge className={statusColors[order.status]}>
                      {statusLabels[order.status]}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

// Orders Page Component
const OrdersPage = () => {
  const { orders } = useStore();
  const [activeTab, setActiveTab] = useState('all');

  const statusColors: Record<string, string> = {
    completed: 'bg-neon-green/20 text-neon-green border-neon-green/30',
    in_progress: 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30',
    pending: 'bg-neon-orange/20 text-neon-orange border-neon-orange/30',
    refunded: 'bg-neon-red/20 text-neon-red border-neon-red/30',
  };

  const statusIcons: Record<string, typeof CheckCircle> = {
    completed: CheckCircle,
    in_progress: Clock,
    pending: AlertCircle,
    refunded: XCircle,
  };

  const statusLabels: Record<string, string> = {
    completed: 'Выполнен',
    in_progress: 'В процессе',
    pending: 'Ожидание',
    refunded: 'Возврат',
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    return order.status === activeTab;
  });

  return (
    <div className="p-4 lg:p-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold mb-2">Мои заказы</h1>
        <p className="text-muted-foreground">История ваших покупок и продаж</p>
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
        <TabsList className="glass-card p-1">
          <TabsTrigger value="all" className="data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-neon-cyan">
            Все
          </TabsTrigger>
          <TabsTrigger value="in_progress" className="data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-neon-cyan">
            В процессе
          </TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-neon-cyan">
            Выполнены
          </TabsTrigger>
          <TabsTrigger value="refunded" className="data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-neon-cyan">
            Возвраты
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Orders List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredOrders.map((order, i) => {
            const StatusIcon = statusIcons[order.status];
            return (
              <motion.div
                key={order.id}
                className="glass-card rounded-xl p-4 lg:p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Product Info */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-neon-cyan/10 to-neon-magenta/10 flex items-center justify-center text-3xl">
                      {mockGames.find(g => g.id === order.product.gameId)?.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{order.product.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>#{order.id}</span>
                        <span>•</span>
                        <span>{new Date(order.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Seller */}
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 border border-neon-cyan/30">
                      <AvatarImage src={order.product.seller.avatar} />
                      <AvatarFallback className="bg-neon-cyan/20 text-neon-cyan">
                        {order.product.seller.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm">{order.product.seller.name}</div>
                      <div className="text-xs text-muted-foreground">Продавец</div>
                    </div>
                  </div>

                  {/* Status & Price */}
                  <div className="flex items-center justify-between lg:justify-end gap-4">
                    <Badge className={`${statusColors[order.status]} flex items-center gap-1`}>
                      <StatusIcon className="w-3 h-3" />
                      {statusLabels[order.status]}
                    </Badge>
                    <div className="text-right">
                      <div className="text-lg font-bold text-neon-green">{order.amount.toLocaleString()}₽</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-muted-foreground">Нет заказов в этой категории</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Balance Page Component
const BalancePage = () => {
  const { user } = useStore();
  const [activeCurrency, setActiveCurrency] = useState('rub');

  const transactions = [
    { id: 1, type: 'deposit', amount: 5000, date: '2024-01-15', status: 'completed', description: 'Пополнение баланса' },
    { id: 2, type: 'purchase', amount: -282.59, date: '2024-01-14', status: 'completed', description: 'Покупка: Стабильный 4К+ DN' },
    { id: 3, type: 'sale', amount: 890, date: '2024-01-13', status: 'completed', description: 'Продажа: Elite Prime Account' },
    { id: 4, type: 'withdrawal', amount: -2000, date: '2024-01-10', status: 'pending', description: 'Вывод средств' },
    { id: 5, type: 'refund', amount: 450, date: '2024-01-08', status: 'completed', description: 'Возврат: GTA$ 100M' },
  ];

  const typeColors: Record<string, string> = {
    deposit: 'text-neon-green',
    purchase: 'text-neon-red',
    sale: 'text-neon-cyan',
    withdrawal: 'text-neon-orange',
    refund: 'text-neon-magenta',
  };

  const typeIcons: Record<string, typeof ArrowUpRight> = {
    deposit: ArrowDownRight,
    purchase: ArrowUpRight,
    sale: ArrowDownRight,
    withdrawal: ArrowUpRight,
    refund: ArrowDownRight,
  };

  return (
    <div className="p-4 lg:p-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold mb-2">Баланс и финансы</h1>
        <p className="text-muted-foreground">Управление средствами и история транзакций</p>
      </motion.div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { currency: '₽', name: 'Рубли', balance: user.balance, active: activeCurrency === 'rub' },
          { currency: '$', name: 'Доллары', balance: 156.78, active: activeCurrency === 'usd' },
          { currency: '€', name: 'Евро', balance: 143.21, active: activeCurrency === 'eur' },
        ].map((item, i) => (
          <motion.div
            key={item.name}
            className={`glass-card rounded-xl p-6 cursor-pointer transition-all ${
              item.active ? 'border-neon-cyan neon-glow-cyan' : ''
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => setActiveCurrency(item.currency === '₽' ? 'rub' : item.currency === '$' ? 'usd' : 'eur')}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-muted-foreground">{item.name}</span>
              <span className="text-2xl">{item.currency}</span>
            </div>
            <div className="text-3xl font-bold text-neon-green">
              {item.balance.toLocaleString()}{item.currency}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-4 mb-6">
        <Button className="cyber-btn">
          <Wallet className="w-4 h-4 mr-2" />
          Пополнить
        </Button>
        <Button variant="outline" className="border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10">
          Вывести
        </Button>
      </div>

      {/* Transactions */}
      <motion.div 
        className="glass-card rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-lg font-bold mb-4">История транзакций</h2>
        <div className="space-y-3">
          {transactions.map((tx, i) => {
            const TypeIcon = typeIcons[tx.type];
            return (
              <motion.div
                key={tx.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  tx.amount > 0 ? 'bg-neon-green/20' : 'bg-neon-red/20'
                }`}>
                  <TypeIcon className={`w-5 h-5 ${typeColors[tx.type]}`} />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{tx.description}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(tx.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${tx.amount > 0 ? 'text-neon-green' : 'text-neon-red'}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}₽
                  </div>
                  <Badge variant="outline" className={`text-xs ${tx.status === 'completed' ? 'border-neon-green/30 text-neon-green' : 'border-neon-orange/30 text-neon-orange'}`}>
                    {tx.status === 'completed' ? 'Завершено' : 'В обработке'}
                  </Badge>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

// Chat Widget Component
const ChatWidget = () => {
  const { chatOpen, toggleChat, conversations, messages, activeConversation, setActiveConversation, sendMessage } = useStore();
  const [messageInput, setMessageInput] = useState('');

  const handleSend = () => {
    if (messageInput.trim()) {
      sendMessage(messageInput);
      setMessageInput('');
    }
  };

  return (
    <AnimatePresence>
      {chatOpen && (
        <motion.div
          className="fixed bottom-4 right-4 w-96 h-[500px] z-50 glass-card rounded-2xl overflow-hidden shadow-2xl flex flex-col"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-5 h-5 text-neon-cyan" />
              <span className="font-semibold">Сообщения</span>
              <Badge className="bg-neon-green/20 text-neon-green border-0">2</Badge>
            </div>
            <button onClick={toggleChat} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Conversations List or Chat */}
          {!activeConversation ? (
            <ScrollArea className="flex-1">
              <div className="p-2">
                {conversations.map((conv) => (
                  <motion.button
                    key={conv.id}
                    onClick={() => setActiveConversation(conv.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-left"
                    whileHover={{ x: 4 }}
                  >
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={conv.participantAvatar} />
                        <AvatarFallback className="bg-neon-cyan/20 text-neon-cyan">
                          {conv.participantName[0]}
                        </AvatarFallback>
                      </Avatar>
                      {conv.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-neon-green border-2 border-background" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{conv.participantName}</span>
                        <span className="text-xs text-muted-foreground">{conv.lastMessageTime}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <Badge className="bg-neon-magenta text-white border-0 text-xs">
                        {conv.unreadCount}
                      </Badge>
                    )}
                  </motion.button>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <>
              {/* Chat Header */}
              <div className="flex items-center gap-3 p-3 border-b border-white/10">
                <button
                  onClick={() => setActiveConversation(null)}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 rotate-180" />
                </button>
                <Avatar className="w-8 h-8">
                  <AvatarImage src={conversations[0]?.participantAvatar} />
                  <AvatarFallback className="bg-neon-cyan/20 text-neon-cyan text-sm">
                    {conversations[0]?.participantName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-sm">{conversations[0]?.participantName}</div>
                  <div className="text-xs text-neon-green">Онлайн</div>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-2xl ${
                          msg.isOwn
                            ? 'bg-gradient-to-r from-neon-magenta to-neon-purple text-white rounded-br-md'
                            : 'bg-white/10 text-white rounded-bl-md'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <span className="text-xs opacity-60 mt-1 block">{msg.timestamp}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-3 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-muted-foreground hover:text-white">
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-muted-foreground hover:text-white">
                    <Smile className="w-4 h-4" />
                  </button>
                  <Input
                    placeholder="Введите сообщение..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    className="flex-1 bg-white/5 border-white/10 focus:border-neon-cyan"
                  />
                  <button
                    onClick={handleSend}
                    className="p-2 bg-neon-cyan/20 hover:bg-neon-cyan/30 rounded-lg transition-colors text-neon-cyan"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Main App Component
export default function Home() {
  const { currentPage, selectedProduct } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const renderPage = () => {
    if (selectedProduct && currentPage === 'product') {
      return <ProductDetailPage />;
    }

    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'orders':
        return <OrdersPage />;
      case 'balance':
        return <BalancePage />;
      default:
        return <CatalogPage />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground cyber-grid">
      <ParticleBackground />
      
      <Header />
      <Sidebar />

      <main className={`ml-64 pt-16 transition-all duration-300 ${useStore.getState().sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage + (selectedProduct?.id || '')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <ChatWidget />
    </div>
  );
}
