import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import confetti from 'canvas-confetti';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDays, MapPin, Users, Wallet, CreditCard, Building, Loader2, Check, Sparkles, Heart, FileText } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useStore, Booking } from '@/store/useStore';
import { useAuth } from '@/hooks/useAuth';
import { formatPrice } from '@/data/services';
import { toast } from 'sonner';
import { ReceiptModal } from '@/components/receipt/ReceiptModal';
import { ReceiptData } from '@/components/receipt/Receipt';
import { createReceipt } from '@/utils/receiptUtils';

const eventTypes = [
  'Wedding',
  'Birthday Party',
  'Corporate Event',
  'Baby Shower',
  'Concert',
  'Anniversary',
  'Other',
];

// Map Event Builder IDs to Checkout display names
const eventTypeIdToName: Record<string, string> = {
  'wedding': 'Wedding',
  'birthday': 'Birthday Party',
  'corporate': 'Corporate Event',
  'baby-shower': 'Baby Shower',
  'concert': 'Concert',
  'anniversary': 'Anniversary',
};

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, removeFromCart, addBooking } = useStore();
  const { user, isAuthenticated } = useAuth();

  // Get selected items and event type from navigation state
  const selectedServiceIds = location.state?.selectedServiceIds as string[] | undefined;
  const builderState = location.state?.builderState;
  const navigationEventType = location.state?.eventType as string | undefined;

  const checkoutItems = selectedServiceIds
    ? cart.filter(item => selectedServiceIds.includes(item.service.id))
    : cart;

  // Get event type from navigation state OR from cart items
  const builderEventType = builderState?.eventType;
  const cartEventType = checkoutItems.find(item => item.eventType)?.eventType;
  const rawEventType = builderEventType || navigationEventType || cartEventType || '';

  // Convert Event Builder ID to display name
  const preselectedEventType = eventTypeIdToName[rawEventType] || rawEventType;

  console.log('Checkout: Navigation event type:', navigationEventType);
  console.log('Checkout: Cart event type:', cartEventType);
  console.log('Checkout: Raw event type:', rawEventType);
  console.log('Checkout: Final event type (mapped):', preselectedEventType);

  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);

  // Also check cart items for event information (for services added directly)
  const cartItemWithEventInfo = checkoutItems.find(item => item.eventType || item.eventDate || item.notes);

  console.log('Checkout: Cart item with event info:', cartItemWithEventInfo);

  // Parse event metadata from cart item notes if available
  const parseEventMetadata = (notes: string | undefined) => {
    if (!notes || !notes.includes('Event Builder:')) return null;

    const guestSizeMatch = notes.match(/Guest Size - ([^,]+)/);
    const venueMatch = notes.match(/Venue - ([^,]+)/);
    const budgetMatch = notes.match(/Budget - ([^,]+)/);

    return {
      guestSize: guestSizeMatch ? guestSizeMatch[1].trim() : null,
      venueType: venueMatch ? venueMatch[1].trim() : null,
      budget: budgetMatch ? budgetMatch[1].trim() : null,
    };
  };

  const parsedMetadata = parseEventMetadata(cartItemWithEventInfo?.notes);
  console.log('Checkout: Parsed metadata from cart:', parsedMetadata);

  // Map guest size to approximate guest count
  const guestSizeToCount: Record<string, string> = {
    'intimate': '50',
    'medium': '100',
    'large': '200',
    'grand': '500',
  };

  // Map budget ranges to midpoint values
  const budgetToValue: Record<string, string> = {
    'budget-friendly': '500000',
    'moderate': '1500000',
    'luxury': '5000000',
    'ultra-luxury': '10000000',
  };

  // Map venue types to venue names
  const venueTypeToName: Record<string, string> = {
    'outdoor': 'Outdoor Venue',
    'indoor': 'Indoor Venue',
    'garden': 'Garden Venue',
    'ballroom': 'Ballroom',
    'beach': 'Beach Venue',
    'home': 'Private Residence',
  };

  const [formData, setFormData] = useState({
    eventType: preselectedEventType,
    eventDate: cartItemWithEventInfo?.eventDate || '',
    venue: (builderState?.venueType ? venueTypeToName[builderState.venueType] : null) ||
      (parsedMetadata?.venueType && parsedMetadata.venueType !== 'Not specified' ? venueTypeToName[parsedMetadata.venueType] : null) || '',
    guestCount: (builderState?.guestSize ? guestSizeToCount[builderState.guestSize] : null) ||
      (parsedMetadata?.guestSize && parsedMetadata.guestSize !== 'Not specified' ? guestSizeToCount[parsedMetadata.guestSize] : null) || '',
    budget: (builderState?.budget ? budgetToValue[builderState.budget] : null) ||
      (parsedMetadata?.budget && parsedMetadata.budget !== 'Not specified' ? budgetToValue[parsedMetadata.budget] : null) || '',
    notes: cartItemWithEventInfo?.notes || (builderState ? `Theme: ${builderState.theme || 'Not specified'}, Color Palette: ${builderState.colorPalette || 'Not specified'}` : ''),
    customerName: user?.user_metadata?.full_name || '',
    customerEmail: user?.email || '',
    customerPhone: '',
    paymentMethod: 'card',
  });

  // Redirect if no items to checkout
  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    } else if (checkoutItems.length === 0) {
      // If we have items in cart but none selected for checkout (and we are here), redirect
      navigate('/cart');
    }
  }, [cart, checkoutItems, navigate]);

  // Update form data when user loads
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        customerName: user.user_metadata?.full_name || prev.customerName,
        customerEmail: user.email || prev.customerEmail,
      }));
    }
  }, [user]);

  // Calculate totals based on CHECKOUT items only
  const total = checkoutItems.reduce((sum, item) => sum + (item.service.price * item.quantity), 0);
  const serviceFee = Math.round(total * 0.05);
  const grandTotal = total + serviceFee;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmitDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.eventType || !formData.eventDate || !formData.venue) {
      toast.error('Please fill in all required fields');
      return;
    }
    setStep('payment');
  };

  const fireConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const animate = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#D4AF37', '#FFD700', '#FFA500', '#FF6347', '#FF1493']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#D4AF37', '#FFD700', '#FFA500', '#FF6347', '#FF1493']
      });

      if (Date.now() < end) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !user) {
      toast.error('Please sign in to complete your booking');
      navigate('/auth');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Insert booking into Supabase
    const { data: bookingData, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        event_type: formData.eventType,
        event_date: formData.eventDate,
        venue: formData.venue,
        budget: parseInt(formData.budget) || grandTotal,
        guest_count: parseInt(formData.guestCount) || 0,
        status: 'pending',
        total_amount: grandTotal,
        customer_name: formData.customerName,
        customer_email: formData.customerEmail,
        customer_phone: formData.customerPhone,
        notes: formData.notes
      })
      .select()
      .single();

    if (bookingError) {
      console.error('Error creating booking:', bookingError);
      toast.error('Failed to create booking. Please try again.');
      setIsProcessing(false);
      return;
    }

    const bookingId = bookingData.id;

    // Create booking items from CHECKOUT ITEMS
    const bookingItems = checkoutItems.map(item => ({
      booking_id: bookingId,
      service_name: item.service.name,
      quantity: item.quantity,
      unit_price: item.service.price,
    }));

    const { error: itemsError } = await supabase
      .from('booking_items')
      .insert(bookingItems);

    if (itemsError) {
      console.error('Error creating booking items:', itemsError);
    }

    // Keep local store in sync
    const booking: Booking = {
      id: bookingId,
      services: checkoutItems,
      eventType: formData.eventType,
      eventDate: formData.eventDate,
      venue: formData.venue,
      budget: parseInt(formData.budget) || grandTotal,
      guestCount: parseInt(formData.guestCount) || 0,
      status: 'pending',
      totalAmount: grandTotal,
      createdAt: new Date().toISOString(),
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,
    };

    addBooking(booking);

    // Create receipt items from CHECKOUT ITEMS
    const receiptItems = checkoutItems.map(item => ({
      name: item.service.name,
      quantity: item.quantity,
      unitPrice: item.service.price,
      total: item.service.price * item.quantity,
      vendorName: item.service.vendorName,
      category: item.service.category,
    }));

    console.log('Creating receipt with data:', {
      userId: user.id,
      bookingId: bookingId,
      itemsCount: receiptItems.length,
      totalAmount: grandTotal
    });

    // Create receipt in database
    const { data: newReceipt, error } = await createReceipt({
      userId: user.id,
      bookingId: bookingId,
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      eventType: formData.eventType,
      eventDate: formData.eventDate,
      venue: formData.venue,
      paymentMethod: formData.paymentMethod,
      subtotal: total,
      serviceFee: serviceFee,
      vatAmount: 0,
      discountAmount: 0,
      totalAmount: grandTotal,
      items: receiptItems,
    });

    if (error) {
      console.error('Failed to create receipt:', error);
      toast.error('Payment successful, but receipt generation failed. Please contact support.');

      // Still show confetti and clear cart even if receipt fails
      checkoutItems.forEach(item => removeFromCart(item.service.id));
      setIsProcessing(false);
      fireConfetti();
    } else if (newReceipt) {
      console.log('Receipt created successfully:', newReceipt.id);
      setReceiptData(newReceipt);

      // Remove purchased items from cart
      checkoutItems.forEach(item => removeFromCart(item.service.id));
      setIsProcessing(false);

      // Fire confetti celebration
      fireConfetti();

      // Show receipt modal - use a small delay to ensure state updates
      setTimeout(() => {
        console.log('Showing receipt modal with data:', newReceipt.id);
        setShowReceiptModal(true);
      }, 100);
    } else {
      console.warn('Receipt creation returned no data and no error');

      // Still complete the checkout flow
      checkoutItems.forEach(item => removeFromCart(item.service.id));
      setIsProcessing(false);
      fireConfetti();
    }
  };

  const handleViewReceipt = () => {
    if (receiptData) {
      navigate(`/receipt/${receiptData.id}`);
    }
  };

  const handleContinue = () => {
    setShowReceiptModal(false);
    setStep('success');
  };

  if (step === 'success') {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto"
          >
            <div className="w-24 h-24 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-6">
              <Check className="w-12 h-12 text-gold" />
            </div>
            <h1 className="font-display text-3xl font-bold mb-4">Booking Confirmed!</h1>
            <p className="text-muted-foreground mb-8">
              Your booking has been successfully placed. You will receive a confirmation email shortly.
            </p>
            {receiptData && (
              <div className="p-4 bg-card rounded-xl border mb-4 text-left">
                <p className="text-sm text-muted-foreground mb-1">Receipt Number</p>
                <p className="font-display text-xl font-bold text-gold">{receiptData.receiptNumber}</p>
              </div>
            )}
            <div className="flex flex-col gap-3">
              {receiptData && (
                <Button variant="outline" size="lg" onClick={handleViewReceipt} className="gap-2">
                  <FileText className="w-4 h-4" />
                  View Receipt
                </Button>
              )}
              <Button variant="gold" size="lg" onClick={() => navigate('/bookings')}>
                View My Bookings
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/services')}>
                Continue Shopping
              </Button>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      {/* Receipt Modal */}
      <ReceiptModal
        open={showReceiptModal}
        onOpenChange={setShowReceiptModal}
        receiptData={receiptData}
        onViewReceipt={handleViewReceipt}
        onContinue={handleContinue}
      />

      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">
            Complete Your <span className="text-gold">Booking</span>
          </h1>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className={`flex items-center gap-2 ${step === 'details' ? 'text-gold' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 'details' ? 'bg-gold text-rich-black' : 'bg-muted'
                }`}>
                1
              </div>
              <span className="hidden sm:inline">Event Details</span>
            </div>
            <div className="w-12 h-0.5 bg-border" />
            <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-gold' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 'payment' ? 'bg-gold text-rich-black' : 'bg-muted'
                }`}>
                2
              </div>
              <span className="hidden sm:inline">Payment</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              {step === 'details' && (
                <motion.form
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onSubmit={handleSubmitDetails}
                  className="space-y-6"
                >
                  <div className="p-6 bg-card rounded-xl border">
                    <h2 className="font-display text-xl font-semibold mb-6">Event Information</h2>
                    <div className="grid gap-6">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="eventType">Event Type *</Label>
                          <Select
                            value={formData.eventType}
                            onValueChange={(v) => handleSelectChange('eventType', v)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select event type" />
                            </SelectTrigger>
                            <SelectContent>
                              {eventTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="eventDate">Event Date *</Label>
                          <div className="relative">
                            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                              id="eventDate"
                              name="eventDate"
                              type="date"
                              value={formData.eventDate}
                              onChange={handleChange}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="venue">Venue / Location *</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            id="venue"
                            name="venue"
                            placeholder="Enter venue address"
                            value={formData.venue}
                            onChange={handleChange}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="guestCount">Expected Guests</Label>
                          <div className="relative">
                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                              id="guestCount"
                              name="guestCount"
                              type="number"
                              placeholder="100"
                              value={formData.guestCount}
                              onChange={handleChange}
                              className="pl-10"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="budget">Budget (₦)</Label>
                          <div className="relative">
                            <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                              id="budget"
                              name="budget"
                              type="number"
                              placeholder="1000000"
                              value={formData.budget}
                              onChange={handleChange}
                              className="pl-10"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="notes">Additional Notes</Label>
                        <Textarea
                          id="notes"
                          name="notes"
                          placeholder="Any special requirements or notes..."
                          value={formData.notes}
                          onChange={handleChange}
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-card rounded-xl border">
                    <h2 className="font-display text-xl font-semibold mb-6">Contact Information</h2>
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="customerName">Full Name *</Label>
                        <Input
                          id="customerName"
                          name="customerName"
                          value={formData.customerName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="customerEmail">Email *</Label>
                          <Input
                            id="customerEmail"
                            name="customerEmail"
                            type="email"
                            value={formData.customerEmail}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="customerPhone">Phone Number *</Label>
                          <Input
                            id="customerPhone"
                            name="customerPhone"
                            type="tel"
                            placeholder="+234"
                            value={formData.customerPhone}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" variant="gold" size="lg" className="w-full">
                    Continue to Payment
                  </Button>
                </motion.form>
              )}

              {step === 'payment' && (
                <motion.form
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onSubmit={handlePayment}
                  className="space-y-6"
                >
                  <div className="p-6 bg-card rounded-xl border">
                    <h2 className="font-display text-xl font-semibold mb-6">Payment Method</h2>
                    <RadioGroup
                      value={formData.paymentMethod}
                      onValueChange={(v) => handleSelectChange('paymentMethod', v)}
                      className="space-y-4"
                    >
                      <label className="flex items-center gap-4 p-4 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="card" id="card" />
                        <CreditCard className="w-6 h-6 text-gold" />
                        <div className="flex-1">
                          <p className="font-medium">Card Payment</p>
                          <p className="text-sm text-muted-foreground">Pay with Paystack</p>
                        </div>
                      </label>
                      <label className="flex items-center gap-4 p-4 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="transfer" id="transfer" />
                        <Building className="w-6 h-6 text-gold" />
                        <div className="flex-1">
                          <p className="font-medium">Bank Transfer</p>
                          <p className="text-sm text-muted-foreground">Direct bank transfer</p>
                        </div>
                      </label>
                    </RadioGroup>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => setStep('details')}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      variant="gold"
                      size="lg"
                      disabled={isProcessing}
                      className="flex-1"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        `Pay ${formatPrice(grandTotal)}`
                      )}
                    </Button>
                  </div>
                </motion.form>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 p-6 bg-card rounded-xl border">
                <h2 className="font-display text-xl font-semibold mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  {checkoutItems.map((item) => (
                    <div key={item.service.id} className="flex gap-3">
                      <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                        {item.service.images?.[0] && (
                          <img
                            src={item.service.images[0]}
                            alt={item.service.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-1">{item.service.name}</p>
                        <p className="text-xs text-muted-foreground">{item.service.vendorName}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-muted-foreground">Qty: {item.quantity}</span>
                          <span className="text-sm font-medium text-gold">
                            {formatPrice(item.service.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Service Fee (5%)</span>
                    <span>{formatPrice(serviceFee)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span className="text-gold">{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gold/10 rounded-lg">
                  <div className="flex items-center gap-2 text-gold mb-2">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-medium">Secure Payment</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your payment information is encrypted and secure. We never store your card details.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
