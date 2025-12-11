import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Users, Wallet, Clock, ArrowRight, Download, Package, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Booking } from '@/store/useStore';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function Bookings() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      if (!user) return;

      try {
        setLoading(true);
        const { data: bookingsData, error } = await supabase
          .from('bookings')
          .select(`
            *,
            booking_items (*)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching bookings:', error);
          toast.error('Failed to load bookings');
          return;
        }

        // Map Supabase data to our Booking interface
        const mappedBookings: Booking[] = (bookingsData || []).map(b => ({
          id: b.id,
          eventType: b.event_type,
          eventDate: b.event_date,
          venue: b.venue,
          budget: Number(b.budget),
          guestCount: b.guest_count,
          status: b.status as any,
          totalAmount: Number(b.total_amount),
          createdAt: b.created_at,
          customerName: b.customer_name,
          customerEmail: b.customer_email,
          customerPhone: b.customer_phone,
          services: b.booking_items.map((item: any) => ({
            service: {
              id: 'unknown', // We don't have the real service ID linked correctly yet
              name: item.service_name,
              price: Number(item.unit_price),
              // Fill other required Service fields with dummies or leave empty if UI tolerates
              // The UI primarily uses service.name and service.price in the order summary in Checkout, 
              // but here in Bookings page, let's see what is used.
              // The Card below iterates over `booking.services`.
              vendorName: 'Vendor', // Placeholder
              category: 'Service',
              description: '',
              shortDescription: '',
              priceType: 'fixed',
              rating: 0,
              reviewCount: 0,
              images: [],
              vendorId: '',
              location: '',
              features: [],
              available: true
            },
            quantity: item.quantity
          }))
        }));

        setBookings(mappedBookings);
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchBookings();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);


  if (authLoading || loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Please sign in to view your bookings</h2>
          <Button onClick={() => navigate('/auth')} variant="gold">
            Sign In
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">My Bookings</h1>
            <p className="text-muted-foreground">Track and manage your event bookings</p>
          </motion.div>

          <AnimatePresence>
            {bookings.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16 bg-card rounded-2xl border border-dashed border-border"
              >
                <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-4">
                  <Calendar className="w-8 h-8 text-gold" />
                </div>
                <h2 className="text-xl font-semibold mb-2">No bookings yet</h2>
                <p className="text-muted-foreground mb-6 text-center max-w-sm">
                  You haven't made any bookings yet. Start exploring our services to plan your perfect event.
                </p>
                <Link to="/services">
                  <Button variant="gold" className="gap-2">
                    Browse Services
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <div className="grid gap-6">
                {bookings.map((booking, index) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden border-border hover:border-gold/50 transition-colors">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          {/* Date & Status Section */}
                          <div className="bg-muted/50 p-6 md:w-64 flex flex-col justify-center border-b md:border-b-0 md:border-r border-border">
                            <div className="mb-4">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${booking.status === 'confirmed'
                                  ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                  : booking.status === 'pending'
                                    ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                    : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                }`}>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </span>
                            </div>
                            <h3 className="font-display text-2xl font-bold mb-1">
                              {format(new Date(booking.eventDate), 'dd')}
                            </h3>
                            <p className="text-muted-foreground uppercase tracking-wider text-sm font-medium mb-1">
                              {format(new Date(booking.eventDate), 'MMM yyyy')}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(booking.eventDate), 'EEEE')}
                            </p>
                          </div>

                          {/* Details Section */}
                          <div className="flex-1 p-6">
                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                              <div>
                                <h3 className="font-semibold text-lg mb-2">{booking.eventType}</h3>
                                <div className="space-y-2 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-gold" />
                                    <span>{booking.venue}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-gold" />
                                    <span>{booking.guestCount} Guests</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gold" />
                                    <span>Booked on {format(new Date(booking.createdAt), 'MMM d, yyyy')}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-medium mb-2 text-sm">Services Included</h4>
                                  <div className="space-y-2">
                                    {booking.services.map((item: any, i: 0) => (
                                      <div key={i} className="flex items-center justify-between text-sm bg-muted/30 p-2 rounded">
                                        <div className="flex items-center gap-2">
                                          <Package className="w-3 h-3 text-gold" />
                                          <span>{item.service.name}</span>
                                          <span className="text-xs text-muted-foreground">x{item.quantity}</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-border">
                              <div>
                                <p className="text-sm text-muted-foreground">Total Amount</p>
                                <p className="font-display text-xl font-bold text-gold">
                                  {new Intl.NumberFormat('en-NG', {
                                    style: 'currency',
                                    currency: 'NGN'
                                  }).format(booking.totalAmount)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}
