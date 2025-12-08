import { ReactNode, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Users, Package, Tag, FolderOpen, Settings, LogOut, Menu, X,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { id: 'services', label: 'Services', icon: Package, path: '/admin/services' },
  { id: 'vendors', label: 'Vendors', icon: Users, path: '/admin/vendors' },
  { id: 'categories', label: 'Categories', icon: FolderOpen, path: '/admin/categories' },
  { id: 'promotions', label: 'Promotions', icon: Tag, path: '/admin/promotions' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, user } = useAdminAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const currentPath = location.pathname;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Desktop */}
      <aside className="w-64 bg-card border-r border-border hidden lg:flex flex-col">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
              <span className="text-rich-black font-display font-bold text-lg">E</span>
            </div>
            <span className="font-display text-xl font-semibold">
              Admin
            </span>
          </Link>
        </div>

        <nav className="px-4 space-y-1 flex-1">
          {navItems.map((item) => {
            const isActive = currentPath === item.path || 
              (item.path !== '/admin' && currentPath.startsWith(item.path));
            
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-gold/10 text-gold'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="mb-4 px-4">
            <p className="text-sm font-medium truncate">{user?.email}</p>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>
          <Button variant="ghost" className="w-full justify-start text-destructive" onClick={handleLogout}>
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
              <span className="text-rich-black font-display font-bold text-sm">E</span>
            </div>
            <span className="font-display text-lg font-semibold">Admin</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="lg:hidden fixed inset-0 z-50 bg-background"
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="font-display text-lg font-semibold">Menu</span>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              {navItems.map((item) => {
                const isActive = currentPath === item.path;
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-gold/10 text-gold'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-border">
              <Button variant="ghost" className="w-full justify-start text-destructive" onClick={handleLogout}>
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto lg:ml-0">
        <div className="lg:hidden h-16" /> {/* Spacer for mobile header */}
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
