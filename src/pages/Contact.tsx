import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageSquare,
  Headphones,
  Users,
  Wrench,
  CheckCircle,
  Clock,
  Instagram,
  Facebook,
  Twitter
} from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().trim().email('Invalid email address').max(255, 'Email too long'),
  message: z.string().trim().min(1, 'Message is required').max(1000, 'Message too long')
});

type ContactFormData = z.infer<typeof contactSchema>;

const supportCategories = [
  {
    icon: MessageSquare,
    title: 'Booking Support',
    description: 'Get help with reservations, cancellations, and modifications.',
    email: 'bookings@eventshub.ng'
  },
  {
    icon: Users,
    title: 'Vendor Support',
    description: 'Assistance for vendors and partnership inquiries.',
    email: 'vendors@eventshub.ng'
  },
  {
    icon: Wrench,
    title: 'Tech Support',
    description: 'Technical issues with the platform or app.',
    email: 'support@eventshub.ng'
  }
];

const contactInfo = [
  {
    icon: MapPin,
    title: 'Visit Us',
    content: '123 Victoria Island, Lagos, Nigeria',
    link: null
  },
  {
    icon: Phone,
    title: 'Call Us',
    content: '+234 123 456 7890',
    link: 'tel:+2341234567890'
  },
  {
    icon: Mail,
    title: 'Email Us',
    content: 'hello@eventshub.ng',
    link: 'mailto:hello@eventshub.ng'
  }
];

export default function Contact() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name as keyof ContactFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<ContactFormData> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof ContactFormData] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    // Simulate sending (mock)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Store locally (could send to backend)
    const contactSubmissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    contactSubmissions.push({
      ...result.data,
      submittedAt: new Date().toISOString()
    });
    localStorage.setItem('contactSubmissions', JSON.stringify(contactSubmissions));

    setIsSubmitting(false);
    setIsSuccess(true);
    setFormData({ name: '', email: '', message: '' });
    
    toast.success('Message sent successfully!', {
      description: "We'll get back to you within 24 hours."
    });

    // Reset success animation after 3 seconds
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-gradient-to-b from-secondary to-background overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-10 w-40 h-40 bg-gold/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative">
          <motion.div 
            className="max-w-2xl mx-auto text-center"
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
              <Headphones className="w-4 h-4" />
              <span className="text-sm font-medium">We're Here to Help</span>
            </motion.div>

            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Contact & <span className="text-gold">Support</span>
            </h1>

            <p className="text-lg text-muted-foreground">
              Have a question or need assistance? Our team is ready to help you create the perfect event.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 -mt-16 relative z-10">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="border-border/50 shadow-card hover:shadow-elevated transition-shadow">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                      <info.icon className="w-6 h-6 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{info.title}</h3>
                      {info.link ? (
                        <a 
                          href={info.link}
                          className="text-muted-foreground hover:text-gold transition-colors text-sm"
                        >
                          {info.content}
                        </a>
                      ) : (
                        <p className="text-muted-foreground text-sm">{info.content}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-border/50 shadow-card">
                <CardHeader>
                  <CardTitle className="font-display text-2xl">Send Us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you within 24 hours.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AnimatePresence mode="wait">
                    {isSuccess ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="py-12 text-center"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                          className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6"
                        >
                          <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                        </motion.div>
                        <h3 className="font-display text-xl font-semibold mb-2">Message Sent!</h3>
                        <p className="text-muted-foreground">We'll be in touch shortly.</p>
                      </motion.div>
                    ) : (
                      <motion.form
                        key="form"
                        onSubmit={handleSubmit}
                        className="space-y-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            name="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={errors.name ? 'border-destructive' : ''}
                            disabled={isSubmitting}
                          />
                          {errors.name && (
                            <p className="text-destructive text-sm">{errors.name}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={errors.email ? 'border-destructive' : ''}
                            disabled={isSubmitting}
                          />
                          {errors.email && (
                            <p className="text-destructive text-sm">{errors.email}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message">Your Message</Label>
                          <Textarea
                            id="message"
                            name="message"
                            placeholder="How can we help you today?"
                            rows={5}
                            value={formData.message}
                            onChange={handleInputChange}
                            className={errors.message ? 'border-destructive' : ''}
                            disabled={isSubmitting}
                          />
                          {errors.message && (
                            <p className="text-destructive text-sm">{errors.message}</p>
                          )}
                        </div>

                        <Button 
                          type="submit" 
                          variant="gold" 
                          size="lg" 
                          className="w-full gap-2"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                              />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="w-5 h-5" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>

            {/* Support Categories & Map */}
            <div className="space-y-8">
              {/* Support Categories */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="font-display text-2xl font-bold mb-6">
                  Support <span className="text-gold">Categories</span>
                </h2>
                <div className="space-y-4">
                  {supportCategories.map((category, index) => (
                    <motion.div
                      key={category.title}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                    >
                      <Card className="border-border/50 hover:border-gold/50 transition-colors">
                        <CardContent className="p-5 flex items-start gap-4">
                          <div className="w-11 h-11 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                            <category.icon className="w-5 h-5 text-gold" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{category.title}</h3>
                            <p className="text-muted-foreground text-sm mb-2">{category.description}</p>
                            <a 
                              href={`mailto:${category.email}`}
                              className="text-gold text-sm font-medium hover:underline"
                            >
                              {category.email}
                            </a>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Map Placeholder */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="font-display text-2xl font-bold mb-6">
                  Service <span className="text-gold">Coverage</span>
                </h2>
                <Card className="border-border/50 overflow-hidden">
                  <div className="aspect-[16/10] bg-muted relative">
                    {/* Map placeholder with styled appearance */}
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="w-12 h-12 text-gold mx-auto mb-4" />
                        <p className="text-muted-foreground font-medium">Lagos, Nigeria & Surrounding Areas</p>
                        <p className="text-sm text-muted-foreground/60 mt-2">
                          We serve events across 15+ cities
                        </p>
                      </div>
                    </div>
                    {/* Decorative dots */}
                    <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-gold rounded-full animate-pulse" />
                    <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-gold rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                    <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-gold rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                  </div>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>Response within 24 hours</span>
                    </div>
                    <div className="flex gap-3">
                      <a href="#" className="text-muted-foreground hover:text-gold transition-colors">
                        <Instagram className="w-5 h-5" />
                      </a>
                      <a href="#" className="text-muted-foreground hover:text-gold transition-colors">
                        <Facebook className="w-5 h-5" />
                      </a>
                      <a href="#" className="text-muted-foreground hover:text-gold transition-colors">
                        <Twitter className="w-5 h-5" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Teaser */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-xl mx-auto text-center"
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
              Need Quick Answers?
            </h2>
            <p className="text-muted-foreground mb-6">
              Our support team typically responds within 24 hours. For urgent matters, call us directly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:+2341234567890">
                <Button variant="gold" size="lg" className="w-full sm:w-auto gap-2">
                  <Phone className="w-5 h-5" />
                  Call Now
                </Button>
              </a>
              <a href="mailto:hello@eventshub.ng">
                <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2">
                  <Mail className="w-5 h-5" />
                  Email Support
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
