import { addDays, format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

// Portfolio Categories
export const portfolioCategories = [
  { id: 'all', label: 'All Work' },
  { id: 'decor', label: 'Decorations' },
  { id: 'catering', label: 'Catering' },
  { id: 'lighting', label: 'Lighting' },
  { id: 'photography', label: 'Photography' },
  { id: 'floral', label: 'Floral' },
  { id: 'staging', label: 'Staging' },
];

// Extended Vendor Portfolio Data
export interface PortfolioItem {
  id: string;
  vendorId: string;
  imageUrl: string;
  title: string;
  category: string;
  eventType: string;
  description?: string;
}

export const vendorPortfolios: PortfolioItem[] = [
  // Elegance Events (v1)
  { id: 'p1', vendorId: 'v1', imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800', title: 'Luxury Beach Wedding', category: 'staging', eventType: 'Wedding' },
  { id: 'p2', vendorId: 'v1', imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800', title: 'Garden Ceremony', category: 'decor', eventType: 'Wedding' },
  { id: 'p3', vendorId: 'v1', imageUrl: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800', title: 'Ballroom Reception', category: 'lighting', eventType: 'Wedding' },
  { id: 'p4', vendorId: 'v1', imageUrl: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800', title: 'Corporate Gala', category: 'staging', eventType: 'Corporate' },
  
  // Divine Catering (v2)
  { id: 'p5', vendorId: 'v2', imageUrl: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800', title: 'Wedding Feast', category: 'catering', eventType: 'Wedding' },
  { id: 'p6', vendorId: 'v2', imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800', title: 'Cocktail Spread', category: 'catering', eventType: 'Corporate' },
  { id: 'p7', vendorId: 'v2', imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800', title: 'Gourmet Dinner', category: 'catering', eventType: 'Birthday' },
  { id: 'p8', vendorId: 'v2', imageUrl: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800', title: 'Dessert Table', category: 'catering', eventType: 'Wedding' },
  
  // Pixel Perfect Studios (v3)
  { id: 'p9', vendorId: 'v3', imageUrl: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800', title: 'Wedding Portrait', category: 'photography', eventType: 'Wedding' },
  { id: 'p10', vendorId: 'v3', imageUrl: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800', title: 'Traditional Ceremony', category: 'photography', eventType: 'Wedding' },
  { id: 'p11', vendorId: 'v3', imageUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800', title: 'Event Coverage', category: 'photography', eventType: 'Corporate' },
  { id: 'p12', vendorId: 'v3', imageUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800', title: 'Candid Moments', category: 'photography', eventType: 'Birthday' },
  
  // Royal Décor (v4)
  { id: 'p13', vendorId: 'v4', imageUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800', title: 'Floral Centerpieces', category: 'floral', eventType: 'Wedding' },
  { id: 'p14', vendorId: 'v4', imageUrl: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800', title: 'Rose Arrangements', category: 'floral', eventType: 'Wedding' },
  { id: 'p15', vendorId: 'v4', imageUrl: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800', title: 'Venue Transformation', category: 'decor', eventType: 'Wedding' },
  { id: 'p16', vendorId: 'v4', imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800', title: 'Event Lighting', category: 'lighting', eventType: 'Corporate' },
  { id: 'p17', vendorId: 'v4', imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800', title: 'Gold Theme Setup', category: 'decor', eventType: 'Birthday' },
  
  // SoundWave Entertainment (v5)
  { id: 'p18', vendorId: 'v5', imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800', title: 'Live Performance', category: 'staging', eventType: 'Concert' },
  { id: 'p19', vendorId: 'v5', imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800', title: 'Concert Lighting', category: 'lighting', eventType: 'Concert' },
  { id: 'p20', vendorId: 'v5', imageUrl: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800', title: 'DJ Setup', category: 'staging', eventType: 'Wedding' },
];

// Vendor Availability
export interface AvailabilitySlot {
  date: string; // ISO date string
  status: 'available' | 'booked' | 'tentative';
  eventType?: string;
}

// Generate mock availability for vendors
export function generateVendorAvailability(vendorId: string, month: Date): AvailabilitySlot[] {
  const start = startOfMonth(month);
  const end = endOfMonth(month);
  const days = eachDayOfInterval({ start, end });
  
  // Use vendorId to create consistent "random" bookings
  const seed = parseInt(vendorId.replace('v', ''), 10);
  
  return days.map((day, index) => {
    const dayOfWeek = day.getDay();
    const dateStr = format(day, 'yyyy-MM-dd');
    
    // Weekends have higher booking probability
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const bookingChance = isWeekend ? 0.6 : 0.3;
    
    // Pseudo-random based on date and vendor
    const pseudoRandom = ((index * seed * 7) % 100) / 100;
    
    if (pseudoRandom < bookingChance * 0.6) {
      return { date: dateStr, status: 'booked' as const, eventType: 'Wedding' };
    } else if (pseudoRandom < bookingChance) {
      return { date: dateStr, status: 'tentative' as const };
    }
    return { date: dateStr, status: 'available' as const };
  });
}

// Multi-vendor booking cart
export interface MultiVendorBooking {
  id: string;
  vendorIds: string[];
  eventDate: string;
  eventType: string;
  services: string[];
  status: 'draft' | 'pending' | 'confirmed';
  createdAt: string;
}

// Message types for vendor messaging
export interface VendorMessage {
  id: string;
  vendorId: string;
  senderId: 'user' | 'vendor';
  content: string;
  timestamp: string;
  read: boolean;
}

export interface VendorConversation {
  vendorId: string;
  vendorName: string;
  vendorAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: VendorMessage[];
}

// Sample conversations
export const sampleConversations: VendorConversation[] = [
  {
    vendorId: 'v1',
    vendorName: 'Elegance Events',
    vendorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    lastMessage: 'Great! I\'ll send you the detailed quote by tomorrow.',
    lastMessageTime: '2024-01-15T14:30:00Z',
    unreadCount: 1,
    messages: [
      { id: 'm1', vendorId: 'v1', senderId: 'user', content: 'Hi! I\'m interested in your wedding planning services for a December wedding.', timestamp: '2024-01-15T10:00:00Z', read: true },
      { id: 'm2', vendorId: 'v1', senderId: 'vendor', content: 'Hello! Thank you for reaching out. December is a beautiful month for weddings. How many guests are you expecting?', timestamp: '2024-01-15T10:30:00Z', read: true },
      { id: 'm3', vendorId: 'v1', senderId: 'user', content: 'We\'re planning for about 200 guests. What packages do you offer?', timestamp: '2024-01-15T11:00:00Z', read: true },
      { id: 'm4', vendorId: 'v1', senderId: 'vendor', content: 'Great! I\'ll send you the detailed quote by tomorrow.', timestamp: '2024-01-15T14:30:00Z', read: false },
    ],
  },
  {
    vendorId: 'v2',
    vendorName: 'Divine Catering Co.',
    vendorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    lastMessage: 'We can definitely accommodate that. Would you like a tasting session?',
    lastMessageTime: '2024-01-14T16:00:00Z',
    unreadCount: 0,
    messages: [
      { id: 'm5', vendorId: 'v2', senderId: 'user', content: 'Do you offer vegetarian menu options?', timestamp: '2024-01-14T15:00:00Z', read: true },
      { id: 'm6', vendorId: 'v2', senderId: 'vendor', content: 'We can definitely accommodate that. Would you like a tasting session?', timestamp: '2024-01-14T16:00:00Z', read: true },
    ],
  },
];

export function getVendorPortfolio(vendorId: string): PortfolioItem[] {
  return vendorPortfolios.filter(p => p.vendorId === vendorId);
}

export function getConversation(vendorId: string): VendorConversation | undefined {
  return sampleConversations.find(c => c.vendorId === vendorId);
}
