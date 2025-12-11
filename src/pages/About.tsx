import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Award, 
  Shield, 
  Clock, 
  Users, 
  Heart, 
  Star, 
  Sparkles,
  Target,
  Lightbulb,
  Handshake,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const timelineEvents = [
  {
    year: '2019',
    title: 'The Beginning',
    description: 'Events Hub was founded with a vision to revolutionize event planning in Nigeria.'
  },
  {
    year: '2020',
    title: 'Growing Strong',
    description: 'Partnered with 50+ verified vendors and served over 500 successful events.'
  },
  {
    year: '2021',
    title: 'Digital Innovation',
    description: 'Launched our custom event builder tool, making planning easier than ever.'
  },
  {
    year: '2022',
    title: 'Nationwide Reach',
    description: 'Expanded services to 15 major cities across Nigeria with 200+ vendors.'
  },
  {
    year: '2023',
    title: 'Excellence Award',
    description: 'Recognized as the #1 event planning platform in West Africa.'
  },
  {
    year: '2024',
    title: 'The Future',
    description: 'Continuing to innovate with AI-powered recommendations and seamless booking.'
  }
];

const values = [
  {
    icon: Target,
    title: 'Excellence',
    description: 'We strive for perfection in every event, ensuring memorable experiences.'
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'Constantly evolving our platform to make event planning seamless.'
  },
  {
    icon: Handshake,
    title: 'Trust',
    description: 'Building lasting relationships with clients and vendors alike.'
  },
  {
    icon: Heart,
    title: 'Passion',
    description: 'We love what we do, and it shows in every celebration we create.'
  }
];

const stats = [
  { value: '10,000+', label: 'Events Delivered' },
  { value: '500+', label: 'Verified Vendors' },
  { value: '15+', label: 'Cities Covered' },
  { value: '98%', label: 'Client Satisfaction' }
];

const teamMembers = [
  {
    name: 'Adaeze Okonkwo',
    role: 'Founder',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face',
    bio: 'Visionary leader with 15+ years in event management.'
  },
  {
    name: 'Emeka Nwosu',
    role: 'Chief Operations Officer',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
    bio: 'Operations expert ensuring seamless event execution.'
  },
  {
    name: 'Fatima Hassan',
    role: 'Head of Vendor Relations',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face',
    bio: 'Building bridges between clients and top-tier vendors.'
  },
  {
    name: 'Chidi Eze',
    role: 'Creative Director',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
    bio: 'Crafting stunning visual experiences for every event.'
  }
];

const whyChooseUs = [
  {
    icon: Award,
    title: 'Premium Quality',
    description: 'Only verified, top-rated vendors curated for excellence.'
  },
  {
    icon: Shield,
    title: 'Secure Booking',
    description: 'Protected transactions and safe payment processing.'
  },
  {
    icon: Clock,
    title: '24/7 Support',
    description: 'Round-the-clock assistance at every step.'
  },
  {
    icon: Users,
    title: 'Expert Vendors',
    description: 'Experienced professionals who bring visions to life.'
  }
];

export default function About() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-gradient-to-b from-secondary to-background overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gold/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-gold/10 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 text-gold mb-6"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">About Events Hub</span>
            </motion.div>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Crafting <span className="text-gold">Unforgettable</span> Moments
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              We're on a mission to transform how events are planned and celebrated. 
              From intimate gatherings to grand celebrations, we bring your vision to life.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-rich-black text-ivory">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={fadeInUp}
                className="text-center"
              >
                <div className="font-display text-3xl md:text-4xl font-bold text-gold mb-2">
                  {stat.value}
                </div>
                <div className="text-ivory/60 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                Our <span className="text-gold">Mission</span>
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                At Events Hub, we believe every celebration deserves to be extraordinary. 
                Our mission is to connect people with the best event professionals, 
                making the planning process seamless, enjoyable, and stress-free.
              </p>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                We've built a platform where dreams meet expertise, where creativity 
                flourishes, and where every detail is crafted with care and precision.
              </p>
              
              <div className="space-y-3">
                {[
                  'Curated network of verified vendors',
                  'Transparent pricing with no hidden fees',
                  'End-to-end event planning support',
                  'Satisfaction guaranteed on every booking'
                ].map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-gold shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-elevated">
                <img 
                  src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80" 
                  alt="Beautiful event setup"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gold/20 rounded-2xl -z-10" />
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/20 rounded-full -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Our Core <span className="text-gold">Values</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {values.map((value, index) => (
              <motion.div key={value.title} variants={fadeInUp}>
                <Card className="h-full border-border/50 hover:border-gold/50 transition-colors group">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-gold/20 transition-colors">
                      <value.icon className="w-7 h-7 text-gold" />
                    </div>
                    <h3 className="font-display text-lg font-semibold mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Our <span className="text-gold">Journey</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              From a small idea to Nigeria's leading event platform
            </p>
          </motion.div>

          <div className="relative max-w-3xl mx-auto">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-px" />
            
            {timelineEvents.map((event, index) => (
              <motion.div
                key={event.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`relative flex items-start gap-8 mb-12 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Dot */}
                <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-gold rounded-full md:-translate-x-1.5 mt-1.5 z-10" />
                
                {/* Content */}
                <div className={`pl-12 md:pl-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                  <span className="inline-block px-3 py-1 bg-gold/10 text-gold rounded-full text-sm font-semibold mb-2">
                    {event.year}
                  </span>
                  <h3 className="font-display text-xl font-semibold mb-2">{event.title}</h3>
                  <p className="text-muted-foreground text-sm">{event.description}</p>
                </div>
                
                <div className="hidden md:block md:w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Meet Our <span className="text-gold">Team</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              The passionate people behind Events Hub
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {teamMembers.map((member, index) => (
              <motion.div key={member.name} variants={fadeInUp}>
                <Card className="overflow-hidden group border-border/50 hover:border-gold/50 transition-all hover:shadow-elevated">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-5 text-center">
                    <h3 className="font-display text-lg font-semibold mb-1">{member.name}</h3>
                    <p className="text-gold text-sm font-medium mb-2">{member.role}</p>
                    <p className="text-muted-foreground text-sm">{member.bio}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-rich-black text-ivory">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Why Choose <span className="text-gold">Events Hub</span>
            </h2>
            <p className="text-ivory/60 max-w-xl mx-auto">
              Experience the difference with our premium event planning services
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {whyChooseUs.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                className="text-center group"
              >
                <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-gold/20 transition-colors">
                  <feature.icon className="w-8 h-8 text-gold" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-ivory/60 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-background to-secondary/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
              Ready to Create Your <span className="text-gold">Perfect Event</span>?
            </h2>
            <p className="text-muted-foreground mb-8">
              Start planning today with our easy-to-use Event Builder or explore our curated vendors.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/event-builder">
                <Button variant="gold" size="lg" className="w-full sm:w-auto gap-2">
                  <Sparkles className="w-5 h-5" />
                  Start Building Your Event
                </Button>
              </Link>
              <Link to="/vendors">
                <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2">
                  Explore Vendors
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
