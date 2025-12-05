import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-rich-black text-ivory/80">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
                <span className="text-rich-black font-display font-bold text-lg">E</span>
              </div>
              <span className="font-display text-xl font-semibold text-ivory">
                Events<span className="text-gold">Hub</span>
              </span>
            </Link>
            <p className="text-ivory/60 text-sm leading-relaxed">
              Your premier destination for unforgettable events. From intimate gatherings to grand celebrations, we bring your vision to life.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-ivory/60 hover:text-gold transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-ivory/60 hover:text-gold transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-ivory/60 hover:text-gold transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold text-ivory mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {['Services', 'Categories', 'Vendors', 'About Us', 'Contact'].map((link) => (
                <li key={link}>
                  <Link
                    to={`/${link.toLowerCase().replace(' ', '-')}`}
                    className="text-ivory/60 hover:text-gold transition-colors text-sm"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display text-lg font-semibold text-ivory mb-4">Categories</h4>
            <ul className="space-y-3">
              {['Weddings', 'Birthdays', 'Corporate', 'Catering', 'Photography'].map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/services?category=${cat.toLowerCase()}`}
                    className="text-ivory/60 hover:text-gold transition-colors text-sm"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold text-ivory mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                <span className="text-ivory/60 text-sm">
                  123 Victoria Island,<br />Lagos, Nigeria
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gold shrink-0" />
                <a href="tel:+2341234567890" className="text-ivory/60 hover:text-gold transition-colors text-sm">
                  +234 123 456 7890
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gold shrink-0" />
                <a href="mailto:hello@eventshub.ng" className="text-ivory/60 hover:text-gold transition-colors text-sm">
                  hello@eventshub.ng
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-ivory/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-ivory/40 text-sm">
            © {new Date().getFullYear()} Events Hub. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-ivory/40 hover:text-ivory/60 text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-ivory/40 hover:text-ivory/60 text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
