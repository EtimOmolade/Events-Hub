import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Trash2, Eye, ShoppingBag, Sparkles } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { 
  eventTypeCategories, 
  eventThemes, 
  colorPalettes,
  guestSizeRanges,
  venueTypes,
  budgetRanges,
  formatPrice,
} from '@/data/eventBuilder';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function SavedPlans() {
  const navigate = useNavigate();
  const { savedPlans, removeSavedPlan, addToCart, isAuthenticated } = useStore();

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <Sparkles className="w-16 h-16 text-gold mx-auto mb-4" />
            <h1 className="font-display text-2xl font-semibold mb-2">
              Sign in to view saved plans
            </h1>
            <p className="text-muted-foreground mb-6">
              Create an account to save and manage your event plans
            </p>
            <Link to="/auth">
              <Button variant="gold">Sign In</Button>
            </Link>
          </motion.div>
        </div>
      </Layout>
    );
  }

  const handleRemovePlan = (planId: string) => {
    removeSavedPlan(planId);
    toast.success('Plan removed');
  };

  const handleAddPackageToCart = (plan: typeof savedPlans[0]) => {
    if (plan.packages.length > 0) {
      const pkg = plan.packages[0]; // Add the first (essential) package
      pkg.services.forEach((service) => {
        addToCart(service, 1);
      });
      toast.success('Package added to cart!');
    }
  };

  const getPlanDetails = (plan: typeof savedPlans[0]) => {
    const eventInfo = eventTypeCategories.find((e) => e.id === plan.eventType);
    const themeInfo = eventThemes.find((t) => t.id === plan.theme);
    const paletteInfo = colorPalettes.find((p) => p.id === plan.colorPalette);
    const guestInfo = guestSizeRanges.find((g) => g.id === plan.guestSize);
    const venueInfo = venueTypes.find((v) => v.id === plan.venueType);
    const budgetInfo = budgetRanges.find((b) => b.id === plan.budget);

    return { eventInfo, themeInfo, paletteInfo, guestInfo, venueInfo, budgetInfo };
  };

  return (
    <Layout>
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
              Saved Event Plans
            </h1>
            <p className="text-muted-foreground">
              Your saved event configurations and package recommendations
            </p>
          </motion.div>

          {savedPlans.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <Sparkles className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="font-display text-xl font-semibold mb-2">
                No saved plans yet
              </h2>
              <p className="text-muted-foreground mb-6">
                Use our Event Builder to create and save custom event plans
              </p>
              <Link to="/event-builder">
                <Button variant="gold" className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  Create Event Plan
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {savedPlans.map((plan, index) => {
                const { eventInfo, themeInfo, paletteInfo, guestInfo, venueInfo, budgetInfo } = getPlanDetails(plan);
                const cheapestPackage = plan.packages.reduce((min, pkg) => 
                  pkg.totalPrice < min.totalPrice ? pkg : min
                , plan.packages[0]);

                return (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {/* Header */}
                    <div className="p-6 border-b border-border bg-gradient-to-r from-gold/10 to-transparent">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-3xl mb-2 block">{eventInfo?.icon}</span>
                          <h3 className="font-display text-xl font-semibold mb-1">
                            {plan.name}
                          </h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Created {format(new Date(plan.createdAt), 'MMM d, yyyy')}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemovePlan(plan.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-6 space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {[
                          { icon: themeInfo?.icon, label: themeInfo?.name },
                          { icon: '🎨', label: paletteInfo?.name },
                          { icon: '👥', label: guestInfo?.range },
                          { icon: venueInfo?.icon, label: venueInfo?.name },
                          { icon: '💰', label: budgetInfo?.range },
                        ].map((item, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-muted rounded-full text-xs"
                          >
                            <span>{item.icon}</span>
                            <span className="text-muted-foreground">{item.label}</span>
                          </span>
                        ))}
                      </div>

                      {/* Packages Summary */}
                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-sm text-muted-foreground mb-2">
                          {plan.packages.length} packages generated
                        </p>
                        {cheapestPackage && (
                          <p className="text-sm">
                            Starting from{' '}
                            <span className="font-semibold text-gold">
                              {formatPrice(cheapestPackage.totalPrice)}
                            </span>
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          className="flex-1 gap-2"
                          onClick={() => navigate('/event-builder')}
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </Button>
                        <Button
                          variant="gold"
                          className="flex-1 gap-2"
                          onClick={() => handleAddPackageToCart(plan)}
                        >
                          <ShoppingBag className="w-4 h-4" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
