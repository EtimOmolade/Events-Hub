import { Service, Vendor } from '@/store/useStore';

export const categories = [
  { id: 'weddings', name: 'Weddings', icon: '💍', description: 'Complete wedding planning & services' },
  { id: 'birthdays', name: 'Birthdays', icon: '🎂', description: 'Birthday party packages & supplies' },
  { id: 'corporate', name: 'Corporate', icon: '🏢', description: 'Professional corporate events' },
  { id: 'baby-showers', name: 'Baby Showers', icon: '👶', description: 'Beautiful baby shower setups' },
  { id: 'concerts', name: 'Concerts', icon: '🎤', description: 'Live entertainment & sound' },
  { id: 'catering', name: 'Catering', icon: '🍽️', description: 'Gourmet food & beverages' },
  { id: 'decorations', name: 'Decorations', icon: '🎨', description: 'Stunning event décor' },
  { id: 'photography', name: 'Photography', icon: '📸', description: 'Professional photo & video' },
  { id: 'rentals', name: 'Rentals', icon: '🪑', description: 'Equipment & furniture rentals' },
];

export const vendors: Vendor[] = [
  {
    id: 'v1',
    name: 'Elegance Events',
    specialty: 'Wedding Planning',
    bio: 'Award-winning wedding planners with 15+ years of experience creating unforgettable celebrations.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    portfolio: [],
    rating: 4.9,
    reviewCount: 234,
    location: 'Lagos, Nigeria',
    verified: true,
  },
  {
    id: 'v2',
    name: 'Divine Catering Co.',
    specialty: 'Catering Services',
    bio: 'Premium catering services specializing in African and Continental cuisines.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    portfolio: [],
    rating: 4.8,
    reviewCount: 189,
    location: 'Abuja, Nigeria',
    verified: true,
  },
  {
    id: 'v3',
    name: 'Pixel Perfect Studios',
    specialty: 'Photography & Video',
    bio: 'Capturing your precious moments with cinematic excellence and artistic vision.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    portfolio: [],
    rating: 4.9,
    reviewCount: 312,
    location: 'Lagos, Nigeria',
    verified: true,
  },
  {
    id: 'v4',
    name: 'Royal Décor',
    specialty: 'Event Decorations',
    bio: 'Transforming spaces into magical wonderlands with luxurious décor and floral arrangements.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    portfolio: [],
    rating: 4.7,
    reviewCount: 156,
    location: 'Port Harcourt, Nigeria',
    verified: true,
  },
  {
    id: 'v5',
    name: 'SoundWave Entertainment',
    specialty: 'DJ & Sound',
    bio: 'Professional DJs and sound engineers making every event unforgettable.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    portfolio: [],
    rating: 4.8,
    reviewCount: 203,
    location: 'Lagos, Nigeria',
    verified: true,
  },
];

export const services: Service[] = [
  // Weddings
  {
    id: 's1',
    name: 'Luxury Wedding Package',
    category: 'weddings',
    description: 'Our signature luxury wedding package includes full event coordination, venue styling, guest management, and day-of coordination. We handle every detail so you can focus on enjoying your special day. Package includes consultation meetings, vendor coordination, timeline creation, rehearsal coordination, and up to 12 hours of day-of coverage.',
    shortDescription: 'Complete luxury wedding planning & coordination',
    price: 2500000,
    priceType: 'starting',
    rating: 4.9,
    reviewCount: 89,
    images: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800',
    ],
    vendorId: 'v1',
    vendorName: 'Elegance Events',
    location: 'Lagos, Nigeria',
    features: ['Full Planning', 'Vendor Management', 'Day-of Coordination', 'Guest Management', 'Venue Styling'],
    available: true,
  },
  {
    id: 's2',
    name: 'Traditional Wedding Setup',
    category: 'weddings',
    description: 'Beautiful traditional wedding décor package featuring authentic cultural elements, vibrant colors, and stunning arrangements that honor your heritage.',
    shortDescription: 'Authentic traditional wedding decorations',
    price: 800000,
    priceType: 'starting',
    rating: 4.8,
    reviewCount: 67,
    images: [
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800',
      'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800',
    ],
    vendorId: 'v4',
    vendorName: 'Royal Décor',
    location: 'Lagos, Nigeria',
    features: ['Cultural Elements', 'Floral Arrangements', 'Stage Setup', 'Lighting'],
    available: true,
  },
  // Birthdays
  {
    id: 's3',
    name: 'Children\'s Birthday Party',
    category: 'birthdays',
    description: 'Magical birthday party package for kids including themed decorations, entertainment, games, and party favors. Create unforgettable memories for your little ones.',
    shortDescription: 'Fun-filled kids birthday celebration',
    price: 150000,
    priceType: 'starting',
    rating: 4.7,
    reviewCount: 124,
    images: [
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800',
      'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800',
    ],
    vendorId: 'v4',
    vendorName: 'Royal Décor',
    location: 'Lagos, Nigeria',
    features: ['Themed Décor', 'Entertainment', 'Party Games', 'Party Favors'],
    available: true,
  },
  {
    id: 's4',
    name: 'Milestone Birthday Celebration',
    category: 'birthdays',
    description: 'Elegant celebration package for milestone birthdays (30th, 40th, 50th, etc.) with sophisticated décor, entertainment, and catering options.',
    shortDescription: 'Elegant milestone birthday package',
    price: 500000,
    priceType: 'starting',
    rating: 4.8,
    reviewCount: 56,
    images: [
      'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800',
      'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
    ],
    vendorId: 'v1',
    vendorName: 'Elegance Events',
    location: 'Lagos, Nigeria',
    features: ['Elegant Décor', 'DJ Services', 'Photo Booth', 'Catering Coordination'],
    available: true,
  },
  // Corporate
  {
    id: 's5',
    name: 'Corporate Conference Package',
    category: 'corporate',
    description: 'Professional conference and seminar setup including AV equipment, staging, registration management, and catering coordination for up to 500 attendees.',
    shortDescription: 'Professional conference & seminar services',
    price: 1200000,
    priceType: 'starting',
    rating: 4.9,
    reviewCount: 78,
    images: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800',
    ],
    vendorId: 'v1',
    vendorName: 'Elegance Events',
    location: 'Lagos, Nigeria',
    features: ['AV Equipment', 'Stage Setup', 'Registration', 'Catering', 'Branding'],
    available: true,
  },
  {
    id: 's6',
    name: 'Product Launch Event',
    category: 'corporate',
    description: 'Make your product launch unforgettable with our comprehensive event package including media management, entertainment, and stunning visual presentations.',
    shortDescription: 'Impactful product launch services',
    price: 2000000,
    priceType: 'starting',
    rating: 4.8,
    reviewCount: 34,
    images: [
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800',
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800',
    ],
    vendorId: 'v1',
    vendorName: 'Elegance Events',
    location: 'Lagos, Nigeria',
    features: ['Media Management', 'Visual Production', 'Entertainment', 'PR Support'],
    available: true,
  },
  // Baby Showers
  {
    id: 's7',
    name: 'Classic Baby Shower',
    category: 'baby-showers',
    description: 'Sweet and elegant baby shower setup with beautiful decorations, games, and refreshments. Perfect for welcoming your little bundle of joy.',
    shortDescription: 'Elegant baby shower celebration',
    price: 200000,
    priceType: 'starting',
    rating: 4.7,
    reviewCount: 89,
    images: [
      'https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=800',
      'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800',
    ],
    vendorId: 'v4',
    vendorName: 'Royal Décor',
    location: 'Lagos, Nigeria',
    features: ['Themed Décor', 'Games Package', 'Refreshments', 'Gift Table Setup'],
    available: true,
  },
  // Catering
  {
    id: 's8',
    name: 'Premium Catering - 100 Guests',
    category: 'catering',
    description: 'Exquisite 3-course meal service for up to 100 guests. Includes appetizers, main courses, desserts, and professional service staff.',
    shortDescription: 'Gourmet catering for 100 guests',
    price: 750000,
    priceType: 'fixed',
    rating: 4.9,
    reviewCount: 145,
    images: [
      'https://images.unsplash.com/photo-1555244162-803834f70033?w=800',
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800',
    ],
    vendorId: 'v2',
    vendorName: 'Divine Catering Co.',
    location: 'Lagos, Nigeria',
    features: ['3-Course Meal', 'Service Staff', 'Table Setup', 'Cleanup'],
    available: true,
  },
  {
    id: 's9',
    name: 'Cocktail Party Catering',
    category: 'catering',
    description: 'Sophisticated cocktail party menu with passed hors d\'oeuvres, cocktails, and elegant presentation for up to 150 guests.',
    shortDescription: 'Elegant cocktail party service',
    price: 500000,
    priceType: 'starting',
    rating: 4.8,
    reviewCount: 98,
    images: [
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
      'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800',
    ],
    vendorId: 'v2',
    vendorName: 'Divine Catering Co.',
    location: 'Abuja, Nigeria',
    features: ['Hors d\'oeuvres', 'Signature Cocktails', 'Bartenders', 'Elegant Setup'],
    available: true,
  },
  // Decorations
  {
    id: 's10',
    name: 'Luxury Floral Arrangements',
    category: 'decorations',
    description: 'Stunning floral centerpieces and arrangements using premium fresh flowers. Custom designs to match your event theme and color palette.',
    shortDescription: 'Premium fresh flower arrangements',
    price: 300000,
    priceType: 'starting',
    rating: 4.9,
    reviewCount: 167,
    images: [
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800',
      'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800',
    ],
    vendorId: 'v4',
    vendorName: 'Royal Décor',
    location: 'Lagos, Nigeria',
    features: ['Fresh Flowers', 'Custom Designs', 'Setup & Removal', 'Centerpieces'],
    available: true,
  },
  {
    id: 's11',
    name: 'Complete Event Styling',
    category: 'decorations',
    description: 'Full venue transformation including draping, lighting, furniture styling, and thematic decorations. Turn any space into a magical wonderland.',
    shortDescription: 'Complete venue transformation',
    price: 600000,
    priceType: 'starting',
    rating: 4.8,
    reviewCount: 123,
    images: [
      'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
    ],
    vendorId: 'v4',
    vendorName: 'Royal Décor',
    location: 'Port Harcourt, Nigeria',
    features: ['Draping', 'Lighting Design', 'Furniture Styling', 'Themed Décor'],
    available: true,
  },
  // Photography
  {
    id: 's12',
    name: 'Wedding Photography Package',
    category: 'photography',
    description: 'Full-day wedding photography coverage with 2 photographers, drone footage, edited photos, and a premium photo album.',
    shortDescription: 'Complete wedding photo coverage',
    price: 450000,
    priceType: 'fixed',
    rating: 4.9,
    reviewCount: 234,
    images: [
      'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800',
      'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800',
    ],
    vendorId: 'v3',
    vendorName: 'Pixel Perfect Studios',
    location: 'Lagos, Nigeria',
    features: ['2 Photographers', 'Drone Coverage', '500+ Edited Photos', 'Premium Album'],
    available: true,
  },
  {
    id: 's13',
    name: 'Event Videography',
    category: 'photography',
    description: 'Professional event videography with 4K recording, cinematic editing, and highlight reel. Perfect for any celebration.',
    shortDescription: 'Cinematic event video coverage',
    price: 350000,
    priceType: 'starting',
    rating: 4.8,
    reviewCount: 156,
    images: [
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800',
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800',
    ],
    vendorId: 'v3',
    vendorName: 'Pixel Perfect Studios',
    location: 'Lagos, Nigeria',
    features: ['4K Recording', 'Cinematic Edit', 'Highlight Reel', 'Raw Footage'],
    available: true,
  },
  // Concerts
  {
    id: 's14',
    name: 'Live Band Performance',
    category: 'concerts',
    description: 'Professional live band for your event featuring versatile musicians who can perform various genres from highlife to contemporary hits.',
    shortDescription: 'Professional live music entertainment',
    price: 400000,
    priceType: 'starting',
    rating: 4.7,
    reviewCount: 89,
    images: [
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
    ],
    vendorId: 'v5',
    vendorName: 'SoundWave Entertainment',
    location: 'Lagos, Nigeria',
    features: ['5-Piece Band', 'Sound Equipment', '4-Hour Performance', 'MC Services'],
    available: true,
  },
  {
    id: 's15',
    name: 'Premium DJ Package',
    category: 'concerts',
    description: 'Top-tier DJ services with professional sound system, lighting effects, and MC services. Keep your guests dancing all night!',
    shortDescription: 'Professional DJ & sound services',
    price: 250000,
    priceType: 'starting',
    rating: 4.8,
    reviewCount: 178,
    images: [
      'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
    ],
    vendorId: 'v5',
    vendorName: 'SoundWave Entertainment',
    location: 'Lagos, Nigeria',
    features: ['Pro Sound System', 'Lighting Effects', 'MC Services', '6-Hour Coverage'],
    available: true,
  },
  // Rentals
  {
    id: 's16',
    name: 'Luxury Furniture Rental',
    category: 'rentals',
    description: 'Premium event furniture including gold chiavari chairs, glass tables, lounge sets, and accent pieces for up to 200 guests.',
    shortDescription: 'Premium event furniture package',
    price: 350000,
    priceType: 'starting',
    rating: 4.7,
    reviewCount: 134,
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
    ],
    vendorId: 'v4',
    vendorName: 'Royal Décor',
    location: 'Lagos, Nigeria',
    features: ['Chiavari Chairs', 'Glass Tables', 'Lounge Sets', 'Delivery & Setup'],
    available: true,
  },
  {
    id: 's17',
    name: 'Tent & Canopy Rental',
    category: 'rentals',
    description: 'High-quality marquee tents and canopies with optional flooring, lighting, and climate control for outdoor events.',
    shortDescription: 'Premium outdoor shelter solutions',
    price: 400000,
    priceType: 'starting',
    rating: 4.6,
    reviewCount: 98,
    images: [
      'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800',
      'https://images.unsplash.com/photo-1530023367847-a683933f4172?w=800',
    ],
    vendorId: 'v4',
    vendorName: 'Royal Décor',
    location: 'Lagos, Nigeria',
    features: ['Marquee Tents', 'Flooring', 'Lighting', 'Climate Control'],
    available: true,
  },
  {
    id: 's18',
    name: 'Audio Visual Equipment',
    category: 'rentals',
    description: 'Complete AV setup including projectors, LED screens, microphones, speakers, and technical support for conferences and events.',
    shortDescription: 'Professional AV equipment rental',
    price: 200000,
    priceType: 'starting',
    rating: 4.8,
    reviewCount: 87,
    images: [
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800',
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    ],
    vendorId: 'v5',
    vendorName: 'SoundWave Entertainment',
    location: 'Lagos, Nigeria',
    features: ['LED Screens', 'Projectors', 'Sound System', 'Technical Support'],
    available: true,
  },
];

export const getServicesByCategory = (categoryId: string): Service[] => {
  return services.filter((s) => s.category === categoryId);
};

export const getServiceById = (id: string): Service | undefined => {
  return services.find((s) => s.id === id);
};

export const getVendorById = (id: string): Vendor | undefined => {
  return vendors.find((v) => v.id === id);
};

export const searchServices = (query: string, categoryId?: string | null): Service[] => {
  let results = services;
  
  if (categoryId) {
    results = results.filter((s) => s.category === categoryId);
  }
  
  if (query) {
    const lowerQuery = query.toLowerCase();
    results = results.filter(
      (s) =>
        s.name.toLowerCase().includes(lowerQuery) ||
        s.description.toLowerCase().includes(lowerQuery) ||
        s.vendorName.toLowerCase().includes(lowerQuery) ||
        s.category.toLowerCase().includes(lowerQuery)
    );
  }
  
  return results;
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};
