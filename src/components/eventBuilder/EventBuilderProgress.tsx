import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: number;
  title: string;
  description: string;
}

interface EventBuilderProgressProps {
  steps: Step[];
  currentStep: number;
}

export function EventBuilderProgress({ steps, currentStep }: EventBuilderProgressProps) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-border -z-10" />
        <motion.div 
          className="absolute top-5 left-0 h-0.5 bg-gold -z-10"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.3 }}
        />

        {steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <div key={step.id} className="flex flex-col items-center gap-2">
              <motion.div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors",
                  isCompleted && "bg-gold text-rich-black",
                  isCurrent && "bg-gold/20 border-2 border-gold text-gold",
                  !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                )}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: step.id * 0.1 }}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.id
                )}
              </motion.div>
              <div className="text-center hidden md:block">
                <p className={cn(
                  "text-sm font-medium",
                  isCurrent ? "text-gold" : "text-muted-foreground"
                )}>
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground hidden lg:block">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Mobile Step Indicator */}
      <div className="mt-4 text-center md:hidden">
        <p className="text-sm font-medium text-gold">
          Step {currentStep}: {steps[currentStep - 1]?.title}
        </p>
        <p className="text-xs text-muted-foreground">
          {steps[currentStep - 1]?.description}
        </p>
      </div>
    </div>
  );
}
