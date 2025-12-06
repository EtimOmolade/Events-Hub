import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Users, Calendar, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { vendors, services } from '@/data/services';
import { Vendor } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface MultiVendorSelectorProps {
  selectedVendors: string[];
  onVendorsChange: (vendorIds: string[]) => void;
  eventDate?: Date;
  onEventDateChange?: (date: Date) => void;
  onProceed: () => void;
}

export function MultiVendorSelector({
  selectedVendors,
  onVendorsChange,
  eventDate,
  onEventDateChange,
  onProceed,
}: MultiVendorSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleVendor = (vendorId: string) => {
    if (selectedVendors.includes(vendorId)) {
      onVendorsChange(selectedVendors.filter(id => id !== vendorId));
    } else {
      onVendorsChange([...selectedVendors, vendorId]);
    }
  };

  const selectedVendorDetails = vendors.filter(v => selectedVendors.includes(v.id));

  const getVendorServiceCount = (vendorId: string) => {
    return services.filter(s => s.vendorId === vendorId).length;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl overflow-hidden"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
            <Users className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h3 className="font-display font-semibold">Multi-Vendor Booking</h3>
            <p className="text-sm text-muted-foreground">
              {selectedVendors.length > 0
                ? `${selectedVendors.length} vendor${selectedVendors.length > 1 ? 's' : ''} selected`
                : 'Select multiple vendors for your event'}
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ArrowRight className={cn(
            "w-5 h-5 text-muted-foreground transition-transform",
            isExpanded && "rotate-90"
          )} />
        </motion.div>
      </div>

      {/* Selected Vendors Preview */}
      {selectedVendors.length > 0 && !isExpanded && (
        <div className="px-4 pb-4">
          <div className="flex flex-wrap gap-2">
            {selectedVendorDetails.map((vendor) => (
              <span
                key={vendor.id}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold/10 rounded-full text-sm"
              >
                <img
                  src={vendor.avatar}
                  alt={vendor.name}
                  className="w-5 h-5 rounded-full object-cover"
                />
                {vendor.name}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleVendor(vendor.id);
                  }}
                  className="hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-border"
          >
            <div className="p-4 space-y-4">
              {/* Event Date */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  <Calendar className="w-4 h-4 inline-block mr-2" />
                  Event Date
                </label>
                <Input
                  type="date"
                  value={eventDate ? format(eventDate, 'yyyy-MM-dd') : ''}
                  onChange={(e) => onEventDateChange?.(new Date(e.target.value))}
                  min={format(new Date(), 'yyyy-MM-dd')}
                />
              </div>

              {/* Vendor Selection */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  Select Vendors
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {vendors.map((vendor) => (
                    <button
                      key={vendor.id}
                      onClick={() => toggleVendor(vendor.id)}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left",
                        selectedVendors.includes(vendor.id)
                          ? "border-gold bg-gold/10"
                          : "border-border hover:border-gold/50"
                      )}
                    >
                      <div className="relative">
                        <img
                          src={vendor.avatar}
                          alt={vendor.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        {selectedVendors.includes(vendor.id) && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gold flex items-center justify-center">
                            <Check className="w-3 h-3 text-rich-black" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{vendor.name}</h4>
                        <p className="text-xs text-muted-foreground truncate">{vendor.specialty}</p>
                        <p className="text-xs text-gold">{getVendorServiceCount(vendor.id)} services</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <Button
                variant="gold"
                className="w-full"
                onClick={() => {
                  if (selectedVendors.length < 2) {
                    toast.error('Select at least 2 vendors');
                    return;
                  }
                  if (!eventDate) {
                    toast.error('Please select an event date');
                    return;
                  }
                  onProceed();
                }}
                disabled={selectedVendors.length < 2}
              >
                View Combined Services ({selectedVendors.length} vendors)
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
