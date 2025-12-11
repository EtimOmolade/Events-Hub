import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Loader2, Check, X } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function Auth() {
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const navigate = useNavigate();
  const { signIn, signUp, isAuthenticated } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResendConfirmation, setShowResendConfirmation] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirect);
    }
  }, [isAuthenticated, navigate, redirect]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    // Password validation for sign up
    if (!isLogin) {
      const passwordErrors = validatePassword(formData.password);
      if (passwordErrors.length > 0) {
        toast.error(passwordErrors[0]);
        setIsLoading(false);
        return;
      }
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      if (isLogin) {
        // Login flow
        const { error } = await signIn(formData.email, formData.password);

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error("Invalid credentials. If you don't have an account, please Sign Up first.");
          } else if (error.message.includes('Email not confirmed')) {
            toast.error('Please confirm your email address before signing in. Check your inbox for a confirmation link.');
          } else {
            toast.error(error.message);
          }
          setIsLoading(false);
          return;
        }

        toast.success('Welcome back!');
        navigate(redirect);
      } else {
        // Signup flow
        const { data, error } = await signUp(formData.email, formData.password, formData.name);

        if (error) {
          if (error.message.includes('User already registered')) {
            toast.error('This email is already registered. Please sign in instead.');
          } else {
            toast.error(error.message);
          }
          setIsLoading(false);
          return;
        }

        if (data.user) {
          toast.success('Account created successfully! Please check your email to confirm your account before signing in.', {
            duration: 6000, // Show for 6 seconds to give users time to read
          });
          setIsLogin(true); // Switch to login view
        }
      }
    } catch (err) {
      toast.error('An unexpected error occurred. Please try again.');
    }

    setIsLoading(false);
  };

  // Password validation helper
  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one digit');
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one symbol');
    }

    return errors;
  };

  // Check individual password requirements
  const getPasswordRequirements = (password: string) => {
    return [
      { label: 'At least 8 characters', met: password.length >= 8 },
      { label: 'Contains a digit', met: /\d/.test(password) },
      { label: 'Contains a symbol', met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) },
    ];
  };

  // Handle forgot password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail)) {
      toast.error('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Password reset email sent! Please check your inbox.', {
          duration: 6000,
        });
        setShowForgotPassword(false);
        setResetEmail('');
      }
    } catch (err) {
      toast.error('An unexpected error occurred. Please try again.');
    }

    setIsLoading(false);
  };

  // Handle resend confirmation email
  const handleResendConfirmation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail)) {
      toast.error('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: resetEmail,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Confirmation email sent! Please check your inbox.', {
          duration: 6000,
        });
        setShowResendConfirmation(false);
        setResetEmail('');
      }
    } catch (err) {
      toast.error('An unexpected error occurred. Please try again.');
    }

    setIsLoading(false);
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
                <span className="text-rich-black font-display font-bold text-xl">E</span>
              </div>
            </Link>
            <h1 className="font-display text-3xl font-bold mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-muted-foreground">
              {isLogin
                ? 'Sign in to access your account and bookings'
                : 'Join Events Hub to start planning your perfect event'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10 h-12"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 pr-10 h-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {!isLogin && formData.password && (
                <div className="mt-2 space-y-1">
                  {getPasswordRequirements(formData.password).map((req, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      {req.met ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <X className="w-4 h-4 text-muted-foreground" />
                      )}
                      <span className={req.met ? 'text-green-500' : 'text-muted-foreground'}>
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-10 h-12"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            {isLogin && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-gold hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <Button
              type="submit"
              variant="gold"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isLogin ? (
                'Sign In'
              ) : (
                'Create Account'
              )}
            </Button>
          </form>


          {/* Toggle */}
          <p className="text-center mt-8 text-muted-foreground">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-gold font-semibold hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </motion.div>

        {/* Forgot Password Modal */}
        {showForgotPassword && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowForgotPassword(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background border border-border rounded-lg p-6 w-full max-w-md"
            >
              <h2 className="font-display text-2xl font-bold mb-2">Reset Password</h2>
              <p className="text-muted-foreground mb-6">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="resetEmail">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="resetEmail"
                      type="email"
                      placeholder="you@example.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="pl-10 h-12"
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setResetEmail('');
                    }}
                    className="flex-1"
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="gold"
                    className="flex-1"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      'Send Reset Link'
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Resend Confirmation Email Modal */}
        {showResendConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowResendConfirmation(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background border border-border rounded-lg p-6 w-full max-w-md"
            >
              <h2 className="font-display text-2xl font-bold mb-2">Resend Confirmation Email</h2>
              <p className="text-muted-foreground mb-6">
                Enter your email address and we'll send you a new confirmation email.
              </p>

              <form onSubmit={handleResendConfirmation} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="resendEmail">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="resendEmail"
                      type="email"
                      placeholder="you@example.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="pl-10 h-12"
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowResendConfirmation(false);
                      setResetEmail('');
                    }}
                    className="flex-1"
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="gold"
                    className="flex-1"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      'Resend Email'
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
