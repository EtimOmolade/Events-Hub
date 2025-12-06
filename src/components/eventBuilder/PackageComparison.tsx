import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Clock, CheckCircle, MinusCircle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GeneratedPackage, formatPrice } from '@/data/eventBuilder';
import { cn } from '@/lib/utils';

interface PackageComparisonProps {
  packages: GeneratedPackage[];
  onClose: () => void;
  onAddToCart: (pkg: GeneratedPackage) => void;
}

export function PackageComparison({ packages, onClose, onAddToCart }: PackageComparisonProps) {
  if (packages.length < 2) return null;

  // Get all unique service names across packages
  const allServices = [...new Set(packages.flatMap(p => p.services.map(s => s.name)))];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/95 backdrop-blur-lg z-50 overflow-y-auto"
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-semibold">
              Compare Packages
            </h2>
            <p className="text-muted-foreground">
              Side-by-side comparison of your selected packages
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr>
                <th className="text-left p-4 bg-muted rounded-tl-xl">
                  <span className="font-medium text-muted-foreground">Features</span>
                </th>
                {packages.map((pkg) => (
                  <th key={pkg.id} className={cn(
                    "p-4 text-center",
                    pkg.tier === 'standard' && "bg-gold/10"
                  )}>
                    <div className="space-y-2">
                      <span className="font-display text-lg font-semibold block">
                        {pkg.name}
                      </span>
                      <span className="text-2xl font-bold text-gold block">
                        {formatPrice(pkg.totalPrice)}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Rating */}
              <tr className="border-b border-border">
                <td className="p-4 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Average Rating
                  </div>
                </td>
                {packages.map((pkg) => (
                  <td key={pkg.id} className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-4 h-4 text-gold fill-gold" />
                      <span className="font-semibold">{pkg.avgRating}</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Delivery Timeline */}
              <tr className="border-b border-border">
                <td className="p-4 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Delivery Timeline
                  </div>
                </td>
                {packages.map((pkg) => (
                  <td key={pkg.id} className="p-4 text-center font-medium">
                    {pkg.deliveryTimeline}
                  </td>
                ))}
              </tr>

              {/* Vendors */}
              <tr className="border-b border-border">
                <td className="p-4 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Vendors Included
                  </div>
                </td>
                {packages.map((pkg) => (
                  <td key={pkg.id} className="p-4 text-center font-medium">
                    {pkg.vendors.length} vendors
                  </td>
                ))}
              </tr>

              {/* Services */}
              <tr className="bg-muted/50">
                <td colSpan={packages.length + 1} className="p-4 font-semibold">
                  Services Included
                </td>
              </tr>
              {allServices.map((serviceName) => (
                <tr key={serviceName} className="border-b border-border">
                  <td className="p-4 text-sm text-muted-foreground">
                    {serviceName}
                  </td>
                  {packages.map((pkg) => {
                    const hasService = pkg.services.some(s => s.name === serviceName);
                    return (
                      <td key={pkg.id} className="p-4 text-center">
                        {hasService ? (
                          <CheckCircle className="w-5 h-5 text-gold mx-auto" />
                        ) : (
                          <MinusCircle className="w-5 h-5 text-muted-foreground/30 mx-auto" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}

              {/* Add to Cart Row */}
              <tr>
                <td className="p-4"></td>
                {packages.map((pkg) => (
                  <td key={pkg.id} className="p-4 text-center">
                    <Button
                      variant="gold"
                      className="w-full max-w-[200px]"
                      onClick={() => onAddToCart(pkg)}
                    >
                      Add to Cart
                    </Button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
