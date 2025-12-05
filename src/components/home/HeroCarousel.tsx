import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const slides = [
  {
    id: 1,
    title: 'Create Unforgettable',
    highlight: 'Weddings',
    description: 'From intimate ceremonies to grand celebrations, we bring your dream wedding to life.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80',
    cta: 'Explore Weddings',
    link: '/services?category=weddings',
  },
  {
    id: 2,
    title: 'Premium',
    highlight: 'Corporate Events',
    description: 'Elevate your brand with sophisticated conferences, launches, and corporate gatherings.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80',
    cta: 'View Corporate Services',
    link: '/services?category=corporate',
  },
  {
    id: 3,
    title: 'Celebrate Life\'s',
    highlight: 'Special Moments',
    description: 'Birthdays, baby showers, anniversaries - every milestone deserves a perfect celebration.',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1920&q=80',
    cta: 'Discover Services',
    link: '/services',
  },
];

export function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 6000, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', () => setSelectedIndex(emblaApi.selectedScrollSnap()));
  }, [emblaApi]);

  return (
    <section className="relative h-[85vh] min-h-[600px] max-h-[900px] overflow-hidden">
      <div ref={emblaRef} className="h-full">
        <div className="flex h-full">
          {slides.map((slide, index) => (
            <div key={slide.id} className="flex-[0_0_100%] min-w-0 relative">
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-hero" />
              
              {/* Content */}
              <div className="relative h-full container mx-auto px-4 flex items-center">
                <AnimatePresence mode="wait">
                  {selectedIndex === index && (
                    <motion.div
                      key={slide.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="max-w-2xl"
                    >
                      <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-ivory leading-tight mb-4"
                      >
                        {slide.title}{' '}
                        <span className="text-gold">{slide.highlight}</span>
                      </motion.h1>
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="text-ivory/80 text-lg md:text-xl mb-8 max-w-lg"
                      >
                        {slide.description}
                      </motion.p>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="flex flex-wrap gap-4"
                      >
                        <Link to={slide.link}>
                          <Button variant="hero" size="xl">
                            {slide.cta}
                          </Button>
                        </Link>
                        <Link to="/categories">
                          <Button variant="hero-outline" size="xl">
                            Browse Categories
                          </Button>
                        </Link>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-ivory/10 backdrop-blur-sm border border-ivory/20 flex items-center justify-center text-ivory hover:bg-ivory/20 transition-colors hidden md:flex"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-ivory/10 backdrop-blur-sm border border-ivory/20 flex items-center justify-center text-ivory hover:bg-ivory/20 transition-colors hidden md:flex"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              selectedIndex === index
                ? 'w-8 bg-gold'
                : 'w-2 bg-ivory/40 hover:bg-ivory/60'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
