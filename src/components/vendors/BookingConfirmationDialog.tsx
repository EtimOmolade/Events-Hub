import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, Mail, Phone, FileText, Loader2, CheckCircle, Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface BookingConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  vendorName: string;
  vendorId: string;
  selectedDate: Date;
  userEmail?: string;
  userName?: string;
  onBookingSuccess?: () => void;
}

const eventTypes = [
  'Wedding',
  'Birthday Party',
  'Corporate Event',
  'Anniversary',
  'Engagement',
  'Traditional Ceremony',
  'Baby Shower',
  'Graduation',
  'Other'
];

export function BookingConfirmationDialog({
  isOpen,
  onClose,
  vendorName,
  vendorId,
  selectedDate,
  userEmail = '',
  userName = '',
  onBookingSuccess
}: BookingConfirmationDialogProps) {
  const [formData, setFormData] = useState({
    name: userName,
    email: userEmail,
    phone: '',
    eventType: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.eventType) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Get current user
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error('You must be logged in to confirm a booking');
        return;
      }

      // 2. Insert into bookings table directly
      const { error: bookingError } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          event_type: formData.eventType,
          event_date: format(selectedDate, 'yyyy-MM-dd'),
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          notes: formData.notes,
          status: 'pending',
          total_amount: 0
        });

      if (bookingError) throw bookingError;

      // 3. Initiate Conversation (Auto-send message)
      const { data: vendorData } = await supabase
        .from('vendors')
        .select('id')
        .eq('name', vendorName)
        .single();

      if (vendorData) {
        const messageContent = `Hi, I requested a booking for ${format(selectedDate, 'MMMM d, yyyy')} (${formData.eventType}). ${formData.notes ? `\n\nNote: ${formData.notes}` : ''}`;

        await supabase
          .from('vendor_messages')
          .insert({
            vendor_id: vendorData.id,
            user_id: user.id,
            sender_type: 'user',
            message: messageContent,
            read: true
          });
      }

      setIsSuccess(true);
      toast.success('Booking request sent & Message sent!', {
        description: 'You can continue the conversation in the messages tab.'
      });

      // Reset after showing success
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({ name: userName, email: userEmail, phone: '', eventType: '', notes: '' });

        if (onBookingSuccess) {
          onBookingSuccess();
        } else {
          onClose();
        }
      }, 1500);

    } catch (error: any) {
      console.error('Booking error:', error);
      toast.error('Failed to save booking', {
        description: error.message || 'Please try again later'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => !isSubmitting && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        {isSuccess ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center py-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4"
            >
              <CheckCircle className="w-10 h-10 text-emerald-500" />
            </motion.div>
            <h3 className="text-xl font-display font-semibold mb-2">Booking Request Sent!</h3>
            <p className="text-muted-foreground">Check your email for confirmation details.</p>
          </motion.div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold" />
                Complete Your Booking
              </DialogTitle>
              <DialogDescription>
                Booking <span className="font-semibold text-foreground">{vendorName}</span> for{' '}
                <span className="font-semibold text-foreground">{format(selectedDate, 'MMMM d, yyyy')}</span>
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+234 xxx xxx xxxx"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventType" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    Event Type *
                  </Label>
                  <Select
                    value={formData.eventType}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, eventType: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  Additional Notes
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any special requirements or details about your event..."
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="gold"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Confirm Booking'
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
