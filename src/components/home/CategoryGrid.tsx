import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { categories } from '@/data/services';

const categoryImages: Record<string, string> = {
  weddings: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400',
  birthdays: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400',
  corporate: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
  'baby-showers': 'https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=400',
  concerts: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
  catering: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=400',
  decorations: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400',
  photography: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=400',
  rentals: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400',
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function CategoryGrid() {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Browse by <span className="text-gold">Category</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our comprehensive range of event services tailored for every occasion
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
        >
          {categories.map((category, index) => (
            <motion.div key={category.id} variants={item}>
              <Link
                to={`/services?category=${category.id}`}
                className="group relative block aspect-square overflow-hidden rounded-2xl"
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${categoryImages[category.id]})` }}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-rich-black/90 via-rich-black/40 to-transparent transition-all duration-300 group-hover:from-gold/90 group-hover:via-gold/40" />
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-end p-4 text-center">
                  <span className="text-3xl mb-2 transition-transform duration-300 group-hover:scale-110">
                    {category.icon}
                  </span>
                  <h3 className="font-display text-lg font-semibold text-ivory group-hover:text-rich-black transition-colors">
                    {category.name}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
