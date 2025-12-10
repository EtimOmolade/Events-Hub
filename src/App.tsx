import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";
import { ThemeProvider } from "./providers/ThemeProvider";
import { FloatingAIWidget } from "./components/ai/FloatingAIWidget";
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
import Planner from "./pages/Planner";
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
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
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
            {/* Unified Planner - replaces both ai-planner and event-builder */}
            <Route path="/planner" element={<Planner />} />
            {/* Redirects from old routes */}
            <Route path="/ai-planner" element={<Navigate to="/planner" replace />} />
            <Route path="/event-builder" element={<Navigate to="/planner" replace />} />
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
          <FloatingAIWidget />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
