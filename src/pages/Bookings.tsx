import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDays, MapPin, Users, Clock, Package } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStore, Booking } from '@/store/useStore';
import { formatPrice } from '@/data/services';
import { format } from 'date-fns';

const statusColors: Record<Booking['status'], string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  'in-progress': 'bg-purple-100 text-purple-800 border-purple-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
};

const statusLabels: Record<Booking['status'], string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  'in-progress': 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export default function Bookings() {
  const { bookings, isAuthenticated } = useStore();

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-display text-3xl font-bold mb-4">Sign In Required</h1>
          <p className="text-muted-foreground mb-8">Please sign in to view your bookings.</p>
          <Link to="/auth?redirect=/bookings">
            <Button variant="gold" size="lg">
              Sign In
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  if (bookings.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-muted-foreground" />
            </div>
            <h1 className="font-display text-3xl font-bold mb-4">No Bookings Yet</h1>
            <p className="text-muted-foreground mb-8">
              You haven't made any bookings yet. Start exploring our services to create your perfect event!
            </p>
            <Link to="/services">
              <Button variant="gold" size="lg">
                Browse Services
              </Button>
            </Link>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">
          My <span className="text-gold">Bookings</span>
        </h1>

        <div className="space-y-6">
          {bookings.map((booking, index) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 bg-card rounded-xl border"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="font-display text-xl font-semibold">{booking.eventType}</h2>
                    <Badge className={statusColors[booking.status]}>
                      {statusLabels[booking.status]}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">Booking ID: {booking.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-gold font-display text-2xl font-bold">
                    {formatPrice(booking.totalAmount)}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Booked on {format(new Date(booking.createdAt), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <CalendarDays className="w-5 h-5 text-gold" />
                  <div>
                    <p className="text-xs text-muted-foreground">Event Date</p>
                    <p className="font-medium">
                      {format(new Date(booking.eventDate), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <MapPin className="w-5 h-5 text-gold" />
                  <div>
                    <p className="text-xs text-muted-foreground">Venue</p>
                    <p className="font-medium truncate">{booking.venue}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Users className="w-5 h-5 text-gold" />
                  <div>
                    <p className="text-xs text-muted-foreground">Guests</p>
                    <p className="font-medium">{booking.guestCount || 'Not specified'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Clock className="w-5 h-5 text-gold" />
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <p className="font-medium">{statusLabels[booking.status]}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Booked Services ({booking.services.length})</h3>
                <div className="flex flex-wrap gap-3">
                  {booking.services.map((item) => (
                    <div
                      key={item.service.id}
                      className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg"
                    >
                      <img
                        src={item.service.images[0]}
                        alt={item.service.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div>
                        <p className="text-sm font-medium truncate max-w-[150px]">
                          {item.service.name}
                        </p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
