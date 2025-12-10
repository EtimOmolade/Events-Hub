import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, isSameMonth, isSameDay, isToday, isBefore, startOfDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import { generateVendorAvailability, AvailabilitySlot } from '@/data/vendorData';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface VendorAvailabilityCalendarProps {
  vendorId: string;
  onSelectDate?: (date: Date, status: AvailabilitySlot['status']) => void;
  selectedDate?: Date | null;
}

export function VendorAvailabilityCalendar({ 
  vendorId, 
  onSelectDate,
  selectedDate 
}: VendorAvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const availability = useMemo(() => {
    return generateVendorAvailability(vendorId, currentMonth);
  }, [vendorId, currentMonth]);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const monthStart = startOfMonth(currentMonth);
  const startDay = monthStart.getDay();
  
  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const getSlotForDate = (dateStr: string): AvailabilitySlot | undefined => {
    return availability.find(slot => slot.date === dateStr);
  };

  const today = startOfDay(new Date());

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-4 md:p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gold" />
          <h3 className="font-display text-lg font-semibold">Availability</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <span className="font-medium min-w-[140px] text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <Button variant="ghost" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-muted-foreground">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-muted-foreground">Tentative</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-muted-foreground">Booked</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day Headers */}
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}

        {/* Empty cells for days before month start */}
        {Array.from({ length: startDay }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {/* Day cells */}
        {availability.map((slot) => {
          const date = new Date(slot.date);
          const isPast = isBefore(date, today);
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          const isTodayDate = isToday(date);

          const handleDateClick = () => {
            if (isPast) return;
            if (slot.status === 'booked') {
              toast.info('This date is already booked');
              return;
            }
            if (isSelected) {
              toast.info('This date is already selected for you');
              return;
            }
            if (slot.status === 'tentative') {
              toast.warning('This date has a tentative booking - proceed with caution');
            }
            onSelectDate?.(date, slot.status);
          };

          return (
            <button
              key={slot.date}
              onClick={handleDateClick}
              disabled={isPast}
              className={cn(
                "aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-all",
                "hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gold/50",
                isPast && "opacity-40 cursor-not-allowed",
                isSelected && "ring-2 ring-gold bg-gold/20",
                isTodayDate && "font-bold",
                slot.status === 'available' && !isPast && "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400",
                slot.status === 'tentative' && !isPast && "bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400",
                slot.status === 'booked' && "bg-red-500/10 text-red-500 cursor-pointer"
              )}
            >
              <span>{format(date, 'd')}</span>
              {slot.status === 'booked' && slot.eventType && (
                <span className="text-[10px] truncate max-w-full px-1">
                  {slot.eventType}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Date Info */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 p-3 bg-gold/10 rounded-lg"
        >
          <p className="text-sm">
            <span className="font-medium">Selected:</span>{' '}
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
