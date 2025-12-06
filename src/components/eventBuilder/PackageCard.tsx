import { motion } from 'framer-motion';
import { Star, Clock, CheckCircle, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { GeneratedPackage, formatPrice } from '@/data/eventBuilder';

interface PackageCardProps {
  pkg: GeneratedPackage;
  isSelected: boolean;
  onSelect: () => void;
  onAddToCart: () => void;
  index: number;
}

export function PackageCard({ pkg, isSelected, onSelect, onAddToCart, index }: PackageCardProps) {
  const tierColors = {
    essential: 'from-slate-400 to-slate-600',
    standard: 'from-gold to-gold-light',
    premium: 'from-purple-500 to-pink-500',
  };

  const tierLabels = {
    essential: 'Best Value',
    standard: 'Recommended',
    premium: 'Premium',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "relative rounded-2xl border-2 overflow-hidden transition-all duration-300",
        isSelected 
          ? "border-gold shadow-gold ring-2 ring-gold/20" 
          : "border-border hover:border-gold/50 hover:shadow-lg",
        pkg.tier === 'standard' && !isSelected && "border-gold/50"
      )}
    >
      {/* Tier Badge */}
      <div className={cn(
        "absolute top-0 right-0 px-4 py-1 text-xs font-semibold text-white rounded-bl-xl",
        `bg-gradient-to-r ${tierColors[pkg.tier]}`
      )}>
        {tierLabels[pkg.tier]}
      </div>

      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <h3 className="font-display text-xl font-semibold mb-1">{pkg.name}</h3>
          <p className="text-sm text-muted-foreground">{pkg.description}</p>
        </div>

        {/* Price */}
        <div className="mb-6">
          <span className="font-display text-3xl font-bold text-gold">
            {formatPrice(pkg.totalPrice)}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-6 text-sm">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-gold fill-gold" />
            <span className="font-medium">{pkg.avgRating}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{pkg.deliveryTimeline}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{pkg.vendors.length} vendors</span>
          </div>
        </div>

        {/* Services Included */}
        <div className="mb-6">
          <h4 className="font-medium text-sm mb-3">Services Included:</h4>
          <div className="space-y-2">
            {pkg.services.slice(0, 4).map((service) => (
              <div key={service.id} className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-gold shrink-0" />
                <span className="text-muted-foreground truncate">{service.name}</span>
              </div>
            ))}
            {pkg.services.length > 4 && (
              <p className="text-sm text-gold font-medium pl-6">
                +{pkg.services.length - 4} more services
              </p>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mb-6">
          <h4 className="font-medium text-sm mb-3">Key Features:</h4>
          <div className="flex flex-wrap gap-2">
            {pkg.features.slice(0, 5).map((feature, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-muted rounded-full text-xs text-muted-foreground"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <Button
            variant={isSelected ? "gold" : "outline"}
            className="w-full"
            onClick={onSelect}
          >
            {isSelected ? 'Selected for Comparison' : 'Select for Comparison'}
          </Button>
          <Button
            variant="gold"
            className="w-full"
            onClick={onAddToCart}
          >
            Add Package to Cart
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
