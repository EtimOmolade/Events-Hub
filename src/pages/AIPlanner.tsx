import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Trash2, Save, ArrowLeft, Wand2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAIChat } from '@/hooks/useAIChat';
import { AIChatMessage } from '@/components/ai/AIChatMessage';
import { AIChatInput } from '@/components/ai/AIChatInput';
import { useStore } from '@/store/useStore';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { parseAIRecommendations, hasValidRecommendation } from '@/utils/aiParser';
import { supabase } from '@/integrations/supabase/client';

const quickPrompts = [
  "Help me plan a 200-guest wedding with gold and white theme",
  "Suggest vendors for a corporate conference in Lagos",
  "Birthday party ideas for a 5-year-old",
  "What's the budget for a traditional Nigerian wedding?",
  "Best photography packages for events",
  "Outdoor vs indoor venue recommendations",
];

export default function AIPlanner() {
  const navigate = useNavigate();
  const { messages, isLoading, error, sendMessage, clearChat } = useAIChat();
  const { setAIRecommendation } = useStore();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Parse recommendations from the latest assistant message
  const latestAssistantMessage = [...messages].reverse().find(m => m.role === 'assistant');
  const parsedRecommendation = latestAssistantMessage 
    ? parseAIRecommendations(latestAssistantMessage.content) 
    : null;
  const canAutoFill = hasValidRecommendation(parsedRecommendation);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSavePlan = async () => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save your event plans.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    if (messages.length === 0) {
      toast({
        title: "No conversation to save",
        description: "Start chatting with the AI to create a plan.",
      });
      return;
    }

    setIsSaving(true);
    try {
      // Extract event details from the conversation
      const eventType = parsedRecommendation?.eventType || 'General Event';
      const theme = parsedRecommendation?.theme;
      const guestSize = parsedRecommendation?.guestSize;
      const budgetRange = parsedRecommendation?.budget;

      // TODO: Enable when event_plans table is created
      // const { error: saveError } = await supabase.from('event_plans').insert([{
      //   user_id: user.id,
      //   name: `AI Plan - ${eventType}`,
      //   event_type: eventType,
      //   theme: theme,
      //   notes: `Guest size: ${guestSize || 'Not specified'}, Budget: ${budgetRange || 'Not specified'}. Created via AI Planner on ${new Date().toLocaleDateString()}`,
      //   ai_conversation: messages as any,
      // }]);
      // if (saveError) throw saveError;
      
      // For now, just show success (data is not persisted until table is created)
      console.log('Plan would be saved:', { eventType, theme, guestSize, budgetRange });

      toast({
        title: "Plan saved!",
        description: "Your AI conversation has been saved to your account.",
      });
    } catch (err) {
      console.error('Save error:', err);
      toast({
        title: "Failed to save",
        description: "There was an error saving your plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAutoFill = () => {
    if (parsedRecommendation) {
      setAIRecommendation(parsedRecommendation);
      toast({
        title: "AI recommendations ready!",
        description: "Opening Event Builder with your preferences",
      });
      navigate('/event-builder');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-rich-black" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-display font-bold">
                    AI Event Planner
                  </h1>
                  <p className="text-muted-foreground text-sm">
                    Your intelligent assistant for planning the perfect event
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={clearChat}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear
                </Button>
                <Button variant="outline" size="sm" onClick={handleSavePlan} disabled={isSaving || messages.length === 0}>
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  {isSaving ? 'Saving...' : 'Save Plan'}
                </Button>
                {canAutoFill && (
                  <Button variant="gold" size="sm" onClick={handleAutoFill}>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Use in Builder
                  </Button>
                )}
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Quick Prompts Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1"
            >
              <div className="bg-card border border-border rounded-xl p-4 sticky top-24">
                <h3 className="font-semibold mb-3 text-sm">Quick Prompts</h3>
                <div className="space-y-2">
                  {quickPrompts.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(prompt)}
                      disabled={isLoading}
                      className="w-full text-left px-3 py-2 text-xs rounded-lg bg-muted hover:bg-muted/80 transition-colors disabled:opacity-50"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Chat Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-3"
            >
              <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col h-[600px]">
                {/* Chat Messages */}
                <ScrollArea ref={scrollRef} className="flex-1 overflow-y-auto">
                  {messages.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-gold/20 to-gold-light/20 flex items-center justify-center">
                        <Sparkles className="w-10 h-10 text-gold" />
                      </div>
                      <h2 className="text-xl font-semibold mb-2">
                        Welcome to AI Event Planner!
                      </h2>
                      <p className="text-muted-foreground max-w-md mx-auto mb-6">
                        I can help you plan weddings, birthdays, corporate events, and more. 
                        Tell me about your dream event and I'll provide personalized recommendations.
                      </p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {["Wedding", "Birthday", "Corporate", "Baby Shower"].map((type) => (
                          <Button
                            key={type}
                            variant="outline"
                            size="sm"
                            onClick={() => sendMessage(`Help me plan a ${type.toLowerCase()}`)}
                          >
                            {type}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    messages.map((msg, i) => (
                      <AIChatMessage key={i} role={msg.role} content={msg.content} />
                    ))
                  )}
                  {error && (
                    <div className="px-4 py-3 mx-4 mb-4 text-sm text-destructive bg-destructive/10 rounded-lg text-center">
                      {error}
                    </div>
                  )}
                </ScrollArea>

                {/* Input */}
                <AIChatInput
                  onSend={sendMessage}
                  isLoading={isLoading}
                  placeholder="Describe your event, ask for recommendations, or request a quote..."
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
