import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Heart, User, Menu, X, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { SmartSearch } from '@/components/ui/SmartSearch';
import { supabase } from '@/integrations/supabase/client';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { cart, wishlist, isAuthenticated } = useStore();

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const checkAdminRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .eq('role', 'admin')
          .maybeSingle();
        setIsAdmin(!!data);
      }
    };
    checkAdminRole();
  }, []);

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
            <Link to="/" className="text-foreground/80 hover:text-gold transition-colors">
              Home
            </Link>
            <Link to="/services" className="text-foreground/80 hover:text-gold transition-colors">
              Services
            </Link>
            <Link to="/event-builder" className="text-foreground/80 hover:text-gold transition-colors flex items-center gap-1">
              <span className="text-gold">✨</span> Event Builder
            </Link>
            <Link to="/categories" className="text-foreground/80 hover:text-gold transition-colors">
              Categories
            </Link>
            <Link to="/vendors" className="text-foreground/80 hover:text-gold transition-colors">
              Vendors
            </Link>
            {isAdmin && (
              <Link to="/admin" className="text-gold hover:text-gold-light transition-colors flex items-center gap-1">
                <Shield className="h-4 w-4" /> Admin
              </Link>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
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
            <ThemeToggle />
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

      {/* Smart Search Overlay */}
      <SmartSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Dark overlay backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            {/* Menu panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-sm bg-background border-l border-border z-50 md:hidden overflow-y-auto"
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

                {/* Search in mobile menu */}
                <Button
                  variant="outline"
                  className="w-full justify-start mb-6 text-muted-foreground"
                  onClick={() => { setIsMenuOpen(false); setIsSearchOpen(true); }}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search services...
                </Button>

                <nav className="flex flex-col gap-2 flex-1">
                  {[
                    { to: '/', label: 'Home' },
                    { to: '/services', label: 'Services' },
                    { to: '/event-builder', label: '✨ Event Builder' },
                    { to: '/categories', label: 'Categories' },
                    { to: '/vendors', label: 'Vendors' },
                    { to: '/wishlist', label: 'Wishlist' },
                    { to: '/saved-plans', label: 'Saved Plans' },
                    { to: '/bookings', label: 'My Bookings' },
                  ].map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-lg font-medium py-3 px-4 rounded-lg hover:bg-muted hover:text-gold transition-colors"
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
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
