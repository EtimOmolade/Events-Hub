import { motion } from 'framer-motion';
import { Award, Shield, Clock, Users } from 'lucide-react';

const features = [
  {
    icon: Award,
    title: 'Premium Quality',
    description: 'Only verified, top-rated vendors and services curated for excellence.',
  },
  {
    icon: Shield,
    title: 'Secure Booking',
    description: 'Safe payments and protected transactions with our secure platform.',
  },
  {
    icon: Clock,
    title: '24/7 Support',
    description: 'Round-the-clock customer support to assist you at every step.',
  },
  {
    icon: Users,
    title: 'Expert Vendors',
    description: 'Connect with experienced professionals who bring your vision to life.',
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-20 bg-rich-black text-ivory relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Why Choose <span className="text-gold">Events Hub</span>
          </h2>
          <p className="text-ivory/60 max-w-2xl mx-auto">
            Experience the difference with our premium event planning services
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="text-center group"
            >
              <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-gold/20 transition-colors">
                <feature.icon className="w-8 h-8 text-gold" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-ivory/60 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
