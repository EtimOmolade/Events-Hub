import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Sparkles, Save, Scale, Wand2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { EventBuilderProgress } from '@/components/eventBuilder/EventBuilderProgress';
import { StepEventType } from '@/components/eventBuilder/StepEventType';
import { StepTheme } from '@/components/eventBuilder/StepTheme';
import { StepGuests } from '@/components/eventBuilder/StepGuests';
import { StepBudget } from '@/components/eventBuilder/StepBudget';
import { PackageCard } from '@/components/eventBuilder/PackageCard';
import { PackageComparison } from '@/components/eventBuilder/PackageComparison';
import { 
  generateEventPackages, 
  GeneratedPackage,
  eventTypeCategories,
  eventThemes,
  colorPalettes,
  guestSizeRanges,
  venueTypes,
  budgetRanges,
} from '@/data/eventBuilder';
import { useStore } from '@/store/useStore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const STEPS = [
  { id: 1, title: 'Event Type', description: 'What are you celebrating?' },
  { id: 2, title: 'Theme & Colors', description: 'Choose your style' },
  { id: 3, title: 'Guests & Venue', description: 'Size and location' },
  { id: 4, title: 'Budget', description: 'Set your budget' },
  { id: 5, title: 'Your Packages', description: 'Review and select' },
];

export default function EventBuilder() {
  const navigate = useNavigate();
  const { addToCart, addSavedPlan, isAuthenticated, aiRecommendation, setAIRecommendation } = useStore();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [eventType, setEventType] = useState<string | null>(null);
  const [theme, setTheme] = useState<string | null>(null);
  const [colorPalette, setColorPalette] = useState<string | null>(null);
  const [guestSize, setGuestSize] = useState<string | null>(null);
  const [venueType, setVenueType] = useState<string | null>(null);
  const [budget, setBudget] = useState<string | null>(null);
  const [generatedPackages, setGeneratedPackages] = useState<GeneratedPackage[]>([]);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [showAIBanner, setShowAIBanner] = useState(false);

  // Check for AI recommendations on mount
  useEffect(() => {
    if (aiRecommendation) {
      setShowAIBanner(true);
    }
  }, []);

  // Apply AI recommendations
  const applyAIRecommendations = () => {
    if (!aiRecommendation) return;
    
    let applied = [];
    
    if (aiRecommendation.eventType) {
      setEventType(aiRecommendation.eventType);
      applied.push('Event Type');
    }
    if (aiRecommendation.theme) {
      setTheme(aiRecommendation.theme);
      applied.push('Theme');
    }
    if (aiRecommendation.colorPalette) {
      setColorPalette(aiRecommendation.colorPalette);
      applied.push('Colors');
    }
    if (aiRecommendation.guestSize) {
      setGuestSize(aiRecommendation.guestSize);
      applied.push('Guest Size');
    }
    if (aiRecommendation.venueType) {
      setVenueType(aiRecommendation.venueType);
      applied.push('Venue');
    }
    if (aiRecommendation.budget) {
      setBudget(aiRecommendation.budget);
      applied.push('Budget');
    }

    setShowAIBanner(false);
    setAIRecommendation(null);
    
    toast.success('AI preferences applied!', {
      description: `Applied: ${applied.join(', ')}`,
    });
  };

  const dismissAIBanner = () => {
    setShowAIBanner(false);
    setAIRecommendation(null);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return eventType !== null;
      case 2: return theme !== null && colorPalette !== null;
      case 3: return guestSize !== null && venueType !== null;
      case 4: return budget !== null;
      default: return true;
    }
  };

  const handleNext = () => {
    if (currentStep === 4) {
      // Generate packages
      const packages = generateEventPackages(
        eventType!,
        theme!,
        colorPalette!,
        guestSize!,
        venueType!,
        budget!
      );
      setGeneratedPackages(packages);
    }
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSelectForComparison = (pkgId: string) => {
    setSelectedForComparison((prev) => {
      if (prev.includes(pkgId)) {
        return prev.filter((id) => id !== pkgId);
      }
      if (prev.length >= 3) {
        toast.info('You can compare up to 3 packages at a time');
        return prev;
      }
      return [...prev, pkgId];
    });
  };

  const handleAddPackageToCart = (pkg: GeneratedPackage) => {
    pkg.services.forEach((service) => {
      addToCart(service, 1);
    });
    toast.success(`${pkg.name} added to cart!`, {
      description: `${pkg.services.length} services added`,
    });
  };

  const handleSavePlan = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to save your event plan');
      navigate('/auth');
      return;
    }

    const plan = {
      id: `plan-${Date.now()}`,
      name: `${eventTypeCategories.find(e => e.id === eventType)?.name} Plan`,
      eventType: eventType!,
      theme: theme!,
      colorPalette: colorPalette!,
      guestSize: guestSize!,
      venueType: venueType!,
      budget: budget!,
      createdAt: new Date().toISOString(),
      packages: generatedPackages,
    };

    addSavedPlan(plan);
    toast.success('Event plan saved!', {
      description: 'View your saved plans in your account',
    });
  };

  const comparisonPackages = generatedPackages.filter((pkg) =>
    selectedForComparison.includes(pkg.id)
  );

  // Summary Info
  const getSummaryInfo = () => {
    const eventInfo = eventTypeCategories.find((e) => e.id === eventType);
    const themeInfo = eventThemes.find((t) => t.id === theme);
    const paletteInfo = colorPalettes.find((p) => p.id === colorPalette);
    const guestInfo = guestSizeRanges.find((g) => g.id === guestSize);
    const venueInfo = venueTypes.find((v) => v.id === venueType);
    const budgetInfo = budgetRanges.find((b) => b.id === budget);

    return { eventInfo, themeInfo, paletteInfo, guestInfo, venueInfo, budgetInfo };
  };

  return (
    <Layout>
      <div className="min-h-screen py-8 bg-gradient-to-b from-secondary/50 to-background">
        <div className="container mx-auto px-4">
          {/* Back to Previous Page Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-4"
          >
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 rounded-full text-gold text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              AI-Powered Event Builder
            </div>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Build Your Perfect Event
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tell us about your dream event and we'll create personalized package recommendations just for you
            </p>
          </motion.div>

          {/* AI Recommendations Banner */}
          <AnimatePresence>
            {showAIBanner && aiRecommendation && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6 p-4 bg-gradient-to-r from-gold/10 to-gold-light/10 border border-gold/30 rounded-xl"
              >
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                      <Wand2 className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">AI Recommendations Ready</h3>
                      <p className="text-xs text-muted-foreground">
                        Based on your conversation, we've prepared some suggestions
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={dismissAIBanner}>
                      Dismiss
                    </Button>
                    <Button variant="gold" size="sm" onClick={applyAIRecommendations} className="gap-2">
                      <Wand2 className="w-4 h-4" />
                      Apply Suggestions
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress */}
          <EventBuilderProgress steps={STEPS} currentStep={currentStep} />

          {/* Step Content */}
          <div className="max-w-5xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="py-8"
              >
                {currentStep === 1 && (
                  <StepEventType selected={eventType} onSelect={setEventType} />
                )}
                {currentStep === 2 && (
                  <StepTheme
                    selectedTheme={theme}
                    selectedPalette={colorPalette}
                    onSelectTheme={setTheme}
                    onSelectPalette={setColorPalette}
                  />
                )}
                {currentStep === 3 && (
                  <StepGuests
                    selectedSize={guestSize}
                    selectedVenue={venueType}
                    onSelectSize={setGuestSize}
                    onSelectVenue={setVenueType}
                  />
                )}
                {currentStep === 4 && (
                  <StepBudget selected={budget} onSelect={setBudget} />
                )}
                {currentStep === 5 && (
                  <div className="space-y-8">
                    {/* Summary */}
                    <div className="text-center">
                      <h2 className="font-display text-2xl md:text-3xl font-semibold mb-2">
                        Your Recommended Packages
                      </h2>
                      <p className="text-muted-foreground">
                        Based on your preferences, here are our top picks
                      </p>
                    </div>

                    {/* Selection Summary */}
                    {(() => {
                      const { eventInfo, themeInfo, paletteInfo, guestInfo, venueInfo, budgetInfo } = getSummaryInfo();
                      return (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex flex-wrap items-center justify-center gap-3"
                        >
                          {[
                            { icon: eventInfo?.icon, label: eventInfo?.name },
                            { icon: themeInfo?.icon, label: themeInfo?.name },
                            { icon: '🎨', label: paletteInfo?.name },
                            { icon: '👥', label: guestInfo?.range },
                            { icon: venueInfo?.icon, label: venueInfo?.name },
                            { icon: '💰', label: budgetInfo?.range },
                          ].map((item, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded-full text-sm"
                            >
                              <span>{item.icon}</span>
                              <span className="text-muted-foreground">{item.label}</span>
                            </span>
                          ))}
                        </motion.div>
                      );
                    })()}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center justify-center gap-4">
                      <Button
                        variant="outline"
                        onClick={handleSavePlan}
                        className="gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Save Plan
                      </Button>
                      {selectedForComparison.length >= 2 && (
                        <Button
                          variant="gold"
                          onClick={() => setShowComparison(true)}
                          className="gap-2"
                        >
                          <Scale className="w-4 h-4" />
                          Compare ({selectedForComparison.length})
                        </Button>
                      )}
                    </div>

                    {/* Package Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {generatedPackages.map((pkg, index) => (
                        <PackageCard
                          key={pkg.id}
                          pkg={pkg}
                          isSelected={selectedForComparison.includes(pkg.id)}
                          onSelect={() => handleSelectForComparison(pkg.id)}
                          onAddToCart={() => handleAddPackageToCart(pkg)}
                          index={index}
                        />
                      ))}
                    </div>

                    {generatedPackages.length === 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                      >
                        <p className="text-muted-foreground">
                          No packages found for your criteria. Try adjusting your budget or guest size.
                        </p>
                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={() => setCurrentStep(4)}
                        >
                          Adjust Budget
                        </Button>
                      </motion.div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-8 border-t border-border">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>

              {currentStep < 5 && (
                <Button
                  variant="gold"
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="gap-2"
                >
                  {currentStep === 4 ? 'Generate Packages' : 'Continue'}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}

              {currentStep === 5 && (
                <Button
                  variant="gold"
                  onClick={() => navigate('/cart')}
                  className="gap-2"
                >
                  View Cart
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Modal */}
      <AnimatePresence>
        {showComparison && comparisonPackages.length >= 2 && (
          <PackageComparison
            packages={comparisonPackages}
            onClose={() => setShowComparison(false)}
            onAddToCart={(pkg) => {
              handleAddPackageToCart(pkg);
              setShowComparison(false);
            }}
          />
        )}
      </AnimatePresence>
    </Layout>
  );
}
