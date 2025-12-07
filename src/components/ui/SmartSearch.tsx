import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { services, categories } from '@/data/services';

interface SmartSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SmartSearch({ isOpen, onClose }: SmartSearchProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { recentSearches, addRecentSearch, recentlyViewed, setSearchQuery } = useStore();

  const trendingSearches = ['Wedding Planning', 'Catering', 'Photography', 'DJ Services'];

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.length > 1) {
      const lowerQuery = query.toLowerCase();
      
      const matchedServices = services
        .filter(s => 
          s.name.toLowerCase().includes(lowerQuery) ||
          s.shortDescription.toLowerCase().includes(lowerQuery)
        )
        .slice(0, 4)
        .map(s => ({ type: 'service', item: s }));

      const matchedCategories = categories
        .filter(c => c.name.toLowerCase().includes(lowerQuery))
        .slice(0, 2)
        .map(c => ({ type: 'category', item: c }));

      setSuggestions([...matchedCategories, ...matchedServices]);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSearch = (searchTerm: string) => {
    if (searchTerm.trim()) {
      addRecentSearch(searchTerm);
      setSearchQuery(searchTerm);
      navigate(`/services?search=${encodeURIComponent(searchTerm)}`);
      onClose();
      setQuery('');
    }
  };

  const handleSelectSuggestion = (suggestion: any) => {
    if (suggestion.type === 'service') {
      addRecentSearch(suggestion.item.name);
      navigate(`/service/${suggestion.item.id}`);
    } else if (suggestion.type === 'category') {
      addRecentSearch(suggestion.item.name);
      navigate(`/services?category=${suggestion.item.id}`);
    }
    onClose();
    setQuery('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/95 backdrop-blur-lg z-50 flex items-start justify-center pt-20 md:pt-32"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-2xl px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={(e) => { e.preventDefault(); handleSearch(query); }} className="relative">
              <Input
                ref={inputRef}
                type="text"
                placeholder="Search services, vendors, categories..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-14 text-lg pl-14 pr-12 rounded-xl border-2 border-gold/30 focus:border-gold bg-card"
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              {query && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </form>

            {/* Suggestions Dropdown */}
            <motion.div 
              className="mt-4 bg-card rounded-xl border border-border shadow-elevated overflow-hidden"
              layout
            >
              {suggestions.length > 0 ? (
                <div className="p-2">
                  {suggestions.map((suggestion, index) => (
                    <motion.button
                      key={`${suggestion.type}-${suggestion.item.id}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleSelectSuggestion(suggestion)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center text-gold">
                        {suggestion.type === 'category' ? (
                          <span className="text-lg">{suggestion.item.icon}</span>
                        ) : (
                          <Search className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{suggestion.item.name}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {suggestion.type === 'category' ? 'Category' : suggestion.item.shortDescription}
                        </p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              ) : (
                <div className="p-4 space-y-6">
                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <Clock className="h-4 w-4" />
                        <span>Recent Searches</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.slice(0, 5).map((term, index) => (
                          <button
                            key={index}
                            onClick={() => handleSearch(term)}
                            className="px-3 py-1.5 rounded-full bg-muted text-sm hover:bg-gold/20 hover:text-gold transition-colors"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Trending */}
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <TrendingUp className="h-4 w-4" />
                      <span>Trending</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {trendingSearches.map((term, index) => (
                        <button
                          key={index}
                          onClick={() => handleSearch(term)}
                          className="px-3 py-1.5 rounded-full bg-gold/10 text-gold text-sm hover:bg-gold/20 transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Recently Viewed */}
                  {recentlyViewed.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <Clock className="h-4 w-4" />
                        <span>Recently Viewed</span>
                      </div>
                      <div className="space-y-2">
                        {recentlyViewed.slice(0, 3).map((service) => (
                          <button
                            key={service.id}
                            onClick={() => { navigate(`/service/${service.id}`); onClose(); }}
                            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors text-left"
                          >
                            <img 
                              src={service.images[0]} 
                              alt={service.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{service.name}</p>
                              <p className="text-xs text-muted-foreground">₦{service.price.toLocaleString()}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute top-4 right-4 md:top-8 md:right-8"
            >
              <X className="h-6 w-6" />
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
