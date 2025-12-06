import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { guestSizeRanges, venueTypes } from '@/data/eventBuilder';

interface StepGuestsProps {
  selectedSize: string | null;
  selectedVenue: string | null;
  onSelectSize: (id: string) => void;
  onSelectVenue: (id: string) => void;
}

export function StepGuests({ 
  selectedSize, 
  selectedVenue, 
  onSelectSize, 
  onSelectVenue 
}: StepGuestsProps) {
  return (
    <div className="space-y-10">
      {/* Guest Size Selection */}
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="font-display text-2xl md:text-3xl font-semibold mb-2">
            How many guests?
          </h2>
          <p className="text-muted-foreground">
            Select the expected number of guests
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {guestSizeRanges.map((size, index) => (
            <motion.button
              key={size.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelectSize(size.id)}
              className={cn(
                "p-6 rounded-xl border-2 transition-all duration-300",
                "hover:shadow-lg hover:-translate-y-1",
                selectedSize === size.id
                  ? "border-gold bg-gold/10 shadow-gold"
                  : "border-border bg-card hover:border-gold/50"
              )}
            >
              <Users className="w-8 h-8 mx-auto mb-3 text-gold" />
              <h3 className="font-semibold text-sm mb-1">{size.label}</h3>
              <p className="text-xs text-muted-foreground">{size.range} guests</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Venue Type Selection */}
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="font-display text-xl font-semibold mb-2">
            Choose your venue type
          </h3>
          <p className="text-muted-foreground text-sm">
            Where will your event take place?
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {venueTypes.map((venue, index) => (
            <motion.button
              key={venue.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.03 }}
              onClick={() => onSelectVenue(venue.id)}
              className={cn(
                "p-5 rounded-xl border-2 text-left transition-all duration-300",
                "hover:shadow-lg hover:-translate-y-1",
                selectedVenue === venue.id
                  ? "border-gold bg-gold/10 shadow-gold"
                  : "border-border bg-card hover:border-gold/50"
              )}
            >
              <span className="text-3xl block mb-2">{venue.icon}</span>
              <h4 className="font-semibold text-sm mb-1">{venue.name}</h4>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {venue.description}
              </p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
