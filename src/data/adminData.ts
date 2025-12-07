export interface DiscountCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrder?: number;
  maxUses?: number;
  usedCount: number;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
}

export interface AdminVendor {
  id: string;
  name: string;
  email: string;
  specialty: string;
  status: 'pending' | 'approved' | 'suspended';
  revenue: number;
  bookings: number;
  joinedAt: string;
}

export interface AnalyticsData {
  date: string;
  bookings: number;
  revenue: number;
}

export const mockDiscountCodes: DiscountCode[] = [
  {
    id: 'dc1',
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    minOrder: 50000,
    maxUses: 100,
    usedCount: 45,
    expiresAt: '2024-12-31',
    isActive: true,
    createdAt: '2024-01-01',
  },
  {
    id: 'dc2',
    code: 'SUMMER2024',
    type: 'percentage',
    value: 15,
    minOrder: 100000,
    maxUses: 50,
    usedCount: 23,
    expiresAt: '2024-08-31',
    isActive: true,
    createdAt: '2024-06-01',
  },
  {
    id: 'dc3',
    code: 'FLAT50K',
    type: 'fixed',
    value: 50000,
    minOrder: 500000,
    maxUses: 20,
    usedCount: 8,
    isActive: true,
    createdAt: '2024-03-15',
  },
];

export const mockAdminVendors: AdminVendor[] = [
  {
    id: 'v1',
    name: 'Elegance Events',
    email: 'hello@eleganceevents.com',
    specialty: 'Wedding Planning',
    status: 'approved',
    revenue: 15000000,
    bookings: 89,
    joinedAt: '2023-01-15',
  },
  {
    id: 'v2',
    name: 'Divine Catering Co.',
    email: 'info@divinecatering.com',
    specialty: 'Catering Services',
    status: 'approved',
    revenue: 8500000,
    bookings: 145,
    joinedAt: '2023-03-22',
  },
  {
    id: 'v3',
    name: 'Pixel Perfect Studios',
    email: 'booking@pixelperfect.com',
    specialty: 'Photography & Video',
    status: 'approved',
    revenue: 12000000,
    bookings: 234,
    joinedAt: '2022-11-10',
  },
  {
    id: 'v4',
    name: 'Royal Décor',
    email: 'contact@royaldecor.com',
    specialty: 'Event Decorations',
    status: 'pending',
    revenue: 0,
    bookings: 0,
    joinedAt: '2024-06-01',
  },
  {
    id: 'v5',
    name: 'SoundWave Entertainment',
    email: 'gigs@soundwave.com',
    specialty: 'DJ & Sound',
    status: 'suspended',
    revenue: 2500000,
    bookings: 67,
    joinedAt: '2023-08-05',
  },
];

export const mockAnalytics: AnalyticsData[] = [
  { date: '2024-06-01', bookings: 12, revenue: 3500000 },
  { date: '2024-06-02', bookings: 8, revenue: 2100000 },
  { date: '2024-06-03', bookings: 15, revenue: 4200000 },
  { date: '2024-06-04', bookings: 10, revenue: 2800000 },
  { date: '2024-06-05', bookings: 18, revenue: 5100000 },
  { date: '2024-06-06', bookings: 22, revenue: 6500000 },
  { date: '2024-06-07', bookings: 14, revenue: 3900000 },
];

export const topCategories = [
  { name: 'Weddings', bookings: 156, percentage: 35 },
  { name: 'Catering', bookings: 134, percentage: 30 },
  { name: 'Photography', bookings: 89, percentage: 20 },
  { name: 'Decorations', bookings: 45, percentage: 10 },
  { name: 'Others', bookings: 22, percentage: 5 },
];

export const validateDiscountCode = (code: string, orderTotal: number): { valid: boolean; discount: number; message: string } => {
  const discountCode = mockDiscountCodes.find(
    dc => dc.code.toLowerCase() === code.toLowerCase() && dc.isActive
  );

  if (!discountCode) {
    return { valid: false, discount: 0, message: 'Invalid discount code' };
  }

  if (discountCode.expiresAt && new Date(discountCode.expiresAt) < new Date()) {
    return { valid: false, discount: 0, message: 'This code has expired' };
  }

  if (discountCode.maxUses && discountCode.usedCount >= discountCode.maxUses) {
    return { valid: false, discount: 0, message: 'This code has reached its usage limit' };
  }

  if (discountCode.minOrder && orderTotal < discountCode.minOrder) {
    return { 
      valid: false, 
      discount: 0, 
      message: `Minimum order of ₦${discountCode.minOrder.toLocaleString()} required` 
    };
  }

  const discount = discountCode.type === 'percentage' 
    ? (orderTotal * discountCode.value) / 100
    : discountCode.value;

  return { 
    valid: true, 
    discount, 
    message: `${discountCode.type === 'percentage' ? `${discountCode.value}%` : `₦${discountCode.value.toLocaleString()}`} discount applied!` 
  };
};
