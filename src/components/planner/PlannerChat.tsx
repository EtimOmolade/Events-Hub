import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Wand2, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AIChatMessage } from '@/components/ai/AIChatMessage';
import { AIChatInput } from '@/components/ai/AIChatInput';
import { Message } from '@/hooks/useAIChat';

interface PlannerChatProps {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  onSendMessage: (message: string) => void;
  onApplyToBuilder: () => void;
  onRegenerate: () => void;
}

const quickPrompts = [
  "Help me plan a 200-guest wedding with gold and white theme",
  "Suggest vendors for a corporate conference",
  "Birthday party ideas for a 5-year-old",
  "What's the budget for a traditional wedding?",
  "Outdoor vs indoor venue recommendations",
];

export function PlannerChat({
  messages,
  isLoading,
  error,
  onSendMessage,
  onApplyToBuilder,
  onRegenerate,
}: PlannerChatProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const hasAssistantMessage = messages.some(m => m.role === 'assistant');

  return (
    <div className="flex flex-col h-full bg-card border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-rich-black" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">AI Assistant</h3>
            <p className="text-xs text-muted-foreground">Ask me anything about your event</p>
          </div>
        </div>
        {hasAssistantMessage && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRegenerate}
              disabled={isLoading}
              className="gap-1 text-xs"
            >
              <RefreshCw className="w-3 h-3" />
              Regenerate
            </Button>
            <Button
              variant="gold"
              size="sm"
              onClick={onApplyToBuilder}
              disabled={isLoading}
              className="gap-1 text-xs"
            >
              <Wand2 className="w-3 h-3" />
              Apply to Form
            </Button>
          </div>
        )}
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollRef} className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gold/20 to-gold-light/20 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-gold" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Welcome!</h3>
            <p className="text-muted-foreground text-sm mb-4 max-w-sm mx-auto">
              Tell me about your event and I'll help you plan it. Click "Apply to Form" to fill the builder automatically.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {quickPrompts.slice(0, 3).map((prompt, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  onClick={() => onSendMessage(prompt)}
                  disabled={isLoading}
                  className="text-xs"
                >
                  {prompt.slice(0, 40)}...
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="pb-4">
            {messages.map((msg, i) => (
              <AIChatMessage key={i} role={msg.role} content={msg.content} />
            ))}
            {isLoading && (
              <div className="flex gap-3 p-4">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                  <p className="text-sm text-muted-foreground">Thinking...</p>
                </div>
              </div>
            )}
          </div>
        )}
        {error && (
          <div className="px-4 py-3 mx-4 mb-4 text-sm text-destructive bg-destructive/10 rounded-lg text-center">
            {error}
          </div>
        )}
      </ScrollArea>

      {/* Quick Prompts */}
      {messages.length > 0 && messages.length < 4 && (
        <div className="px-4 pb-2">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {quickPrompts.slice(0, 3).map((prompt, i) => (
              <button
                key={i}
                onClick={() => onSendMessage(prompt)}
                disabled={isLoading}
                className="whitespace-nowrap text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors disabled:opacity-50"
              >
                {prompt.slice(0, 30)}...
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <AIChatInput
        onSend={onSendMessage}
        isLoading={isLoading}
        placeholder="Describe your dream event..."
      />
    </div>
  );
}
