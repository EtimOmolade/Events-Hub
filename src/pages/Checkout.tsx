import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDays, MapPin, Users, Wallet, CreditCard, Building, Loader2, Check } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useStore, Booking } from '@/store/useStore';
import { formatPrice } from '@/data/services';
import { toast } from 'sonner';

const eventTypes = [
  'Wedding',
  'Birthday Party',
  'Corporate Event',
  'Baby Shower',
  'Concert',
  'Anniversary',
  'Other',
];

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart, addBooking, user } = useStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');

  const [formData, setFormData] = useState({
    eventType: '',
    eventDate: '',
    venue: '',
    guestCount: '',
    budget: '',
    notes: '',
    customerName: user?.name || '',
    customerEmail: user?.email || '',
    customerPhone: '',
    paymentMethod: 'card',
  });

  const total = getCartTotal();
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

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2500));

    const booking: Booking = {
      id: `BK-${Date.now()}`,
      services: cart,
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
    clearCart();
    setStep('success');
    setIsProcessing(false);
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
            <div className="p-4 bg-card rounded-xl border mb-8 text-left">
              <p className="text-sm text-muted-foreground mb-1">Booking Reference</p>
              <p className="font-display text-xl font-bold text-gold">BK-{Date.now()}</p>
            </div>
            <div className="flex flex-col gap-3">
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
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">
          Complete Your <span className="text-gold">Booking</span>
        </h1>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className={`flex items-center gap-2 ${step === 'details' ? 'text-gold' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === 'details' ? 'bg-gold text-rich-black' : 'bg-muted'
            }`}>
              1
            </div>
            <span className="hidden sm:inline">Event Details</span>
          </div>
          <div className="w-12 h-0.5 bg-border" />
          <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-gold' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === 'payment' ? 'bg-gold text-rich-black' : 'bg-muted'
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
                    className="flex-1"
                    onClick={() => setStep('details')}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="gold"
                    size="lg"
                    className="flex-1"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
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
                {cart.map((item) => (
                  <div key={item.service.id} className="flex gap-3">
                    <img
                      src={item.service.images[0]}
                      alt={item.service.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.service.name}</p>
                      <p className="text-muted-foreground text-sm">Qty: {item.quantity}</p>
                      <p className="text-gold font-medium text-sm">
                        {formatPrice(item.service.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-3 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Service Fee (5%)</span>
                  <span>{formatPrice(serviceFee)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t">
                  <span className="font-semibold">Total</span>
                  <span className="text-gold font-display text-xl font-bold">
                    {formatPrice(grandTotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
