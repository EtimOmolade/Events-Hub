import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Save, Plus, ArrowLeft, Loader2, MessageSquare, Settings2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlannerChat } from '@/components/planner/PlannerChat';
import { PlannerForm } from '@/components/planner/PlannerForm';
import { usePlanner } from '@/hooks/usePlanner';
import { cn } from '@/lib/utils';

export default function Planner() {
  const navigate = useNavigate();
  const [mobileTab, setMobileTab] = useState<'chat' | 'form'>('chat');
  const {
    formData,
    updateField,
    messages,
    isAILoading,
    aiError,
    sendMessage,
    clearChat,
    applyAIToForm,
    savePlan,
    startNewPlan,
    isSaving,
    currentPlanId,
    isAuthenticated,
  } = usePlanner();

  const handleSave = async () => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    await savePlan();
  };

  const handleRegenerate = () => {
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMsg) {
      sendMessage(lastUserMsg.content);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
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
                    Event Planner
                  </h1>
                  <p className="text-muted-foreground text-sm">
                    AI-assisted planning + manual customization
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={startNewPlan}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">New Plan</span>
                </Button>
                <Button
                  variant="gold"
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="gap-2"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isSaving ? 'Saving...' : currentPlanId ? 'Update' : 'Save Plan'}
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Mobile Tabs - Only visible on small screens */}
          <div className="lg:hidden mb-4">
            <Tabs value={mobileTab} onValueChange={(v) => setMobileTab(v as 'chat' | 'form')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chat" className="gap-2">
                  <MessageSquare className="w-4 h-4" />
                  AI Chat
                </TabsTrigger>
                <TabsTrigger value="form" className="gap-2">
                  <Settings2 className="w-4 h-4" />
                  Builder
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="chat" className="mt-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-[calc(100vh-280px)]"
                >
                  <PlannerChat
                    messages={messages}
                    isLoading={isAILoading}
                    error={aiError}
                    onSendMessage={sendMessage}
                    onApplyToBuilder={applyAIToForm}
                    onRegenerate={handleRegenerate}
                  />
                </motion.div>
              </TabsContent>
              
              <TabsContent value="form" className="mt-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-[calc(100vh-280px)]"
                >
                  <PlannerForm
                    formData={formData}
                    onUpdateField={updateField}
                  />
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Desktop Split View - Only visible on large screens */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
            {/* Left Panel - AI Chat */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="h-full"
            >
              <PlannerChat
                messages={messages}
                isLoading={isAILoading}
                error={aiError}
                onSendMessage={sendMessage}
                onApplyToBuilder={applyAIToForm}
                onRegenerate={handleRegenerate}
              />
            </motion.div>

            {/* Right Panel - Event Builder Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="h-full"
            >
              <PlannerForm
                formData={formData}
                onUpdateField={updateField}
              />
            </motion.div>
          </div>

          {/* Info Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 p-4 bg-muted/50 rounded-xl border border-border"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4 text-gold" />
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">How it works</h4>
                <p className="text-xs text-muted-foreground">
                  Chat with AI on the left to get personalized recommendations, then click "Apply to Form" 
                  to automatically fill the builder. You can also fill the form manually. 
                  Once you're happy with your plan, click "Save Plan" to keep it for later.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
