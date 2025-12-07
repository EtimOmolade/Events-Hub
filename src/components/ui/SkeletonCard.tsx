import { motion } from 'framer-motion';

interface SkeletonCardProps {
  variant?: 'service' | 'vendor' | 'compact';
}

export function SkeletonCard({ variant = 'service' }: SkeletonCardProps) {
  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg bg-card">
        <div className="w-12 h-12 rounded-lg bg-muted animate-shimmer" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 bg-muted animate-shimmer rounded" />
          <div className="h-3 w-1/2 bg-muted animate-shimmer rounded" />
        </div>
      </div>
    );
  }

  if (variant === 'vendor') {
    return (
      <div className="bg-card rounded-xl overflow-hidden border border-border">
        <div className="flex items-center gap-4 p-4">
          <div className="w-16 h-16 rounded-full bg-muted animate-shimmer" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-3/4 bg-muted animate-shimmer rounded" />
            <div className="h-4 w-1/2 bg-muted animate-shimmer rounded" />
            <div className="h-3 w-1/3 bg-muted animate-shimmer rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-card rounded-xl overflow-hidden border border-border"
    >
      <div className="aspect-[4/3] bg-muted animate-shimmer" />
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-5 w-16 bg-muted animate-shimmer rounded-full" />
          <div className="h-4 w-12 bg-muted animate-shimmer rounded" />
        </div>
        <div className="h-5 w-3/4 bg-muted animate-shimmer rounded" />
        <div className="h-4 w-full bg-muted animate-shimmer rounded" />
        <div className="h-4 w-2/3 bg-muted animate-shimmer rounded" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-6 w-24 bg-muted animate-shimmer rounded" />
          <div className="h-9 w-20 bg-muted animate-shimmer rounded-lg" />
        </div>
      </div>
    </motion.div>
  );
}

export function SkeletonGrid({ count = 6, variant = 'service' }: { count?: number; variant?: 'service' | 'vendor' | 'compact' }) {
  return (
    <div className={`grid gap-6 ${
      variant === 'compact' 
        ? 'grid-cols-1' 
        : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    }`}>
      {[...Array(count)].map((_, i) => (
        <SkeletonCard key={i} variant={variant} />
      ))}
    </div>
  );
}
