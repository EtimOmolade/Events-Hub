import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingBag, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Service, useStore } from '@/store/useStore';
import { formatPrice, categories } from '@/data/services';
import { toast } from 'sonner';

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist, isAuthenticated } = useStore();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const inWishlist = isInWishlist(service.id);

  const category = categories.find((c) => c.id === service.category);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please sign in to add to cart');
      navigate('/auth');
      return;
    }

    addToCart(service);
    toast.success(`${service.name} added to cart`);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please sign in to manage wishlist');
      navigate('/auth');
      return;
    }

    if (inWishlist) {
      removeFromWishlist(service.id);
      toast.info('Removed from wishlist');
    } else {
      addToWishlist(service);
      toast.success('Added to wishlist');
    }
  };

  return (
    <Link to={`/service/${service.id}`}>
      <motion.div
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="group relative bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <motion.img
            src={service.images[0]}
            alt={service.name}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.4 }}
          />
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full bg-background/90 backdrop-blur-sm text-xs font-medium">
              {category?.icon} {category?.name}
            </span>
          </div>
          {/* Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${inWishlist
              ? 'bg-destructive text-destructive-foreground'
              : 'bg-background/90 backdrop-blur-sm text-foreground hover:bg-gold hover:text-rich-black'
              }`}
          >
            <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
          </button>
          {/* Quick Add Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            className="absolute bottom-4 inset-x-4"
          >
            <Button
              variant="gold"
              className="w-full"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="w-4 h-4" />
              Add to Cart
            </Button>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-display text-lg font-semibold leading-tight group-hover:text-gold transition-colors line-clamp-2">
              {service.name}
            </h3>
          </div>

          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {service.shortDescription}
          </p>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <MapPin className="w-4 h-4" />
            <span>{service.location}</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-gold font-display text-xl font-bold">
                {formatPrice(service.price)}
              </span>
              {service.priceType !== 'fixed' && (
                <span className="text-muted-foreground text-xs ml-1">
                  {service.priceType === 'starting' ? 'starting' : '/hr'}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-gold fill-gold" />
              <span className="font-medium">{service.rating}</span>
              <span className="text-muted-foreground text-sm">
                ({service.reviewCount})
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
