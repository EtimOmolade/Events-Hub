import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Send, Loader2, ArrowLeft, Trash2, RefreshCw } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAIChat, Message } from '@/hooks/useAIChat';
import { cn } from '@/lib/utils';

export default function AIPlanner() {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const { messages, isLoading, error, sendMessage, clearChat } = useAIChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
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
                    AI Event Planner
                  </h1>
                  <p className="text-muted-foreground text-sm">
                    Get personalized event recommendations powered by AI
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                {messages.length > 0 && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRegenerate}
                      disabled={isLoading}
                      className="gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span className="hidden sm:inline">Regenerate</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearChat}
                      className="gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Clear</span>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* Chat Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden"
          >
            {/* Messages Area */}
            <ScrollArea className="h-[calc(100vh-350px)] min-h-[400px]">
              <div className="p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-8 h-8 text-gold" />
                    </div>
                    <h3 className="font-display text-xl font-semibold mb-2">
                      Start Planning Your Event
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                      Describe your dream event and I'll help you plan every detail. 
                      Tell me about the occasion, your preferences, and budget.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {[
                        "Plan a romantic wedding for 150 guests",
                        "Birthday party for a 5-year-old",
                        "Corporate team building event",
                        "Traditional Nigerian wedding"
                      ].map((suggestion) => (
                        <Button
                          key={suggestion}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => setInput(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <MessageBubble key={index} message={message} />
                  ))
                )}
                
                {isLoading && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">AI is thinking...</span>
                  </div>
                )}
                
                {error && (
                  <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                    {error}
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t border-border p-4 bg-muted/30">
              <form onSubmit={handleSubmit} className="flex gap-3">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe your event... (e.g., 'I'm planning a wedding for 200 guests with a ₦2M budget')"
                  className="min-h-[60px] resize-none flex-1"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  variant="gold"
                  size="icon"
                  className="h-[60px] w-[60px]"
                  disabled={!input.trim() || isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </form>
            </div>
          </motion.div>

          {/* Info Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 p-4 bg-muted/50 rounded-xl border border-border"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4 text-gold" />
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Tips for best results</h4>
                <p className="text-xs text-muted-foreground">
                  Include details like event type, guest count, budget, preferred theme, and location. 
                  The more specific you are, the better recommendations you'll receive!
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3",
          isUser
            ? "bg-gold text-rich-black rounded-br-md"
            : "bg-muted border border-border rounded-bl-md"
        )}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
      </div>
    </motion.div>
  );
}
