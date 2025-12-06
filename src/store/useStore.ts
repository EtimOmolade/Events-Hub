import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;

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
  addBooking: (booking: Booking) => void;
  updateBookingStatus: (bookingId: string, status: Booking['status']) => void;

  // Saved Plans
  savedPlans: SavedPlan[];
  addSavedPlan: (plan: SavedPlan) => void;
  removeSavedPlan: (planId: string) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false, cart: [], bookings: [] }),

      // Cart
      cart: [],
      addToCart: (service, quantity = 1) => {
        const { cart } = get();
        const existing = cart.find((item) => item.service.id === service.id);
        if (existing) {
          set({
            cart: cart.map((item) =>
              item.service.id === service.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({ cart: [...cart, { service, quantity }] });
        }
      },
      removeFromCart: (serviceId) => {
        set({ cart: get().cart.filter((item) => item.service.id !== serviceId) });
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
      },
      clearCart: () => set({ cart: [] }),
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
          set({ wishlist: [...wishlist, service] });
        }
      },
      removeFromWishlist: (serviceId) => {
        set({ wishlist: get().wishlist.filter((s) => s.id !== serviceId) });
      },
      isInWishlist: (serviceId) => {
        return get().wishlist.some((s) => s.id === serviceId);
      },

      // Bookings
      bookings: [],
      addBooking: (booking) => {
        set({ bookings: [...get().bookings, booking] });
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

      // Search
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      selectedCategory: null,
      setSelectedCategory: (category) => set({ selectedCategory: category }),
    }),
    {
      name: 'events-hub-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        cart: state.cart,
        wishlist: state.wishlist,
        bookings: state.bookings,
        savedPlans: state.savedPlans,
      }),
    }
  )
);
