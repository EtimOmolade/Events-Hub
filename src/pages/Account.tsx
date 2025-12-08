import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  User, 
  Mail, 
  Phone, 
  Camera,
  Calendar,
  Bookmark,
  Bell,
  Moon,
  Sun,
  LogOut,
  Shield,
  ChevronRight,
  Edit2,
  Save,
  X,
  Sparkles,
  ArrowLeft,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useTheme } from '@/hooks/useTheme';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Helper function to obfuscate email
const obfuscateEmail = (email: string): string => {
  if (!email || !email.includes('@')) return email;
  const [localPart, domain] = email.split('@');
  const visibleChars = Math.min(5, localPart.length);
  const maskedLocal = localPart.slice(0, visibleChars) + '***';
  return `${maskedLocal}@${domain}`;
};

// Helper function to get display name
const getDisplayName = (user: { name?: string; email?: string } | null): string => {
  if (!user) return 'User';
  // If name exists and is not the same as email, use it
  if (user.name && user.name !== user.email) {
    return user.name;
  }
  // Otherwise fallback to "User"
  return 'User';
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const quickLinks = [
  {
    icon: Calendar,
    title: 'Booking History',
    description: 'View all your past and upcoming bookings',
    href: '/bookings',
    color: 'bg-blue-500/10 text-blue-500'
  },
  {
    icon: Bookmark,
    title: 'Saved Event Plans',
    description: 'Access your saved event configurations',
    href: '/saved-plans',
    color: 'bg-purple-500/10 text-purple-500'
  },
  {
    icon: Sparkles,
    title: 'Event Builder',
    description: 'Create a new custom event package',
    href: '/event-builder',
    color: 'bg-gold/10 text-gold'
  }
];

export default function Account() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdminAuthenticated, logout } = useStore();
  const { theme, toggleTheme } = useTheme();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      if (user) {
        setProfileData({
          name: user.name || '',
          email: user.email || '',
          phone: ''
        });
      }
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [user]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    // Here you would typically save to backend
    toast.success('Profile updated successfully!');
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handlePasswordChange = async () => {
    setPasswordError('');
    
    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('All fields are required');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    try {
      // First verify current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: passwordData.currentPassword
      });

      if (signInError) {
        setPasswordError('Current password is incorrect');
        return;
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (updateError) {
        setPasswordError(updateError.message);
        return;
      }

      toast.success('Password changed successfully!');
      setIsChangingPassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setPasswordError('An error occurred. Please try again.');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Header Skeleton */}
            <div className="flex items-center gap-6">
              <Skeleton className="w-24 h-24 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="w-48 h-8" />
                <Skeleton className="w-32 h-4" />
              </div>
            </div>
            
            {/* Cards Skeleton */}
            <div className="grid md:grid-cols-2 gap-6">
              <Skeleton className="h-64" />
              <Skeleton className="h-64" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-background py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* Profile Header */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-border/50 shadow-card overflow-hidden">
                <div className="h-24 bg-gradient-to-r from-gold/20 via-primary/20 to-gold/20" />
                <CardContent className="pt-0 pb-6 px-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12">
                    {/* Avatar */}
                    <div className="relative">
                      <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                        <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="bg-gold text-rich-black text-2xl font-display font-bold">
                          {getInitials(getDisplayName(user))}
                        </AvatarFallback>
                      </Avatar>
                      <button 
                        className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-gold text-rich-black flex items-center justify-center shadow-lg hover:bg-gold-light transition-colors"
                        onClick={() => toast.info('Photo upload coming soon!')}
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Name & Role */}
                    <div className="flex-1 pt-4 sm:pt-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h1 className="font-display text-2xl font-bold">{getDisplayName(user)}</h1>
                        {isAdminAuthenticated && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold/10 text-gold text-xs font-medium">
                            <Shield className="w-3 h-3" />
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm">{obfuscateEmail(user?.email || '')}</p>
                    </div>
                    
                    {/* Edit Button */}
                    <Button
                      variant={isEditing ? 'outline' : 'gold'}
                      size="sm"
                      onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
                      className="gap-2"
                    >
                      {isEditing ? (
                        <>
                          <X className="w-4 h-4" />
                          Cancel
                        </>
                      ) : (
                        <>
                          <Edit2 className="w-4 h-4" />
                          Edit Profile
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="md:col-span-2 space-y-6">
                {/* Profile Details */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                >
                  <Card className="border-border/50 shadow-card">
                    <CardHeader>
                      <CardTitle className="font-display flex items-center gap-2">
                        <User className="w-5 h-5 text-gold" />
                        Profile Details
                      </CardTitle>
                      <CardDescription>
                        Manage your personal information
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={profileData.name}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={!isEditing ? 'bg-muted/50' : ''}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={profileData.email}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={!isEditing ? 'bg-muted/50' : ''}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={profileData.phone}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder={isEditing ? '+234 xxx xxx xxxx' : 'Not set'}
                          className={!isEditing ? 'bg-muted/50' : ''}
                        />
                      </div>

                      {isEditing && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <Button 
                            variant="gold" 
                            className="w-full gap-2"
                            onClick={handleSaveProfile}
                          >
                            <Save className="w-4 h-4" />
                            Save Changes
                          </Button>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Preferences */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <Card className="border-border/50 shadow-card">
                    <CardHeader>
                      <CardTitle className="font-display">Preferences</CardTitle>
                      <CardDescription>
                        Customize your app experience
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Notifications */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <Bell className="w-5 h-5 text-blue-500" />
                          </div>
                          <div>
                            <p className="font-medium">Notifications</p>
                            <p className="text-sm text-muted-foreground">Receive booking updates & promotions</p>
                          </div>
                        </div>
                        <Switch
                          checked={notifications}
                          onCheckedChange={setNotifications}
                        />
                      </div>

                      <Separator />

                      {/* Theme Toggle */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                            {theme === 'dark' ? (
                              <Moon className="w-5 h-5 text-purple-500" />
                            ) : (
                              <Sun className="w-5 h-5 text-purple-500" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">Dark Mode</p>
                            <p className="text-sm text-muted-foreground">Switch between light and dark theme</p>
                          </div>
                        </div>
                        <Switch
                          checked={theme === 'dark'}
                          onCheckedChange={toggleTheme}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Password Change */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <Card className="border-border/50 shadow-card">
                    <CardHeader>
                      <CardTitle className="font-display flex items-center gap-2">
                        <Lock className="w-5 h-5 text-gold" />
                        Security
                      </CardTitle>
                      <CardDescription>
                        Manage your password
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      {!isChangingPassword ? (
                        <Button
                          variant="outline"
                          className="w-full gap-2"
                          onClick={() => setIsChangingPassword(true)}
                        >
                          <Lock className="w-4 h-4" />
                          Change Password
                        </Button>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="space-y-4"
                        >
                          {passwordError && (
                            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                              {passwordError}
                            </div>
                          )}
                          
                          <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <div className="relative">
                              <Input
                                id="currentPassword"
                                type={showCurrentPassword ? 'text' : 'password'}
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                placeholder="Enter current password"
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              >
                                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <div className="relative">
                              <Input
                                id="newPassword"
                                type={showNewPassword ? 'text' : 'password'}
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                placeholder="Enter new password"
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                              >
                                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <div className="relative">
                              <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                placeholder="Confirm new password"
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              className="flex-1"
                              onClick={() => {
                                setIsChangingPassword(false);
                                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                setPasswordError('');
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="gold"
                              className="flex-1 gap-2"
                              onClick={handlePasswordChange}
                            >
                              <Save className="w-4 h-4" />
                              Update Password
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Links */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <Card className="border-border/50 shadow-card">
                    <CardHeader className="pb-3">
                      <CardTitle className="font-display text-lg">Quick Access</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {quickLinks.map((link, index) => (
                        <Link key={link.href} to={link.href}>
                          <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group"
                          >
                            <div className={`w-10 h-10 rounded-lg ${link.color} flex items-center justify-center`}>
                              <link.icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{link.title}</p>
                              <p className="text-xs text-muted-foreground truncate">{link.description}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                          </motion.div>
                        </Link>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Admin Access */}
                {isAdminAuthenticated && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <Card className="border-gold/30 bg-gold/5 shadow-card">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-gold" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm">Admin Mode</p>
                            <p className="text-xs text-muted-foreground">You have admin privileges</p>
                          </div>
                        </div>
                        <Link to="/admin">
                          <Button variant="gold" size="sm" className="w-full gap-2">
                            Go to Admin Panel
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Logout */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <Card className="border-border/50 shadow-card">
                    <CardContent className="p-4">
                      <Button 
                        variant="outline" 
                        className="w-full gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
