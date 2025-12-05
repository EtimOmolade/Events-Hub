import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, Grid, List } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ServiceCard } from '@/components/services/ServiceCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { categories, searchServices, services } from '@/data/services';
import { useStore } from '@/store/useStore';

const priceRanges = [
  { id: 'under-200k', label: 'Under ₦200,000', min: 0, max: 200000 },
  { id: '200k-500k', label: '₦200,000 - ₦500,000', min: 200000, max: 500000 },
  { id: '500k-1m', label: '₦500,000 - ₦1,000,000', min: 500000, max: 1000000 },
  { id: 'over-1m', label: 'Over ₦1,000,000', min: 1000000, max: Infinity },
];

const sortOptions = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
];

export default function Services() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } = useStore();
  
  const [localSearch, setLocalSearch] = useState(searchParams.get('search') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    if (category) setSelectedCategory(category);
    if (search) {
      setLocalSearch(search);
      setSearchQuery(search);
    }
  }, [searchParams]);

  const filteredServices = useMemo(() => {
    let results = searchServices(localSearch, selectedCategory);

    // Filter by price range
    if (selectedPriceRanges.length > 0) {
      results = results.filter((service) => {
        return selectedPriceRanges.some((rangeId) => {
          const range = priceRanges.find((r) => r.id === rangeId);
          if (!range) return false;
          return service.price >= range.min && service.price < range.max;
        });
      });
    }

    // Sort
    switch (sortBy) {
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'price-low':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        results.sort((a, b) => b.price - a.price);
        break;
      default:
        results.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return results;
  }, [localSearch, selectedCategory, selectedPriceRanges, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    const params = new URLSearchParams(searchParams);
    if (localSearch) {
      params.set('search', localSearch);
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  };

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    const params = new URLSearchParams(searchParams);
    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    setSearchParams(params);
  };

  const togglePriceRange = (rangeId: string) => {
    setSelectedPriceRanges((prev) =>
      prev.includes(rangeId) ? prev.filter((r) => r !== rangeId) : [...prev, rangeId]
    );
  };

  const clearFilters = () => {
    setLocalSearch('');
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedPriceRanges([]);
    setSortBy('popular');
    setSearchParams({});
  };

  const activeFiltersCount = [
    selectedCategory,
    ...selectedPriceRanges,
    localSearch,
  ].filter(Boolean).length;

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-secondary to-background py-12 md:py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Find Your Perfect <span className="text-gold">Event Service</span>
              </h1>
              <p className="text-muted-foreground text-lg mb-8">
                Browse our curated selection of premium event services
              </p>
              <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
                <Input
                  type="text"
                  placeholder="Search services, vendors, categories..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="h-14 pl-14 pr-4 text-lg rounded-full border-2 border-border focus:border-gold"
                />
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Button
                  type="submit"
                  variant="gold"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
                >
                  Search
                </Button>
              </form>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto pb-2">
              <Button
                variant={selectedCategory === null ? 'gold' : 'outline'}
                size="sm"
                onClick={() => handleCategoryChange(null)}
                className="rounded-full"
              >
                All Services
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'gold' : 'outline'}
                  size="sm"
                  onClick={() => handleCategoryChange(category.id)}
                  className="rounded-full whitespace-nowrap"
                >
                  {category.icon} {category.name}
                </Button>
              ))}
            </div>

            {/* Filters Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 p-4 bg-card rounded-xl border">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="gap-2"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="ml-1 w-5 h-5 rounded-full bg-gold text-rich-black text-xs flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear all
                    <X className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-4">
                <span className="text-muted-foreground text-sm hidden md:block">
                  {filteredServices.length} services found
                </span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="hidden md:flex items-center border rounded-lg overflow-hidden">
                  <Button
                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                    className="rounded-none"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                    className="rounded-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 p-6 bg-card rounded-xl border"
              >
                <h3 className="font-semibold mb-4">Price Range</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {priceRanges.map((range) => (
                    <label
                      key={range.id}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Checkbox
                        checked={selectedPriceRanges.includes(range.id)}
                        onCheckedChange={() => togglePriceRange(range.id)}
                      />
                      <span className="text-sm">{range.label}</span>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Results */}
            {filteredServices.length > 0 ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'flex flex-col gap-4'
                }
              >
                {filteredServices.map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ServiceCard service={service} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <p className="text-muted-foreground text-lg mb-4">
                  No services found matching your criteria
                </p>
                <Button variant="gold" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </motion.div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}
