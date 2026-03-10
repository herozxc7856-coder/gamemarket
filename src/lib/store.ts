// src/lib/store.ts - Production version (NO MOCK DATA)
// All data comes from real API calls

import { create } from 'zustand';

// Types
export interface Game {
  id: string;
  name: string;
  icon: string;
  category: string;
  productCount?: number;
  trending?: boolean;
}

export interface Seller {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  totalSales: number;
  verified: boolean;
}

export interface Product {
  id: string;
  gameId: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  seller: Seller;
  server: string;
  rating: number;
  reviews: number;
  sales: number;
  status: 'online' | 'offline';
  images: string[];
  tags: string[];
  commissionRate?: number;
  commissionAmount?: number;
  sellerRevenue?: number;
  createdAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  balance: number;
  verified: boolean;
  rating: number;
}

export interface Review {
  id: string;
  productId: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
  };
  rating: number;
  content: string;
  createdAt: string;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
  createdAt: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: Array<{
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
  }>;
  lastMessage?: Message;
  updatedAt: string;
}

// Store Interface
interface AppState {
  // User
  user: User | null;
  setUser: (user: User | null) => void;

  // Data
  games: Game[];
  products: Product[];
  reviews: Review[];
  conversations: Conversation[];
  messages: Message[];

  // Loading states
  loading: boolean;
  error: string | null;

  // Actions
  fetchGames: () => Promise<void>;
  fetchProducts: (filters?: { gameId?: string; search?: string; server?: string }) => Promise<void>;
  fetchReviews: (productId: string) => Promise<void>;
  fetchConversations: (userId: string) => Promise<void>;
  fetchMessages: (conversationId: string, userId: string) => Promise<void>;
  
  // Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedGame: string | null;
  setSelectedGame: (gameId: string | null) => void;

  // UI
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

// API helpers
const api = {
  async get<T>(url: string): Promise<T> {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  },
  async post<T>(url: string, data: any): Promise<T> {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `API error: ${res.status}`);
    }
    return res.json();
  }
};

export const useStore = create<AppState>((set, get) => ({
  // Initial state
  user: null,
  games: [],
  products: [],
  reviews: [],
  conversations: [],
  messages: [],
  loading: false,
  error: null,
  searchQuery: '',
  selectedGame: null,
  currentPage: 'catalog',

  // User actions
  setUser: (user) => set({ user }),

  // Fetch games
  fetchGames: async () => {
    try {
      set({ loading: true, error: null });
      const { games } = await api.get<{ games: Game[] }>('/api/games');
      set({ games, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
      // Fallback: empty array instead of mock data
      set({ games: [], loading: false });
    }
  },

  // Fetch products with filters
  fetchProducts: async (filters = {}) => {
    try {
      set({ loading: true, error: null });
      const params = new URLSearchParams();
      if (filters.gameId) params.set('gameId', filters.gameId);
      if (filters.search) params.set('search', filters.search);
      if (filters.server) params.set('server', filters.server);
      
      const { products } = await api.get<{ products: Product[] }>(`/api/products?${params}`);
      set({ products, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
      set({ products: [], loading: false });
    }
  },

  // Fetch reviews for a product
  fetchReviews: async (productId: string) => {
    try {
      const { reviews, averageRating } = await api.get<{ 
        reviews: Review[]; 
        averageRating: number;
        total: number;
      }>(`/api/reviews?productId=${productId}`);
      set({ reviews });
      return { reviews, averageRating };
    } catch (err: any) {
      set({ error: err.message });
      return { reviews: [], averageRating: 0 };
    }
  },

  // Fetch user conversations
  fetchConversations: async (userId: string) => {
    try {
      const { conversations } = await api.get<{ conversations: Conversation[] }>(
        `/api/chat?userId=${userId}`
      );
      set({ conversations });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  // Fetch messages for a conversation
  fetchMessages: async (conversationId: string, userId: string) => {
    try {
      const { messages } = await api.get<{ messages: Message[] }>(
        `/api/chat/${conversationId}?userId=${userId}`
      );
      set({ messages });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  // Filters
  setSearchQuery: (query) => {
    set({ searchQuery: query });
    // Auto-fetch with new search
    get().fetchProducts({ search: query, gameId: get().selectedGame || undefined });
  },
  setSelectedGame: (gameId) => {
    set({ selectedGame: gameId });
    get().fetchProducts({ gameId, search: get().searchQuery });
  },

  // UI
  setCurrentPage: (page) => set({ currentPage: page }),
}));

// Export API functions for direct use
export const API = {
  createProduct: (data: any) => api.post('/api/products', data),
  createReview: (data: any) => api.post('/api/reviews', data),
  sendMessage: (data: any) => api.post('/api/chat', data),
  uploadImage: (formData: FormData) => 
    fetch('/api/upload', { method: 'POST', body: formData }).then(r => r.json()),
};
