import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Trash2, Sparkles, ArrowLeft, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface AIPlan {
  id: string;
  raw_query: string;
  ai_summary: string | null;
  event_type: string | null;
  theme: string | null;
  color_palette: string | null;
  guest_count: number | null;
  venue_type: string | null;
  budget_range: string | null;
  created_at: string;
}

export default function SavedPlans() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [plans, setPlans] = useState<AIPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPlans();
    }
  }, [user]);

  const fetchPlans = async () => {
    if (!user) return;
    
    setIsLoading(true);
    const { data, error } = await supabase
      .from('ai_plans')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching plans:', error);
      toast.error('Failed to load saved plans');
      setPlans([]);
    } else {
      setPlans(data || []);
    }
    setIsLoading(false);
  };

  const handleRemovePlan = async (planId: string) => {
    const { error } = await supabase
      .from('ai_plans')
      .delete()
      .eq('id', planId);

    if (error) {
      toast.error('Failed to delete plan');
    } else {
      setPlans(plans.filter(p => p.id !== planId));
      toast.success('Plan removed');
    }
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <Sparkles className="w-16 h-16 text-gold mx-auto mb-4" />
            <h1 className="font-display text-2xl font-semibold mb-2">
              Sign in to view saved plans
            </h1>
            <p className="text-muted-foreground mb-6">
              Create an account to save and manage your event plans
            </p>
            <Link to="/auth">
              <Button variant="gold">Sign In</Button>
            </Link>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-4 gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8 flex-wrap gap-4"
          >
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
                Saved Event Plans
              </h1>
              <p className="text-muted-foreground">
                Your saved AI planning conversations
              </p>
            </div>
            <Link to="/ai-planner">
              <Button variant="gold" className="gap-2">
                <Sparkles className="w-4 h-4" />
                New AI Plan
              </Button>
            </Link>
          </motion.div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-gold" />
            </div>
          ) : plans.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <Sparkles className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="font-display text-xl font-semibold mb-2">
                No saved plans yet
              </h2>
              <p className="text-muted-foreground mb-6">
                Use our AI Planner to create and save your event plans
              </p>
              <Link to="/ai-planner">
                <Button variant="gold" className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  Start Planning
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Header */}
                  <div className="p-6 border-b border-border bg-gradient-to-r from-gold/10 to-transparent">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-display text-xl font-semibold mb-1 line-clamp-1">
                          {plan.event_type || 'Event Plan'}
                        </h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Created {format(new Date(plan.created_at), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemovePlan(plan.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-6 space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {plan.theme && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-muted rounded-full text-xs">
                          <span>🎨</span>
                          <span className="text-muted-foreground">{plan.theme}</span>
                        </span>
                      )}
                      {plan.guest_count && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-muted rounded-full text-xs">
                          <span>👥</span>
                          <span className="text-muted-foreground">{plan.guest_count} guests</span>
                        </span>
                      )}
                      {plan.budget_range && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-muted rounded-full text-xs">
                          <span>💰</span>
                          <span className="text-muted-foreground">{plan.budget_range}</span>
                        </span>
                      )}
                      {plan.venue_type && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-muted rounded-full text-xs">
                          <span>📍</span>
                          <span className="text-muted-foreground">{plan.venue_type}</span>
                        </span>
                      )}
                    </div>

                    {plan.ai_summary && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {plan.ai_summary}
                      </p>
                    )}

                    {plan.raw_query && !plan.ai_summary && (
                      <p className="text-sm text-muted-foreground line-clamp-2 italic">
                        "{plan.raw_query}"
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
