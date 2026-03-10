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
import { useStore, type Product, type Game } from '@/lib/store';
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
            <span className="font-semibold text-neon-green">{user?.balance.toLocaleString() || 0}₽</span>
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
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-neon-cyan/20 text-neon-cyan">
                  {user?.name?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-neon-green border-2 border-background" />
            </div>
            <span className="hidden lg:block font-medium">{user?.name || 'Гость'}</span>
            <ChevronDown className="w-4 h-4 hidden lg:block text-muted-foreground" />
          </motion.div>
        </div>
      </div>
    </header>
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
        <div className="text-5xl">🎮</div>
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
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating) 
                    ? 'text-neon-cyan fill-neon-cyan/30' 
                    : 'text-muted-foreground/30'
                }`}
              />
            ))}
            <span className="ml-1 text-xs text-muted-foreground">{product.rating.toFixed(1)}</span>
          </div>
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
  const { products, loading, error, fetchProducts, selectedGame, searchQuery } = useStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchProducts({ gameId: selectedGame || undefined, search: searchQuery });
  }, [selectedGame, searchQuery]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Загрузка товаров...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-neon-red mx-auto mb-4" />
          <p className="text-neon-red mb-4">{error}</p>
          <Button onClick={() => fetchProducts()} className="cyber-btn">
            Попробовать снова
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      {/* Banner */}
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
              ДОБРО ПОЖАЛОВАТЬ
            </h2>
            <p className="text-muted-foreground text-sm lg:text-base mb-4">
              Лучший маркетплейс игровых товаров
            </p>
            <Button className="cyber-btn">
              <Zap className="w-4 h-4 mr-2" />
              Начать покупки
            </Button>
          </div>
          <div className="hidden lg:block">
            <div className="text-8xl opacity-20">🎮</div>
          </div>
        </div>
      </motion.div>

      {/* Products Grid */}
      <div className="mb-6 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {products.length} товаров
        </span>
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

      <motion.div 
        className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}
        layout
      >
        <AnimatePresence mode="popLayout">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </AnimatePresence>
      </motion.div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
          <p className="text-muted-foreground">Товары пока отсутствуют</p>
          <Button className="mt-4 cyber-btn" onClick={() => window.location.href = '/sell'}>
            Создать первый товар
          </Button>
        </div>
      )}
    </div>
  );
};

// Main App Component
export default function Home() {
  const { currentPage, fetchGames } = useStore();

  useEffect(() => {
    fetchGames();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-16">
        <CatalogPage />
      </main>
    </div>
  );
}
