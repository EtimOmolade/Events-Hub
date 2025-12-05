import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Heart, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const { cart, wishlist, isAuthenticated, searchQuery, setSearchQuery } = useStore();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
              <span className="text-rich-black font-display font-bold text-lg">E</span>
            </div>
            <span className="font-display text-xl font-semibold hidden sm:block">
              Events<span className="text-gold">Hub</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link to="/" className="text-foreground/80 hover:text-gold transition-colors">
              Home
            </Link>
            <Link to="/services" className="text-foreground/80 hover:text-gold transition-colors">
              Services
            </Link>
            <Link to="/categories" className="text-foreground/80 hover:text-gold transition-colors">
              Categories
            </Link>
            <Link to="/vendors" className="text-foreground/80 hover:text-gold transition-colors">
              Vendors
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
              className="text-foreground/80 hover:text-gold"
            >
              <Search className="h-5 w-5" />
            </Button>

            <Link to="/wishlist">
              <Button variant="ghost" size="icon" className="relative text-foreground/80 hover:text-gold">
                <Heart className="h-5 w-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gold text-rich-black text-xs font-semibold flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Button>
            </Link>

            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative text-foreground/80 hover:text-gold">
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gold text-rich-black text-xs font-semibold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {isAuthenticated ? (
              <Link to="/account">
                <Button variant="gold" size="sm">
                  <User className="h-4 w-4" />
                  Account
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button variant="gold" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gold text-rich-black text-xs font-semibold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(true)}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/95 backdrop-blur-lg z-50 flex items-start justify-center pt-32"
          >
            <div className="w-full max-w-2xl px-4">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Search services, vendors, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-14 text-lg pl-14 pr-4 rounded-xl border-2 border-gold/30 focus:border-gold"
                  autoFocus
                />
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </form>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(false)}
                className="absolute top-8 right-8"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-background z-50 lg:hidden"
          >
            <div className="flex flex-col h-full p-6">
              <div className="flex items-center justify-between mb-8">
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
                    <span className="text-rich-black font-display font-bold text-lg">E</span>
                  </div>
                  <span className="font-display text-xl font-semibold">
                    Events<span className="text-gold">Hub</span>
                  </span>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <nav className="flex flex-col gap-4 flex-1">
                {[
                  { to: '/', label: 'Home' },
                  { to: '/services', label: 'Services' },
                  { to: '/categories', label: 'Categories' },
                  { to: '/vendors', label: 'Vendors' },
                  { to: '/wishlist', label: 'Wishlist' },
                  { to: '/bookings', label: 'My Bookings' },
                ].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-xl font-medium py-3 border-b border-border/50 hover:text-gold transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="pt-6 border-t border-border">
                {isAuthenticated ? (
                  <Link to="/account" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="gold" className="w-full" size="lg">
                      <User className="h-5 w-5" />
                      My Account
                    </Button>
                  </Link>
                ) : (
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="gold" className="w-full" size="lg">
                      Sign In / Register
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
