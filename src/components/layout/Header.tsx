import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Heart, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { useAuth } from '@/hooks/useAuth';
import { SmartSearch } from '@/components/ui/SmartSearch';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, wishlist } = useStore();
  const { isAuthenticated } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

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
            <Link to="/" className={`transition-colors ${isActive('/') ? 'text-gold font-medium' : 'text-foreground/80 hover:text-gold'}`}>
              Home
            </Link>
            <Link to="/services" className={`transition-colors ${isActive('/services') ? 'text-gold font-medium' : 'text-foreground/80 hover:text-gold'}`}>
              Services
            </Link>
            <Link to="/event-builder" className={`transition-colors ${isActive('/event-builder') ? 'text-gold font-medium' : 'text-foreground/80 hover:text-gold'}`}>
              Event Builder
            </Link>
            <Link to="/vendors" className={`transition-colors ${isActive('/vendors') ? 'text-gold font-medium' : 'text-foreground/80 hover:text-gold'}`}>
              Vendors
            </Link>
            <Link to="/bookings" className={`transition-colors ${isActive('/bookings') ? 'text-gold font-medium' : 'text-foreground/80 hover:text-gold'}`}>
              Bookings
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
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

          {/* ----------------------------- */}
          {/* 📱 MOBILE BUTTONS + DROPDOWN */}
          {/* ----------------------------- */}
          <div className="flex md:hidden items-center gap-2 relative">
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

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>

            {/* 📌 MOBILE DROPDOWN MENU */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="absolute top-14 right-0 w-56 bg-background border border-border rounded-xl shadow-xl p-3 z-[100]"
                >
                  <nav className="flex flex-col gap-1">
                    {[
                      { to: '/', label: 'Home' },
                      { to: '/services', label: 'Services' },
                      { to: '/event-builder', label: 'Event Builder' },
                      { to: '/vendors', label: 'Vendors' },
                      { to: '/bookings', label: 'Bookings' },
                      { to: '/wishlist', label: 'Wishlist' },
                    ].map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setIsMenuOpen(false)}
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                          isActive(item.to)
                            ? 'bg-gold/20 text-gold'
                            : 'text-foreground/80 hover:bg-muted hover:text-gold'
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>

                  <div className="mt-3 pt-3 border-t border-border">
                    {isAuthenticated ? (
                      <Link to="/account" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="gold" size="sm" className="w-full">
                          <User className="h-4 w-4" />
                          Account
                        </Button>
                      </Link>
                    ) : (
                      <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="gold" size="sm" className="w-full">
                          Sign In
                        </Button>
                      </Link>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Smart Search Overlay */}
      <SmartSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
}
