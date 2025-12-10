import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { formatPrice } from '@/data/services';

export default function Cart() {
  const navigate = useNavigate();
  const location = useLocation();
  const previousBuilderState = location.state?.builderState;

  const { cart, removeFromCart, updateCartQuantity, getCartTotal, isAuthenticated } = useStore();

  const total = getCartTotal();
  const serviceFee = Math.round(total * 0.05);
  const grandTotal = total + serviceFee;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/auth?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  const handleBack = () => {
    if (previousBuilderState) {
      // Navigate back to Event Builder with state preserved
      navigate('/event-builder', { state: { builderState: previousBuilderState } });
    } else {
      navigate(-1); // fallback
    }
  };

  if (cart.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-muted-foreground" />
            </div>
            <h1 className="font-display text-3xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added any services yet. Start exploring our amazing offerings!
            </p>
            <Link to="/services">
              <Button variant="gold" size="lg">
                Browse Services
              </Button>
            </Link>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          className="mb-6 flex items-center gap-2"
          onClick={handleBack} // use updated back handler
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">
          Your <span className="text-gold">Cart</span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => (
              <motion.div
                key={item.service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col sm:flex-row gap-4 p-4 bg-card rounded-xl border"
              >
                <Link to={`/service/${item.service.id}`} className="shrink-0">
                  <img
                    src={item.service.images[0]}
                    alt={item.service.name}
                    className="w-full sm:w-32 h-32 object-cover rounded-lg"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/service/${item.service.id}`}
                    className="font-display text-lg font-semibold hover:text-gold transition-colors line-clamp-1"
                  >
                    {item.service.name}
                  </Link>
                  <p className="text-muted-foreground text-sm mb-2">
                    by {item.service.vendorName}
                  </p>
                  <p className="text-gold font-bold">{formatPrice(item.service.price)}</p>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-4">
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => updateCartQuantity(item.service.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.service.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromCart(item.service.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="sm:hidden ml-2">Remove</span>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-24 p-6 bg-card rounded-xl border"
            >
              <h2 className="font-display text-xl font-semibold mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service Fee (5%)</span>
                  <span className="font-medium">{formatPrice(serviceFee)}</span>
                </div>
                <div className="border-t pt-4 flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-gold font-display text-2xl font-bold">
                    {formatPrice(grandTotal)}
                  </span>
                </div>
              </div>
              <Button variant="gold" size="lg" className="w-full group" onClick={handleCheckout}>
                Proceed to Checkout
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Link to="/services">
                <Button variant="ghost" className="w-full mt-3">
                  Continue Shopping
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
