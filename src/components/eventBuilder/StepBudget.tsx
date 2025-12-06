import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { budgetRanges } from '@/data/eventBuilder';

interface StepBudgetProps {
  selected: string | null;
  onSelect: (id: string) => void;
}

export function StepBudget({ selected, onSelect }: StepBudgetProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-display text-2xl md:text-3xl font-semibold mb-2">
          What's your budget?
        </h2>
        <p className="text-muted-foreground">
          Select a budget range for your event
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {budgetRanges.map((budget, index) => (
          <motion.button
            key={budget.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelect(budget.id)}
            className={cn(
              "p-6 rounded-xl border-2 transition-all duration-300",
              "hover:shadow-lg hover:-translate-y-1",
              selected === budget.id
                ? "border-gold bg-gold/10 shadow-gold"
                : "border-border bg-card hover:border-gold/50"
            )}
          >
            <Wallet className="w-8 h-8 mx-auto mb-3 text-gold" />
            <h3 className="font-semibold text-sm mb-1">{budget.label}</h3>
            <p className="text-xs text-muted-foreground">{budget.range}</p>
          </motion.button>
        ))}
      </div>

      {/* Budget Tip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-gold/10 border border-gold/30 rounded-lg p-4 max-w-2xl mx-auto"
      >
        <p className="text-sm text-center">
          <span className="font-medium text-gold">💡 Tip:</span>{' '}
          <span className="text-muted-foreground">
            We'll create multiple package options within your budget, 
            so you can choose what works best for you.
          </span>
        </p>
      </motion.div>
    </div>
  );
}
