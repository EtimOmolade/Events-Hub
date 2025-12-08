import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Auth from "./pages/Auth";
import Checkout from "./pages/Checkout";
import Bookings from "./pages/Bookings";
import Categories from "./pages/Categories";
import Vendors from "./pages/Vendors";
import VendorDetail from "./pages/VendorDetail";
import EventBuilder from "./pages/EventBuilder";
import SavedPlans from "./pages/SavedPlans";
import AdminLogin from "./pages/AdminLogin";
import AdminServices from "./pages/admin/AdminServices";
import AdminVendors from "./pages/admin/AdminVendors";
import AdminCategories from "./pages/admin/AdminCategories";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<Services />} />
          <Route path="/service/:id" element={<ServiceDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/vendor/:id" element={<VendorDetail />} />
          <Route path="/event-builder" element={<EventBuilder />} />
          <Route path="/saved-plans" element={<SavedPlans />} />
          <Route path="/admin" element={<AdminServices />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/services" element={<AdminServices />} />
          <Route path="/admin/vendors" element={<AdminVendors />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/about" element={<About />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/account" element={<Account />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;