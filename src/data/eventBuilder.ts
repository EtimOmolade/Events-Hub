import { Service, Vendor } from '@/store/useStore';
import { services, vendors } from './services';

// Event Themes
export const eventThemes = [
  { id: 'classic-elegance', name: 'Classic Elegance', description: 'Timeless sophistication with refined details', icon: '✨' },
  { id: 'modern-minimalist', name: 'Modern Minimalist', description: 'Clean lines and contemporary aesthetics', icon: '◻️' },
  { id: 'romantic-garden', name: 'Romantic Garden', description: 'Soft florals and natural beauty', icon: '🌸' },
  { id: 'glamorous-luxury', name: 'Glamorous Luxury', description: 'Opulent details and rich textures', icon: '💎' },
  { id: 'rustic-charm', name: 'Rustic Charm', description: 'Natural elements with cozy warmth', icon: '🌿' },
  { id: 'tropical-paradise', name: 'Tropical Paradise', description: 'Vibrant colors and exotic vibes', icon: '🌴' },
  { id: 'cultural-traditional', name: 'Cultural Traditional', description: 'Heritage-inspired celebrations', icon: '🎭' },
  { id: 'fun-playful', name: 'Fun & Playful', description: 'Bright, colorful, and energetic', icon: '🎉' },
];

// Color Palettes
export const colorPalettes = [
  { id: 'gold-ivory', name: 'Gold & Ivory', colors: ['#D4AF37', '#FFFFF0', '#2C2C2C'], primary: '#D4AF37' },
  { id: 'blush-rose', name: 'Blush Rose', colors: ['#E8B4B8', '#F5E1E4', '#8B5A5A'], primary: '#E8B4B8' },
  { id: 'navy-gold', name: 'Navy & Gold', colors: ['#1E3A5F', '#D4AF37', '#FFFFFF'], primary: '#1E3A5F' },
  { id: 'sage-cream', name: 'Sage & Cream', colors: ['#9CAF88', '#F5F5DC', '#3D4F3D'], primary: '#9CAF88' },
  { id: 'burgundy-gold', name: 'Burgundy & Gold', colors: ['#722F37', '#D4AF37', '#F5F5F5'], primary: '#722F37' },
  { id: 'purple-silver', name: 'Purple & Silver', colors: ['#6B4E71', '#C0C0C0', '#2C2C2C'], primary: '#6B4E71' },
  { id: 'coral-teal', name: 'Coral & Teal', colors: ['#FF6F61', '#008080', '#FFFFFF'], primary: '#FF6F61' },
  { id: 'black-white', name: 'Black & White', colors: ['#000000', '#FFFFFF', '#888888'], primary: '#000000' },
];

// Guest Size Ranges
export const guestSizeRanges = [
  { id: 'intimate', label: 'Intimate', range: '1-50', min: 1, max: 50, icon: '👥' },
  { id: 'small', label: 'Small', range: '51-100', min: 51, max: 100, icon: '👥' },
  { id: 'medium', label: 'Medium', range: '101-200', min: 101, max: 200, icon: '👥' },
  { id: 'large', label: 'Large', range: '201-400', min: 201, max: 400, icon: '👥' },
  { id: 'grand', label: 'Grand', range: '400+', min: 400, max: 1000, icon: '👥' },
];

// Venue Types
export const venueTypes = [
  { id: 'indoor-ballroom', name: 'Indoor Ballroom', icon: '🏛️', description: 'Elegant indoor spaces' },
  { id: 'outdoor-garden', name: 'Outdoor Garden', icon: '🌳', description: 'Beautiful open-air settings' },
  { id: 'beach', name: 'Beach/Waterfront', icon: '🏖️', description: 'Scenic waterside locations' },
  { id: 'rooftop', name: 'Rooftop', icon: '🌃', description: 'City views and open sky' },
  { id: 'restaurant', name: 'Restaurant/Hotel', icon: '🍽️', description: 'All-inclusive venues' },
  { id: 'home', name: 'Home/Private', icon: '🏠', description: 'Intimate private settings' },
  { id: 'industrial', name: 'Industrial/Loft', icon: '🏭', description: 'Trendy urban spaces' },
  { id: 'destination', name: 'Destination', icon: '✈️', description: 'Travel-based celebrations' },
];

// Budget Ranges (in Naira)
export const budgetRanges = [
  { id: 'budget', label: 'Budget Friendly', range: '₦100K - ₦500K', min: 100000, max: 500000 },
  { id: 'moderate', label: 'Moderate', range: '₦500K - ₦1.5M', min: 500000, max: 1500000 },
  { id: 'premium', label: 'Premium', range: '₦1.5M - ₦3M', min: 1500000, max: 3000000 },
  { id: 'luxury', label: 'Luxury', range: '₦3M - ₦5M', min: 3000000, max: 5000000 },
  { id: 'ultra', label: 'Ultra Luxury', range: '₦5M+', min: 5000000, max: 50000000 },
];

// Event Type Categories
export const eventTypeCategories = [
  { id: 'wedding', name: 'Wedding', icon: '💍', categoryIds: ['weddings'] },
  { id: 'birthday', name: 'Birthday', icon: '🎂', categoryIds: ['birthdays'] },
  { id: 'corporate', name: 'Corporate Event', icon: '🏢', categoryIds: ['corporate'] },
  { id: 'baby-shower', name: 'Baby Shower', icon: '👶', categoryIds: ['baby-showers'] },
  { id: 'concert', name: 'Concert/Party', icon: '🎤', categoryIds: ['concerts'] },
];

export interface EventPlan {
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
  packages: GeneratedPackage[];
}

export interface GeneratedPackage {
  id: string;
  name: string;
  tier: 'essential' | 'standard' | 'premium';
  description: string;
  totalPrice: number;
  services: Service[];
  vendors: Vendor[];
  deliveryTimeline: string;
  avgRating: number;
  features: string[];
}

// Package Generation Algorithm
export function generateEventPackages(
  eventType: string,
  theme: string,
  colorPalette: string,
  guestSize: string,
  venueType: string,
  budget: string
): GeneratedPackage[] {
  const budgetInfo = budgetRanges.find(b => b.id === budget);
  const guestInfo = guestSizeRanges.find(g => g.id === guestSize);
  const eventInfo = eventTypeCategories.find(e => e.id === eventType);
  
  if (!budgetInfo || !guestInfo || !eventInfo) return [];

  const maxBudget = budgetInfo.max;
  const relevantCategories = ['catering', 'decorations', 'photography', 'concerts', 'rentals', ...eventInfo.categoryIds];
  
  // Filter services by relevant categories
  const relevantServices = services.filter(s => 
    relevantCategories.includes(s.category) && s.available
  );

  // Sort by rating and price for different tiers
  const sortedByRating = [...relevantServices].sort((a, b) => b.rating - a.rating);
  const sortedByPrice = [...relevantServices].sort((a, b) => a.price - b.price);

  // Generate three tiers
  const packages: GeneratedPackage[] = [];

  // Essential Package (30% of budget)
  const essentialBudget = maxBudget * 0.3;
  const essentialServices = selectServicesForBudget(sortedByPrice, essentialBudget, eventInfo.categoryIds);
  if (essentialServices.length > 0) {
    packages.push(createPackage('essential', 'Essential Package', essentialServices, eventInfo.name));
  }

  // Standard Package (60% of budget)
  const standardBudget = maxBudget * 0.6;
  const standardServices = selectServicesForBudget(sortedByRating, standardBudget, eventInfo.categoryIds);
  if (standardServices.length > 0) {
    packages.push(createPackage('standard', 'Standard Package', standardServices, eventInfo.name));
  }

  // Premium Package (100% of budget)
  const premiumServices = selectServicesForBudget(sortedByRating, maxBudget, eventInfo.categoryIds);
  if (premiumServices.length > 0) {
    packages.push(createPackage('premium', 'Premium Package', premiumServices, eventInfo.name));
  }

  return packages;
}

function selectServicesForBudget(
  availableServices: Service[],
  maxBudget: number,
  priorityCategories: string[]
): Service[] {
  const selected: Service[] = [];
  let totalSpent = 0;
  const usedCategories = new Set<string>();

  // First, try to get one from each priority category
  for (const category of priorityCategories) {
    const categoryServices = availableServices.filter(s => s.category === category && !usedCategories.has(s.id));
    const affordable = categoryServices.filter(s => totalSpent + s.price <= maxBudget);
    if (affordable.length > 0) {
      selected.push(affordable[0]);
      totalSpent += affordable[0].price;
      usedCategories.add(affordable[0].id);
    }
  }

  // Then add more services from other categories
  const essentialCategories = ['catering', 'decorations', 'photography', 'concerts'];
  for (const category of essentialCategories) {
    if (usedCategories.has(category)) continue;
    const categoryServices = availableServices.filter(s => s.category === category);
    const affordable = categoryServices.filter(s => totalSpent + s.price <= maxBudget);
    if (affordable.length > 0) {
      selected.push(affordable[0]);
      totalSpent += affordable[0].price;
      usedCategories.add(affordable[0].id);
    }
  }

  return selected;
}

function createPackage(
  tier: 'essential' | 'standard' | 'premium',
  name: string,
  selectedServices: Service[],
  eventTypeName: string
): GeneratedPackage {
  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const avgRating = selectedServices.length > 0 
    ? selectedServices.reduce((sum, s) => sum + s.rating, 0) / selectedServices.length 
    : 0;
  
  const vendorIds = [...new Set(selectedServices.map(s => s.vendorId))];
  const packageVendors = vendors.filter(v => vendorIds.includes(v.id));

  const tierDescriptions = {
    essential: `Perfect starter package for your ${eventTypeName}. Covers the basics with quality service.`,
    standard: `Our recommended package for your ${eventTypeName}. Great balance of value and quality.`,
    premium: `The ultimate ${eventTypeName} experience. Premium services for an unforgettable event.`,
  };

  const tierTimelines = {
    essential: '2-3 weeks',
    standard: '3-4 weeks',
    premium: '4-6 weeks',
  };

  const allFeatures = selectedServices.flatMap(s => s.features).slice(0, 8);

  return {
    id: `pkg-${tier}-${Date.now()}`,
    name,
    tier,
    description: tierDescriptions[tier],
    totalPrice,
    services: selectedServices,
    vendors: packageVendors,
    deliveryTimeline: tierTimelines[tier],
    avgRating: Math.round(avgRating * 10) / 10,
    features: allFeatures,
  };
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}
