import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, MapPin, BadgeCheck, ArrowRight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { vendors, services } from '@/data/services';

export default function Vendors() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Our <span className="text-gold">Vendors</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Partner with the best event professionals who bring expertise, creativity, and passion to every celebration
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map((vendor, index) => {
            const vendorServices = services.filter((s) => s.vendorId === vendor.id);
            
            return (
              <motion.div
                key={vendor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-card rounded-2xl border overflow-hidden hover:shadow-elevated transition-all duration-300"
              >
                <div className="relative h-32 bg-gradient-to-r from-gold/20 to-gold-light/20">
                  <img
                    src={vendor.avatar}
                    alt={vendor.name}
                    className="absolute -bottom-12 left-6 w-24 h-24 rounded-full object-cover border-4 border-background"
                  />
                  {vendor.verified && (
                    <Badge className="absolute top-4 right-4 bg-gold text-rich-black border-0">
                      <BadgeCheck className="w-4 h-4 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                
                <div className="pt-16 p-6">
                  <h3 className="font-display text-xl font-bold mb-1 group-hover:text-gold transition-colors">
                    {vendor.name}
                  </h3>
                  <p className="text-gold text-sm font-medium mb-2">{vendor.specialty}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-gold fill-gold" />
                      <span className="font-medium text-foreground">{vendor.rating}</span>
                      <span>({vendor.reviewCount})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{vendor.location}</span>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {vendor.bio}
                  </p>
                  
                  <p className="text-sm mb-4">
                    <span className="text-muted-foreground">Services: </span>
                    <span className="font-medium">{vendorServices.length} available</span>
                  </p>
                  
                  <Link to={`/services?vendor=${vendor.id}`}>
                    <Button variant="gold-outline" className="w-full group/btn">
                      View Services
                      <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
