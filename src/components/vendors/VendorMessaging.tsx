import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, MessageCircle, ChevronLeft, LogIn } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { VendorConversation, VendorMessage, sampleConversations } from '@/data/vendorData';
import { vendors } from '@/data/services';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface VendorMessagingProps {
  isOpen: boolean;
  onClose: () => void;
  initialVendorId?: string;
}

export function VendorMessaging({ isOpen, onClose, initialVendorId }: VendorMessagingProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useStore();
  const [conversations, setConversations] = useState<VendorConversation[]>(sampleConversations);
  const [activeConversation, setActiveConversation] = useState<string | null>(initialVendorId || null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConvo = conversations.find(c => c.vendorId === activeConversation);

  useEffect(() => {
    if (initialVendorId) {
      setActiveConversation(initialVendorId);
      
      // If no existing conversation, create a new one
      if (!conversations.find(c => c.vendorId === initialVendorId)) {
        const vendor = vendors.find(v => v.id === initialVendorId);
        if (vendor) {
          setConversations(prev => [...prev, {
            vendorId: vendor.id,
            vendorName: vendor.name,
            vendorAvatar: vendor.avatar,
            lastMessage: '',
            lastMessageTime: new Date().toISOString(),
            unreadCount: 0,
            messages: [],
          }]);
        }
      }
    }
  }, [initialVendorId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConvo?.messages]);

  const handleSignIn = () => {
    onClose();
    navigate('/auth');
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeConversation) return;
    
    if (!isAuthenticated) {
      toast.error('Please sign in to send messages');
      return;
    }

    const message: VendorMessage = {
      id: `m-${Date.now()}`,
      vendorId: activeConversation,
      senderId: 'user',
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: true,
    };

    setConversations(prev => prev.map(conv => {
      if (conv.vendorId === activeConversation) {
        return {
          ...conv,
          messages: [...conv.messages, message],
          lastMessage: newMessage,
          lastMessageTime: message.timestamp,
        };
      }
      return conv;
    }));

    setNewMessage('');
    
    // Simulate vendor response
    setTimeout(() => {
      const responses = [
        "Thank you for your message! I'll get back to you shortly.",
        "That sounds great! Let me check my schedule.",
        "Absolutely! I'd love to discuss this further.",
        "Perfect! I'll prepare a quote for you.",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const vendorMessage: VendorMessage = {
        id: `m-${Date.now()}`,
        vendorId: activeConversation,
        senderId: 'vendor',
        content: randomResponse,
        timestamp: new Date().toISOString(),
        read: false,
      };

      setConversations(prev => prev.map(conv => {
        if (conv.vendorId === activeConversation) {
          return {
            ...conv,
            messages: [...conv.messages, vendorMessage],
            lastMessage: randomResponse,
            lastMessageTime: vendorMessage.timestamp,
            unreadCount: 1,
          };
        }
        return conv;
      }));

      toast.info('New message received!');
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 bottom-0 w-full md:w-[400px] lg:w-[450px] bg-card border-l border-border shadow-elevated"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              {activeConversation && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setActiveConversation(null)}
                  className="md:hidden"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
              )}
              <MessageCircle className="w-5 h-5 text-gold" />
              <h2 className="font-display text-lg font-semibold">
                {activeConvo ? activeConvo.vendorName : 'Messages'}
              </h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          {!activeConversation ? (
            // Conversation List
            <div className="h-[calc(100%-65px)] overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <MessageCircle className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-2">No conversations yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Start a conversation with a vendor from their profile page
                  </p>
                </div>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.vendorId}
                    onClick={() => setActiveConversation(conv.vendorId)}
                    className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors border-b border-border"
                  >
                    <img
                      src={conv.vendorAvatar}
                      alt={conv.vendorName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{conv.vendorName}</h4>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(conv.lastMessageTime), 'MMM d')}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {conv.lastMessage || 'Start a conversation...'}
                      </p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-gold text-rich-black text-xs flex items-center justify-center font-semibold">
                        {conv.unreadCount}
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          ) : (
            // Active Conversation
            <div className="flex flex-col h-[calc(100%-65px)]">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {activeConvo?.messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex",
                      msg.senderId === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-4 py-2",
                        msg.senderId === 'user'
                          ? "bg-gold text-rich-black rounded-br-md"
                          : "bg-muted rounded-bl-md"
                      )}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className={cn(
                        "text-[10px] mt-1",
                        msg.senderId === 'user' ? "text-rich-black/60" : "text-muted-foreground"
                      )}>
                        {format(new Date(msg.timestamp), 'h:mm a')}
                      </p>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border">
                {isAuthenticated ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex items-center gap-2"
                  >
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1"
                    />
                    <Button type="submit" variant="gold" size="icon" disabled={!newMessage.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                ) : (
                  <div className="flex items-center gap-3">
                    <p className="text-sm text-muted-foreground flex-1">Sign in to send messages</p>
                    <Button variant="gold" onClick={handleSignIn} className="gap-2">
                      <LogIn className="w-4 h-4" />
                      Sign In
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
