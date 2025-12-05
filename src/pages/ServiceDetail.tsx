import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Star, Heart, ShoppingBag, MapPin, Check, ChevronLeft, ChevronRight, Share2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getServiceById, getVendorById, formatPrice, categories, services } from '@/data/services';
import { useStore } from '@/store/useStore';
import { ServiceCard } from '@/components/services/ServiceCard';
import { toast } from 'sonner';

export default function ServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState(getServiceById(id || ''));
  const [vendor, setVendor] = useState(service ? getVendorById(service.vendorId) : undefined);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useStore();
  const inWishlist = service ? isInWishlist(service.id) : false;

  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 300], [0, 1]);

  useEffect(() => {
    // Simulate loading
    setIsLoading(true);
    const timer = setTimeout(() => {
      const foundService = getServiceById(id || '');
      setService(foundService);
      if (foundService) {
        setVendor(getVendorById(foundService.vendorId));
      }
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [id]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <Skeleton className="aspect-[4/3] rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!service) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-display text-3xl font-bold mb-4">Service Not Found</h1>
          <p className="text-muted-foreground mb-8">The service you're looking for doesn't exist.</p>
          <Link to="/services">
            <Button variant="gold">Browse Services</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const category = categories.find((c) => c.id === service.category);
  const relatedServices = services
    .filter((s) => s.category === service.category && s.id !== service.id)
    .slice(0, 3);

  const handleAddToCart = () => {
    addToCart(service, quantity);
    toast.success(`${service.name} added to cart`);
  };

  const handleToggleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(service.id);
      toast.info('Removed from wishlist');
    } else {
      addToWishlist(service);
      toast.success('Added to wishlist');
    }
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % service.images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + service.images.length) % service.images.length);
  };

  return (
    <Layout>
      {/* Sticky Header */}
      <motion.div
        style={{ opacity: headerOpacity }}
        className="fixed top-16 md:top-20 inset-x-0 z-40 bg-background/95 backdrop-blur-lg border-b py-3"
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="font-display font-semibold truncate max-w-[200px] md:max-w-md">
              {service.name}
            </h2>
            <span className="text-gold font-bold hidden md:block">
              {formatPrice(service.price)}
            </span>
          </div>
          <Button variant="gold" onClick={handleAddToCart}>
            <ShoppingBag className="w-4 h-4" />
            Add to Cart
          </Button>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link to="/services" className="hover:text-foreground transition-colors">Services</Link>
          <span>/</span>
          <Link
            to={`/services?category=${service.category}`}
            className="hover:text-foreground transition-colors"
          >
            {category?.name}
          </Link>
          <span>/</span>
          <span className="text-foreground">{service.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <motion.div
              key={selectedImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted"
            >
              <img
                src={service.images[selectedImageIndex]}
                alt={service.name}
                className="w-full h-full object-cover"
              />
              {service.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </motion.div>
            {service.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {service.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index ? 'border-gold' : 'border-transparent'
                    }`}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Service Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-3">
                {category?.icon} {category?.name}
              </Badge>
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
                {service.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-gold fill-gold" />
                  <span className="font-semibold">{service.rating}</span>
                  <span className="text-muted-foreground">({service.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {service.location}
                </div>
              </div>
            </div>

            <div className="flex items-end gap-2">
              <span className="text-gold font-display text-4xl font-bold">
                {formatPrice(service.price)}
              </span>
              {service.priceType !== 'fixed' && (
                <span className="text-muted-foreground mb-1">
                  {service.priceType === 'starting' ? 'starting price' : 'per hour'}
                </span>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed">{service.description}</p>

            {/* Features */}
            <div>
              <h3 className="font-semibold mb-3">What's Included</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-gold" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity & Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex gap-3 flex-1">
                <Button variant="gold" size="lg" className="flex-1" onClick={handleAddToCart}>
                  <ShoppingBag className="w-5 h-5" />
                  Add to Cart
                </Button>
                <Button
                  variant={inWishlist ? 'destructive' : 'outline'}
                  size="lg"
                  onClick={handleToggleWishlist}
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Vendor Card */}
            {vendor && (
              <div className="p-4 bg-card rounded-xl border">
                <h3 className="font-semibold mb-3">Service Provider</h3>
                <div className="flex items-center gap-4">
                  <img
                    src={vendor.avatar}
                    alt={vendor.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold truncate">{vendor.name}</h4>
                      {vendor.verified && (
                        <Badge variant="secondary" className="shrink-0">Verified</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{vendor.specialty}</p>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 text-gold fill-gold" />
                      <span>{vendor.rating}</span>
                      <span className="text-muted-foreground">({vendor.reviewCount})</span>
                    </div>
                  </div>
                  <Link to={`/vendor/${vendor.id}`}>
                    <Button variant="gold-outline" size="sm">
                      View Profile
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Services */}
        {relatedServices.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-2xl font-bold mb-8">
              Related <span className="text-gold">Services</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedServices.map((s) => (
                <ServiceCard key={s.id} service={s} />
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
