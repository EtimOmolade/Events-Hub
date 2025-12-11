import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Star, MapPin, BadgeCheck, ArrowLeft, MessageCircle,
  Calendar, Image, Briefcase, Phone
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VendorAvailabilityCalendar } from '@/components/vendors/VendorAvailabilityCalendar';
import { VendorPortfolioGallery } from '@/components/vendors/VendorPortfolioGallery';
import { VendorMessaging } from '@/components/vendors/VendorMessaging';
import { BookingConfirmationDialog } from '@/components/vendors/BookingConfirmationDialog';
import { ServiceCard } from '@/components/services/ServiceCard';
import { vendors, services } from '@/data/services';
import { getVendorPortfolio } from '@/data/vendorData';
import { useStore } from '@/store/useStore';
import { toast } from 'sonner';

export default function VendorDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useStore();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const vendor = vendors.find(v => v.id === id);
  const vendorServices = services.filter(s => s.vendorId === id);
  const portfolio = getVendorPortfolio(id || '');

  if (!vendor) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Vendor not found</h1>
          <Link to="/vendors">
            <Button variant="gold">Back to Vendors</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const handleContactVendor = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to message vendors');
      navigate('/auth');
      return;
    }
    setIsMessagingOpen(true);
  };

  const handleHireVendor = () => {
    if (!selectedDate) {
      toast.error('Please select a date first', {
        description: 'Go to the Availability tab and pick an available (green) date'
      });
      return;
    }
    if (!isAuthenticated) {
      toast.error('Please sign in to hire vendors');
      navigate('/auth');
      return;
    }
    setIsBookingOpen(true);
  };

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="relative h-48 md:h-64 bg-gradient-to-r from-gold/30 to-gold-light/30">
          <div className="absolute inset-0 bg-gradient-hero" />
        </div>

        <div className="container mx-auto px-4">
          {/* Profile Header */}
          <div className="relative -mt-16 md:-mt-20 pb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row items-start gap-6"
            >
              {/* Avatar */}
              <div className="relative">
                <img
                  src={vendor.avatar}
                  alt={vendor.name}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover border-4 border-background shadow-elevated"
                />
                {vendor.verified && (
                  <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gold text-rich-black border-0">
                    <BadgeCheck className="w-4 h-4 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 pt-4 md:pt-8">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h1 className="font-display text-2xl md:text-3xl font-bold mb-1">
                      {vendor.name}
                    </h1>
                    <p className="text-gold font-medium mb-2">{vendor.specialty}</p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-gold fill-gold" />
                        <span className="font-medium text-foreground">{vendor.rating}</span>
                        <span>({vendor.reviewCount} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{vendor.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        <span>{vendorServices.length} services</span>
                      </div>
                    </div>

                    <p className="text-muted-foreground max-w-xl">
                      {vendor.bio}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" onClick={handleContactVendor} className="gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Message
                    </Button>
                    <Button variant="gold" onClick={handleHireVendor} className="gap-2">
                      <Phone className="w-4 h-4" />
                      Hire Vendor
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Tabs Content */}
          <Tabs defaultValue="services" className="pb-12">
            <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent h-auto p-0 mb-8">
              <TabsTrigger
                value="services"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-gold data-[state=active]:bg-transparent px-4 py-3"
              >
                <Briefcase className="w-4 h-4 mr-2" />
                Services ({vendorServices.length})
              </TabsTrigger>
              <TabsTrigger
                value="portfolio"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-gold data-[state=active]:bg-transparent px-4 py-3"
              >
                <Image className="w-4 h-4 mr-2" />
                Portfolio ({portfolio.length})
              </TabsTrigger>
              <TabsTrigger
                value="availability"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-gold data-[state=active]:bg-transparent px-4 py-3"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Availability
              </TabsTrigger>
            </TabsList>

            <TabsContent value="services" className="mt-0">
              {vendorServices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vendorServices.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No services available from this vendor
                </div>
              )}
            </TabsContent>

            <TabsContent value="portfolio" className="mt-0">
              {portfolio.length > 0 ? (
                <VendorPortfolioGallery items={portfolio} />
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No portfolio items available
                </div>
              )}
            </TabsContent>

            <TabsContent value="availability" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <VendorAvailabilityCalendar
                  vendorId={vendor.id}
                  selectedDate={selectedDate}
                  onSelectDate={(date) => setSelectedDate(date)}
                />

                <div className="space-y-4">
                  <div className="bg-card border border-border rounded-xl p-6">
                    <h3 className="font-display text-lg font-semibold mb-4">
                      Book {vendor.name}
                    </h3>

                    {selectedDate ? (
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Selected date:{' '}
                          <span className="font-medium text-foreground">
                            {selectedDate.toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                        </p>
                        <Button variant="gold" className="w-full" onClick={handleHireVendor}>
                          Request Booking
                        </Button>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Select an available date from the calendar to book this vendor
                      </p>
                    )}
                  </div>

                  <div className="bg-gold/10 border border-gold/30 rounded-xl p-6">
                    <h4 className="font-medium mb-2">💡 Booking Tips</h4>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• Green dates are available for booking</li>
                      <li>• Yellow dates have tentative bookings</li>
                      <li>• Book early for weekend dates</li>
                      <li>• Message the vendor to discuss details</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Messaging Drawer */}
      <VendorMessaging
        isOpen={isMessagingOpen}
        onClose={() => setIsMessagingOpen(false)}
        initialVendorId={vendor.id}
      />

      {/* Booking Confirmation Dialog */}
      {selectedDate && (
        <BookingConfirmationDialog
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          vendorName={vendor.name}
          vendorId={vendor.id}
          selectedDate={selectedDate}
          userEmail={user?.email}
          userName={user?.name}
          onBookingSuccess={() => {
            setIsBookingOpen(false);
            // Small delay to allow dialog to close nicely before drawer opens, or just immediate.
            setTimeout(() => setIsMessagingOpen(true), 100);
          }}
        />
      )}
    </Layout>
  );
}
