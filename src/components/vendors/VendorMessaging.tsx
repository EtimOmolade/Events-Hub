import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { seedVendors } from '@/utils/seedVendors';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, MessageCircle, ChevronLeft, LogIn } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { VendorConversation } from '@/data/vendorData';
import { vendors } from '@/data/services';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface VendorMessagingProps {
  isOpen: boolean;
  onClose: () => void;
  initialVendorId?: string;
}

export function VendorMessaging({ isOpen, onClose, initialVendorId }: VendorMessagingProps) {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [conversations, setConversations] = useState<VendorConversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null); // This is the UUID
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hasSeeded, setHasSeeded] = useState(false);

  // 1. Seed Vendors on mount
  useEffect(() => {
    const init = async () => {
      if (!hasSeeded) {
        await seedVendors();
        setHasSeeded(true);
      }
    };
    init();
  }, [hasSeeded]);

  // 2. Handle Initial "Static" ID (e.g., 'v1') -> Resolve to UUID
  useEffect(() => {
    const resolveVendor = async () => {
      if (!initialVendorId) return;

      // If we haven't seeded yet, we might miss the vendor if the table is empty.
      // However, we initiate seeding on mount.
      // Let's try to find it.

      // Check if it's already a UUID (unlikely for now, but good practice)
      if (initialVendorId.length > 10 && initialVendorId.includes('-')) {
        setActiveConversation(initialVendorId);
        return;
      }

      // It's a static ID (v1), look up by name
      const staticVendor = vendors.find(v => v.id === initialVendorId);
      if (staticVendor) {
        // Retry logic: If seeding is running, we might need to wait a moment or just query.
        // The query itself is fine.
        const { data } = await supabase
          .from('vendors')
          .select('id')
          .eq('name', staticVendor.name)
          .single();

        if (data) {
          setActiveConversation(data.id);
        } else if (!hasSeeded) {
          // If not found AND not seeded, it might be because seeding is too slow.
          // But relies on `hasSeeded` state change to re-trigger this effect.
        }
      }
    };
    resolveVendor();
  }, [initialVendorId, hasSeeded]);

  // 3. Fetch Conversations (Messages grouped by vendor)
  useEffect(() => {
    const fetchMessages = async () => {
      if (!isAuthenticated || !user) return;

      const { data, error } = await supabase
        .from('vendor_messages')
        .select(`
          *,
          vendor:vendors(id, name, avatar)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      // Group by vendor
      // We need to map the flat list of messages into VendorConversation[]
      const grouped = new Map<string, VendorConversation>();

      data?.forEach((msg: any) => {
        const vendorId = msg.vendor.id;
        if (!grouped.has(vendorId)) {
          grouped.set(vendorId, {
            vendorId: vendorId,
            vendorName: msg.vendor.name,
            vendorAvatar: msg.vendor.avatar,
            lastMessage: '',
            lastMessageTime: '',
            unreadCount: 0,
            messages: []
          });
        }

        const conv = grouped.get(vendorId)!;
        conv.messages.push({
          id: msg.id,
          vendorId: vendorId,
          senderId: msg.sender_type, // 'user' or 'vendor'
          content: msg.message,
          timestamp: msg.created_at,
          read: msg.read
        });

        // Update last message
        conv.lastMessage = msg.message;
        conv.lastMessageTime = msg.created_at;
      });

      setConversations(Array.from(grouped.values()));
    };

    fetchMessages();

    // Optional: Subscribe to realtime changes here
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'vendor_messages',
          filter: `user_id=eq.${user?.id}`,
        },
        (payload) => {
          // Simplest approach: refetch
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };

  }, [isAuthenticated, user, hasSeeded]);

  const activeConvo = conversations.find(c => c.vendorId === activeConversation);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConvo?.messages]);

  const handleSignIn = () => {
    onClose();
    navigate('/auth');
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeConversation || !user) return;

    if (!isAuthenticated) {
      toast.error('Please sign in to send messages');
      return;
    }

    try {
      const { error } = await supabase
        .from('vendor_messages')
        .insert({
          vendor_id: activeConversation,
          user_id: user.id,
          sender_type: 'user',
          message: newMessage.trim(),
          read: true // User's own message is read
        });

      if (error) throw error;

      setNewMessage('');
      // Optimistic update could happen here, but Realtime/Fetch handles it

    } catch (err) {
      console.error('Failed to send message:', err);
      toast.error('Failed to send message');
    }
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
                      src={conv.vendorAvatar || ''}
                      alt={conv.vendorName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{conv.vendorName}</h4>
                        <span className="text-xs text-muted-foreground">
                          {conv.lastMessageTime ? format(new Date(conv.lastMessageTime), 'MMM d') : ''}
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
