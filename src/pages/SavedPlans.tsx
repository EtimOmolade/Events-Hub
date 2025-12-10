import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Trash2, Eye, MessageSquare, Sparkles, ArrowLeft, Loader2, Edit } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { AIChatMessage } from '@/components/ai/AIChatMessage';

interface EventPlan {
  id: string;
  name: string;
  event_type: string | null;
  theme: string | null;
  colors: string | null;
  guest_count: number | null;
  venue: string | null;
  budget: number | null;
  event_date: string | null;
  notes: string | null;
  ai_conversation: Array<{ role: 'user' | 'assistant'; content: string }> | null;
  ai_summary: string | null;
  created_at: string | null;
}

export default function SavedPlans() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [plans, setPlans] = useState<EventPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<EventPlan | null>(null);

  useEffect(() => {
    if (user) {
      fetchPlans();
    }
  }, [user]);

  const fetchPlans = async () => {
    if (!user) return;
    
    setIsLoading(true);
    const { data, error } = await supabase
      .from('event_plans')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching plans:', error);
      toast.error('Failed to load saved plans');
      setPlans([]);
    } else {
      setPlans((data || []) as unknown as EventPlan[]);
    }
    setIsLoading(false);
  };

  const handleRemovePlan = async (planId: string) => {
    const { error } = await supabase
      .from('event_plans')
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
                Your saved event configurations and AI conversations
              </p>
            </div>
            <Link to="/planner">
              <Button variant="gold" className="gap-2">
                <Sparkles className="w-4 h-4" />
                Create New Plan
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
                Use our Event Planner to create and save your event plans
              </p>
              <Link to="/planner">
                <Button variant="gold" className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  Start Planning
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {plans.map((plan, index) => {
                const hasConversation = plan.ai_conversation && plan.ai_conversation.length > 0;

                return (
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
                          {hasConversation && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gold/20 text-gold text-xs rounded-full mb-2">
                              <MessageSquare className="w-3 h-3" />
                              AI Conversation
                            </span>
                          )}
                          <h3 className="font-display text-xl font-semibold mb-1">
                            {plan.name}
                          </h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Created {plan.created_at ? format(new Date(plan.created_at), 'MMM d, yyyy') : 'Unknown'}
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
                        {plan.event_type && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-muted rounded-full text-xs">
                            <span>🎉</span>
                            <span className="text-muted-foreground">{plan.event_type}</span>
                          </span>
                        )}
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
                        {plan.budget && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-muted rounded-full text-xs">
                            <span>💰</span>
                            <span className="text-muted-foreground">₦{plan.budget.toLocaleString()}</span>
                          </span>
                        )}
                        {plan.venue && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-muted rounded-full text-xs">
                            <span>📍</span>
                            <span className="text-muted-foreground">{plan.venue}</span>
                          </span>
                        )}
                      </div>

                      {plan.ai_summary && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {plan.ai_summary}
                        </p>
                      )}

                      {plan.notes && !plan.ai_summary && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {plan.notes}
                        </p>
                      )}

                      {/* Actions */}
                      <div className="flex gap-3">
                        {hasConversation && (
                          <Button
                            variant="outline"
                            className="flex-1 gap-2"
                            onClick={() => setSelectedPlan(plan)}
                          >
                            <Eye className="w-4 h-4" />
                            View Chat
                          </Button>
                        )}
                        <Button
                          variant="gold"
                          className="flex-1 gap-2"
                          onClick={() => navigate('/planner')}
                        >
                          <Edit className="w-4 h-4" />
                          Continue
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Conversation Dialog */}
      <Dialog open={!!selectedPlan} onOpenChange={() => setSelectedPlan(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-gold" />
              {selectedPlan?.name}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            {selectedPlan?.ai_conversation?.map((msg, i) => (
              <AIChatMessage key={i} role={msg.role} content={msg.content} />
            ))}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
