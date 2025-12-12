import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Sparkles, ShoppingCart } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { StepEventType } from '@/components/eventBuilder/StepEventType';
import { StepTheme } from '@/components/eventBuilder/StepTheme';
import { StepGuests } from '@/components/eventBuilder/StepGuests';
import { StepBudget } from '@/components/eventBuilder/StepBudget';
import { PackageCard } from '@/components/eventBuilder/PackageCard';
import { generateEventPackages, GeneratedPackage } from '@/data/eventBuilder';
import { useStore } from '@/store/useStore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const STEPS = [
  { id: 1, title: 'Event Type', description: 'What are you celebrating?' },
  { id: 2, title: 'Theme & Style', description: 'Choose your aesthetic' },
  { id: 3, title: 'Guest Count', description: 'How many people?' },
  { id: 4, title: 'Budget', description: 'Set your budget' },
  { id: 5, title: 'Packages', description: 'Review recommendations' },
];

interface BuilderState {
  eventType: string | null;
  theme: string | null;
  colorPalette: string | null;
  guestSize: string | null;
  venueType: string | null;
  budget: string | null;
}

const initialState: BuilderState = {
  eventType: null,
  theme: null,
  colorPalette: null,
  guestSize: null,
  venueType: null,
  budget: null,
};

export default function EventBuilder() {
  const navigate = useNavigate();
  const { addToCart, isAuthenticated } = useStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [state, setState] = useState<BuilderState>(initialState);
  const [packages, setPackages] = useState<GeneratedPackage[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);

  // Scroll to top whenever currentStep changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const canProceed = () => {
    switch (currentStep) {
      case 1: return !!state.eventType;
      case 2: return !!state.theme && !!state.colorPalette;
      case 3: return !!state.guestSize && !!state.venueType;
      case 4: return !!state.budget;
      default: return true;
    }
  };

  const handleNext = () => {
    if (!canProceed()) {
      toast.error('Please complete this step before continuing');
      return;
    }

    if (currentStep === 4) {
      const generatedPackages = generateEventPackages(
        state.eventType!,
        state.theme!,
        state.colorPalette!,
        state.guestSize!,
        state.venueType!,
        state.budget!
      );
      setPackages(generatedPackages);
    }

    if (currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigate('/account');
    }
  };

  const handleReset = () => {
    setState(initialState);
    setPackages([]);
    setSelectedPackageId(null);
    setCurrentStep(1);
    toast.success('Builder reset successfully');
  };

  const handleAddToCart = (pkg: GeneratedPackage) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to add packages to cart');
      navigate('/auth');
      return;
    }

    console.log('Adding package to cart:', pkg.name);
    console.log('Services in package:', pkg.services.length);
    console.log('Event builder state:', state);

    if (pkg.services.length === 0) {
      toast.error('This package has no services. Please try a different package.');
      return;
    }

    // Create event metadata to store with cart items
    const eventMetadata = {
      eventType: state.eventType || undefined,
      notes: `Event Builder: Theme - ${state.theme || 'Not specified'}, Color - ${state.colorPalette || 'Not specified'}, Guest Size - ${state.guestSize || 'Not specified'}, Venue - ${state.venueType || 'Not specified'}, Budget - ${state.budget || 'Not specified'}`,
    };

    // Add services to cart with event metadata
    pkg.services.forEach((service, index) => {
      console.log(`Adding service ${index + 1}:`, service.name);
      addToCart(service);
    });

    // Immediately update cart items with event metadata and persist
    setTimeout(() => {
      const currentCart = useStore.getState().cart;
      const updatedCart = currentCart.map(item => {
        // If this item is one of the services we just added
        if (pkg.services.some(s => s.id === item.service.id)) {
          return { ...item, ...eventMetadata };
        }
        return item;
      });

      // Update the cart with event metadata
      useStore.setState({ cart: updatedCart });

      // Force save to database
      const { user, saveToDB } = useStore.getState();
      if (user) {
        saveToDB('cart', updatedCart);
      }

      console.log('Cart updated with event metadata:', updatedCart);
    }, 100);

    toast.success(`${pkg.name} added to cart! (${pkg.services.length} services)`);
  };

  const handleViewCart = () => {
    // Pass the builder state (including event type) to cart
    navigate('/cart', { state: { builderState: state } });
  };

  const updateState = <K extends keyof BuilderState>(key: K, value: BuilderState[K]) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepEventType selected={state.eventType} onSelect={(id) => updateState('eventType', id)} />;
      case 2:
        return (
          <StepTheme
            selectedTheme={state.theme}
            selectedPalette={state.colorPalette}
            onSelectTheme={(id) => updateState('theme', id)}
            onSelectPalette={(id) => updateState('colorPalette', id)}
          />
        );
      case 3:
        return (
          <StepGuests
            selectedSize={state.guestSize}
            selectedVenue={state.venueType}
            onSelectSize={(id) => updateState('guestSize', id)}
            onSelectVenue={(id) => updateState('venueType', id)}
          />
        );
      case 4:
        return <StepBudget selected={state.budget} onSelect={(id) => updateState('budget', id)} />;
      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="font-display text-2xl md:text-3xl font-semibold mb-2">
                Your Recommended Packages
              </h2>
              <p className="text-muted-foreground">
                Based on your preferences, here are our top picks
              </p>
            </div>

            {packages.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No packages found for your criteria. Try adjusting your selections.</p>
                <Button variant="outline" onClick={handleReset} className="mt-4">
                  Start Over
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {packages.map((pkg, index) => (
                    <motion.div
                      key={pkg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <PackageCard
                        pkg={pkg}
                        isSelected={selectedPackageId === pkg.id}
                        onSelect={() => setSelectedPackageId(pkg.id)}
                        onAddToCart={() => handleAddToCart(pkg)}
                        index={index}
                      />
                    </motion.div>
                  ))}
                </div>

                <div className="flex justify-center gap-4 pt-6">
                  <Button variant="outline" onClick={handleReset}>Start New Plan</Button>
                  <Button variant="gold" onClick={handleViewCart}>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    View Cart
                  </Button>
                </div>
              </>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
        <div className="container mx-auto px-4 py-6">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <Button variant="ghost" size="sm" onClick={() => navigate('/account')} className="mb-4 gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Account
            </Button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-rich-black" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-bold">Event Builder</h1>
                <p className="text-muted-foreground text-sm">Build your perfect event step by step</p>
              </div>
            </div>

            {/* Progress Bar & Steps */}
            {/* ... same as your current code ... */}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-2xl border border-border shadow-lg p-6 md:p-8 min-h-[400px]"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {currentStep < 5 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-between mt-6"
            >
              <Button variant="outline" onClick={handleBack} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                {currentStep === 1 ? 'Cancel' : 'Back'}
              </Button>

              <Button variant="gold" onClick={handleNext} disabled={!canProceed()} className="gap-2">
                {currentStep === 4 ? (
                  <>
                    Generate Packages
                    <Check className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
}
