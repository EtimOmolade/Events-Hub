import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Minimize2, Wand2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAIChat } from '@/hooks/useAIChat';
import { AIChatMessage } from './AIChatMessage';
import { AIChatInput } from './AIChatInput';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useStore } from '@/store/useStore';
import { parseAIRecommendations, hasValidRecommendation } from '@/utils/aiParser';
import { toast } from 'sonner';

export function FloatingAIWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, isLoading, error, sendMessage, clearChat } = useAIChat();
  const { setAIRecommendation } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Parse recommendations from the latest assistant message
  const latestAssistantMessage = [...messages].reverse().find(m => m.role === 'assistant');
  const parsedRecommendation = latestAssistantMessage 
    ? parseAIRecommendations(latestAssistantMessage.content) 
    : null;
  const canAutoFill = hasValidRecommendation(parsedRecommendation);

  const handleAutoFill = () => {
    if (parsedRecommendation) {
      setAIRecommendation(parsedRecommendation);
      setIsOpen(false);
      toast.success('AI recommendations ready!', {
        description: 'Opening Event Builder with your preferences',
      });
      navigate('/event-builder');
    }
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              variant="gold"
              size="lg"
              className="rounded-full h-14 w-14 shadow-lg shadow-gold/30 hover:shadow-gold/50 transition-shadow"
            >
              <Sparkles className="w-6 h-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] h-[520px] max-h-[80vh] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-rich-black" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">AI Event Planner</h3>
                  <p className="text-xs text-muted-foreground">Your personal assistant</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsOpen(false)}
                >
                  <Minimize2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => { clearChat(); setIsOpen(false); }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea ref={scrollRef} className="flex-1 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gold/20 to-gold-light/20 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-gold" />
                  </div>
                  <h4 className="font-semibold mb-2">Hi there! 👋</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    I'm your AI Event Planner. Tell me about your dream event and I'll help you make it happen!
                  </p>
                  <div className="space-y-2">
                    {[
                      "Plan a 200-guest wedding",
                      "Birthday party ideas",
                      "Corporate event budget",
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => sendMessage(suggestion)}
                        className="block w-full text-left px-3 py-2 text-sm rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <AIChatMessage key={i} role={msg.role} content={msg.content} />
                ))
              )}
              {error && (
                <div className="px-4 py-2 text-sm text-destructive text-center">
                  {error}
                </div>
              )}
            </ScrollArea>

            {/* Auto-fill Button */}
            {canAutoFill && (
              <div className="px-4 py-2 border-t border-border bg-gold/5">
                <Button
                  onClick={handleAutoFill}
                  variant="gold"
                  size="sm"
                  className="w-full gap-2"
                >
                  <Wand2 className="w-4 h-4" />
                  Auto-fill Event Builder
                </Button>
              </div>
            )}

            {/* Input */}
            <AIChatInput onSend={sendMessage} isLoading={isLoading} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
