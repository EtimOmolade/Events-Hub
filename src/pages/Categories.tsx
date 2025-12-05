import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { categories, services } from '@/data/services';

const categoryImages: Record<string, string> = {
  weddings: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
  birthdays: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800',
  corporate: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
  'baby-showers': 'https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=800',
  concerts: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
  catering: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800',
  decorations: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800',
  photography: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800',
  rentals: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
};

export default function Categories() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Explore <span className="text-gold">Categories</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover our comprehensive range of event services, each designed to make your special occasion unforgettable
          </p>
        </motion.div>

        <div className="grid gap-6">
          {categories.map((category, index) => {
            const serviceCount = services.filter((s) => s.category === category.id).length;
            
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/services?category=${category.id}`}
                  className="group flex flex-col md:flex-row items-stretch bg-card rounded-2xl overflow-hidden border hover:shadow-elevated transition-all duration-300"
                >
                  <div className="md:w-1/3 aspect-video md:aspect-auto relative overflow-hidden">
                    <img
                      src={categoryImages[category.id]}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-rich-black/50 to-transparent" />
                    <span className="absolute top-4 left-4 text-5xl">
                      {category.icon}
                    </span>
                  </div>
                  <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="font-display text-2xl font-bold mb-2 group-hover:text-gold transition-colors">
                          {category.name}
                        </h2>
                        <p className="text-muted-foreground mb-4">
                          {category.description}
                        </p>
                        <p className="text-sm text-gold font-medium">
                          {serviceCount} services available
                        </p>
                      </div>
                      <div className="hidden md:flex w-12 h-12 rounded-full bg-gold/10 items-center justify-center shrink-0 group-hover:bg-gold group-hover:text-rich-black transition-all">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
