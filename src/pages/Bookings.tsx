import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Users, Wallet, Clock, ArrowRight, Package, Loader2, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Booking } from '@/store/useStore';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";

export default function Bookings() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Selection state
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  // Fetch bookings
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
          toast.error('Failed to load bookings');
          return;
        }

        const mapped: Booking[] = (bookingsData || []).map(b => ({
          id: b.id,
          eventType: b.event_type,
          eventDate: b.event_date,
          venue: b.venue,
          budget: Number(b.budget),
          guestCount: b.guest_count,
          status: b.status,
          totalAmount: Number(b.total_amount),
          createdAt: b.created_at,
          customerName: b.customer_name,
          customerEmail: b.customer_email,
          customerPhone: b.customer_phone,
          services: (b.booking_items || []).map((item: any) => ({
            service: {
              id: 'unknown',
              name: item.service_name,
              price: Number(item.unit_price),
              vendorName: 'Vendor',
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

        setBookings(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (user) fetchBookings();
    else if (!authLoading) setLoading(false);
  }, [user, authLoading]);

  // Toggle booking selection
  const toggleSelection = (id: string) => {
    setSelectedBookings(prev =>
      prev.includes(id)
        ? prev.filter(b => b !== id)
        : [...prev, id]
    );
  };

  // Cancel selected bookings
  async function cancelSelectedBookings() {
    if (selectedBookings.length === 0) return;

    const { error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .in('id', selectedBookings);

    if (error) {
      toast.error('Failed to cancel bookings');
      return;
    }

    toast.success('Booking(s) cancelled successfully');

    // Refresh UI
    setBookings(prev =>
      prev.map(b =>
        selectedBookings.includes(b.id)
          ? { ...b, status: 'cancelled' }
          : b
      )
    );

    setSelectedBookings([]);
    setCancelDialogOpen(false);
  }

  // Loading state
  if (authLoading || loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </Layout>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
          <h2 className="text-2xl font-bold mb-4">Please sign in to view your bookings</h2>
          <Button variant="gold" onClick={() => navigate('/auth')}>Sign In</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen py-10 bg-muted/30">
        <div className="container mx-auto px-4">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-1">
                My Bookings
              </h1>
              <p className="text-muted-foreground">
                Track, manage or cancel your bookings
              </p>
            </div>

            {/* Cancel Button – Only shows when selection exists */}
            {selectedBookings.length > 0 && (
              <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Cancel Booking{selectedBookings.length > 1 ? 's' : ''}
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Cancellation</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to cancel the selected booking?
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>No, Go Back</AlertDialogCancel>
                    <AlertDialogAction onClick={cancelSelectedBookings}>
                      Yes, Cancel
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>

          {/* Empty State */}
          {bookings.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-muted-foreground mb-4">No bookings found</p>
              <Link to="/services">
                <Button variant="gold">Browse Services</Button>
              </Link>
            </div>
          )}

          {/* Bookings List */}
          <div className="grid gap-6">
            {bookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="relative border-border group">

                  {/* Checkbox */}
                  <div className="absolute top-4 right-4 z-10">
                    <input
                      type="checkbox"
                      className="scale-125 accent-gold cursor-pointer"
                      checked={selectedBookings.includes(booking.id)}
                      onChange={() => toggleSelection(booking.id)}
                      disabled={booking.status === 'cancelled'}
                    />
                  </div>

                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">

                      {/* Left side */}
                      <div className="bg-muted/40 p-6 md:w-64 border-b md:border-b-0 md:border-r border-border">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold
                          ${booking.status === 'pending'
                            ? 'bg-yellow-500/10 text-yellow-600'
                            : booking.status === 'confirmed'
                              ? 'bg-green-500/10 text-green-600'
                              : booking.status === 'cancelled'
                                ? 'bg-red-500/10 text-red-600'
                                : 'bg-blue-500/10 text-blue-600'}`}>
                          {booking.status}
                        </span>

                        <h3 className="font-display text-3xl font-bold mt-4 mb-1">
                          {format(new Date(booking.eventDate), 'dd')}
                        </h3>
                        <p className="uppercase text-sm text-muted-foreground">
                          {format(new Date(booking.eventDate), 'MMM yyyy')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(booking.eventDate), 'EEEE')}
                        </p>
                      </div>

                      {/* Right side */}
                      <div className="flex-1 p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-lg">
                            {booking.eventType || 'Vendor Booking'}
                          </h3>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2 text-sm text-muted-foreground">
                            {booking.venue && (
                              <p className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gold" />
                                {booking.venue}
                              </p>
                            )}

                            {booking.guestCount > 0 && (
                              <p className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-gold" />
                                {booking.guestCount} Guests
                              </p>
                            )}

                            <p className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gold" />
                              Booked on {format(new Date(booking.createdAt), 'MMM d, yyyy')}
                            </p>
                          </div>

                          <div className="space-y-3">
                            <p className="font-medium text-sm">Services Included</p>
                            <div className="space-y-2">
                              {booking.services.map((s, i) => (
                                <div key={i} className="text-sm bg-muted/30 p-2 rounded flex items-center gap-2">
                                  <Package className="w-4 h-4 text-gold" />
                                  {`${s.service.name} x${s.quantity}`}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Total */}
                        <div className="pt-4 border-t border-border mt-4 flex items-center justify-between">
                          <p className="text-muted-foreground text-sm">Total Amount</p>
                          <p className="font-display text-xl font-bold text-gold">
                            ₦{booking.totalAmount.toLocaleString()}
                          </p>
                        </div>

                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </Layout>
  );
}
