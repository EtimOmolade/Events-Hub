import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  shortDescription: string;
  price: number;
  priceType: 'fixed' | 'starting' | 'hourly';
  rating: number;
  reviewCount: number;
  images: string[];
  vendorId: string;
  vendorName: string;
  location: string;
  features: string[];
  available: boolean;
}

export interface Vendor {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  avatar: string;
  portfolio: string[];
  rating: number;
  reviewCount: number;
  location: string;
  verified: boolean;
}

export interface CartItem {
  service: Service;
  quantity: number;
  eventDate?: string;
  eventType?: string;
  notes?: string;
}

export interface Booking {
  id: string;
  services: CartItem[];
  eventType: string;
  eventDate: string;
  venue: string;
  budget: number;
  guestCount: number;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  totalAmount: number;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface SavedPlan {
  id: string;
  name: string;
  eventType: string;
  theme: string;
  colorPalette: string;
  guestSize: string;
  venueType: string;
  budget: string;
  eventDate?: string;
  createdAt: string;
  packages: any[];
}

export interface AIRecommendation {
  eventType?: string;
  theme?: string;
  colorPalette?: string;
  guestSize?: string;
  venueType?: string;
  budget?: string;
}

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;

  // Admin Auth
  isAdminAuthenticated: boolean;
  adminLogin: () => void;
  adminLogout: () => void;

  // Cart
  cart: CartItem[];
  addToCart: (service: Service, quantity?: number) => void;
  removeFromCart: (serviceId: string) => void;
  updateCartQuantity: (serviceId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;

  // Wishlist
  wishlist: Service[];
  addToWishlist: (service: Service) => void;
  removeFromWishlist: (serviceId: string) => void;
  isInWishlist: (serviceId: string) => boolean;

  // Bookings
  bookings: Booking[];
  addBooking: (booking: Booking) => Promise<void>;
  updateBookingStatus: (bookingId: string, status: Booking['status']) => void;

  // Saved Plans
  savedPlans: SavedPlan[];
  addSavedPlan: (plan: SavedPlan) => void;
  removeSavedPlan: (planId: string) => void;

  // AI Recommendations
  aiRecommendation: AIRecommendation | null;
  setAIRecommendation: (rec: AIRecommendation | null) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;

  // Recent searches
  recentSearches: string[];
  addRecentSearch: (term: string) => void;

  // Recently viewed
  recentlyViewed: Service[];
  addRecentlyViewed: (service: Service) => void;

  // Sync methods
  hydrateFromDB: (userId: string) => Promise<void>;
  saveToDB: (key: 'cart' | 'wishlist' | 'recentSearches' | 'recentlyViewed', data: any) => Promise<void>;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false, cart: [], bookings: [] }),

      // Admin Auth
      isAdminAuthenticated: false,
      adminLogin: () => set({ isAdminAuthenticated: true }),
      adminLogout: () => set({ isAdminAuthenticated: false }),

      // Cart
      cart: [],
      addToCart: (service, quantity = 1) => {
        console.log('Store: addToCart called with service:', service.name, 'quantity:', quantity);
        const { cart } = get();
        console.log('Store: Current cart length:', cart.length);
        const existing = cart.find((item) => item.service.id === service.id);
        if (existing) {
          console.log('Store: Service already in cart, updating quantity');
          set({
            cart: cart.map((item) =>
              item.service.id === service.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          console.log('Store: Adding new service to cart');
          set({ cart: [...cart, { service, quantity }] });
        }

        // Sync to DB
        const { user, saveToDB, cart: newCart } = get();
        console.log('Store: New cart length:', newCart.length);
        if (user) saveToDB('cart', newCart);
      },
      removeFromCart: (serviceId) => {
        set({ cart: get().cart.filter((item) => item.service.id !== serviceId) });
        const { user, saveToDB, cart } = get();
        if (user) saveToDB('cart', cart);
      },
      updateCartQuantity: (serviceId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(serviceId);
          return;
        }
        set({
          cart: get().cart.map((item) =>
            item.service.id === serviceId ? { ...item, quantity } : item
          ),
        });
        const { user, saveToDB, cart } = get();
        if (user) saveToDB('cart', cart);
      },
      clearCart: () => {
        set({ cart: [] });
        const { user, saveToDB } = get();
        if (user) saveToDB('cart', []);
      },
      getCartTotal: () => {
        return get().cart.reduce(
          (total, item) => total + item.service.price * item.quantity,
          0
        );
      },

      // Wishlist
      wishlist: [],
      addToWishlist: (service) => {
        const { wishlist } = get();
        if (!wishlist.find((s) => s.id === service.id)) {
          const newData = [...wishlist, service];
          set({ wishlist: newData });
          const { user, saveToDB } = get();
          if (user) saveToDB('wishlist', newData);
        }
      },
      removeFromWishlist: (serviceId) => {
        const newData = get().wishlist.filter((s) => s.id !== serviceId);
        set({ wishlist: newData });
        const { user, saveToDB } = get();
        if (user) saveToDB('wishlist', newData);
      },
      isInWishlist: (serviceId) => {
        return get().wishlist.some((s) => s.id === serviceId);
      },

      // Bookings
      bookings: [],
      addBooking: async (booking) => {
        set({ bookings: [...get().bookings, booking] });

        // Only persist to Supabase if the booking doesn't already have an ID
        // (If it has an ID, it was already created in Checkout.tsx)
        const { user } = get();
        if (user && !booking.id) {
          const { error } = await supabase.from('bookings').insert({
            user_id: user.id,
            event_type: booking.eventType,
            event_date: booking.eventDate,
            venue: booking.venue,
            budget: booking.budget,
            guest_count: booking.guestCount,
            status: booking.status,
            total_amount: booking.totalAmount,
            customer_name: booking.customerName,
            customer_email: booking.customerEmail,
            customer_phone: booking.customerPhone,
            created_at: booking.createdAt
          });

          if (error) {
            console.error('Failed to save booking:', error);
            toast.error(`Failed to save booking: ${error.message}`);
          }
        }
      },
      updateBookingStatus: (bookingId, status) => {
        set({
          bookings: get().bookings.map((b) =>
            b.id === bookingId ? { ...b, status } : b
          ),
        });
      },

      // Saved Plans
      savedPlans: [],
      addSavedPlan: (plan) => {
        set({ savedPlans: [...get().savedPlans, plan] });
      },
      removeSavedPlan: (planId) => {
        set({ savedPlans: get().savedPlans.filter((p) => p.id !== planId) });
      },

      // AI Recommendations
      aiRecommendation: null,
      setAIRecommendation: (rec) => set({ aiRecommendation: rec }),

      // Search
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      selectedCategory: null,
      setSelectedCategory: (category) => set({ selectedCategory: category }),

      // Recent searches
      recentSearches: [],
      addRecentSearch: (term) => {
        const { recentSearches, user, saveToDB } = get();
        const filtered = recentSearches.filter(s => s.toLowerCase() !== term.toLowerCase());
        const newData = [term, ...filtered].slice(0, 10);
        set({ recentSearches: newData });
        if (user) saveToDB('recentSearches', newData);
      },

      // Recently viewed
      recentlyViewed: [],
      addRecentlyViewed: (service) => {
        const { recentlyViewed, user, saveToDB } = get();
        const filtered = recentlyViewed.filter(s => s.id !== service.id);
        const newData = [service, ...filtered].slice(0, 10);
        set({ recentlyViewed: newData });
        if (user) saveToDB('recentlyViewed', newData);
      },

      // Persistence Logic (SQL Table Strategy)
      hydrateFromDB: async (userId: string) => {
        if (!userId) return;

        const { data, error } = await (supabase
          .from('user_storage') as any)
          .select('*')
          .eq('user_id', userId)
          .single();

        if (data) {
          set({
            cart: data.cart_data || [],
            wishlist: data.wishlist_data || [],
            recentlyViewed: data.recently_viewed_data || [],
            recentSearches: data.recent_searches_data || [],
          });
        } else if (error && error.code === 'PGRST116') {
          // Row missing, create it
          await (supabase.from('user_storage') as any).insert({ user_id: userId });
        }

        // Also Load Bookings
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select('*')
          .eq('user_id', userId);

        if (bookingsData) {
          const mappedBookings: Booking[] = bookingsData.map((b: any) => ({
            id: b.id,
            services: [], // Note: Need to fetch booking items if we want full detail here, keeping light for now.
            eventType: b.event_type,
            eventDate: b.event_date,
            venue: b.venue,
            budget: b.budget,
            guestCount: b.guest_count,
            status: b.status,
            totalAmount: b.total_amount,
            createdAt: b.created_at,
            customerName: b.customer_name,
            customerEmail: b.customer_email,
            customerPhone: b.customer_phone
          }));
          set({ bookings: mappedBookings });
        }
      },

      saveToDB: async (key, data) => {
        const { user } = get();
        if (!user) return;

        // Map store keys to DB columns
        const columnMap: Record<string, string> = {
          'cart': 'cart_data',
          'wishlist': 'wishlist_data',
          'recentlyViewed': 'recently_viewed_data',
          'recentSearches': 'recent_searches_data'
        };

        const dbColumn = columnMap[key];
        if (!dbColumn) return;

        // Use upsert to ensure row exists and data is saved
        (supabase
          .from('user_storage') as any)
          .upsert({
            user_id: user.id,
            [dbColumn]: data,
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id' })
          .then(({ error }: any) => {
            if (error) {
              console.error(`Failed to save ${key}:`, error);
              toast.error(`Sync failed: ${error.message}`);
            }
          });
      },
    }),
    {
      name: 'events-hub-storage',
      partialize: (state) => ({
        // Keep local persist for Guest users / offline capability
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isAdminAuthenticated: state.isAdminAuthenticated,
        cart: state.cart,
        wishlist: state.wishlist,
        bookings: state.bookings,
        savedPlans: state.savedPlans,
        recentSearches: state.recentSearches,
        recentlyViewed: state.recentlyViewed,
      }),
    }
  )
);
