import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { eventTypeCategories } from '@/data/eventBuilder';

interface StepEventTypeProps {
  selected: string | null;
  onSelect: (id: string) => void;
}

export function StepEventType({ selected, onSelect }: StepEventTypeProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-display text-2xl md:text-3xl font-semibold mb-2">
          What are you celebrating?
        </h2>
        <p className="text-muted-foreground">
          Select the type of event you're planning
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {eventTypeCategories.map((eventType, index) => (
          <motion.button
            key={eventType.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelect(eventType.id)}
            className={cn(
              "p-6 rounded-xl border-2 transition-all duration-300",
              "hover:shadow-lg hover:-translate-y-1",
              selected === eventType.id
                ? "border-gold bg-gold/10 shadow-gold"
                : "border-border bg-card hover:border-gold/50"
            )}
          >
            <span className="text-4xl block mb-3">{eventType.icon}</span>
            <span className="font-medium text-sm">{eventType.name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
