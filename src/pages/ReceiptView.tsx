import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Printer, Loader2, AlertCircle } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Receipt, ReceiptData } from '@/components/receipt/Receipt';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function ReceiptView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const receiptRef = useRef<HTMLDivElement>(null);
  
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    if (user && id) {
      fetchReceipt();
    }
  }, [user, id]);

  const fetchReceipt = async () => {
    if (!user || !id) return;

    setIsLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('receipts')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching receipt:', error);
      setError('Failed to load receipt');
    } else if (!data) {
      setError('Receipt not found');
    } else {
      // Transform database record to ReceiptData
      const items = Array.isArray(data.items) ? data.items : [];
      setReceipt({
        id: data.id,
        receiptNumber: data.receipt_number,
        customerName: data.customer_name,
        customerEmail: data.customer_email,
        eventType: data.event_type,
        eventDate: data.event_date,
        venue: data.venue || undefined,
        paymentReference: data.payment_reference,
        paymentMethod: data.payment_method || 'card',
        subtotal: Number(data.subtotal),
        serviceFee: Number(data.service_fee),
        vatAmount: Number(data.vat_amount),
        discountAmount: Number(data.discount_amount),
        totalAmount: Number(data.total_amount),
        currency: data.currency,
        status: data.status,
        items: items.map((item: any) => ({
          name: item.name || item.service_name || 'Service',
          quantity: item.quantity || 1,
          unitPrice: item.unitPrice || item.unit_price || 0,
          total: item.total || (item.quantity || 1) * (item.unitPrice || item.unit_price || 0),
          vendorName: item.vendorName || item.vendor_name,
          category: item.category,
        })),
        createdAt: data.created_at,
        paymentDate: data.payment_date,
      });
    }

    setIsLoading(false);
  };

  const generatePDF = async (): Promise<Blob | null> => {
    if (!receiptRef.current) return null;

    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      
      return pdf.output('blob');
    } catch (error) {
      console.error('Error generating PDF:', error);
      return null;
    }
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);

    try {
      const pdfBlob = await generatePDF();
      
      if (!pdfBlob) {
        throw new Error('Failed to generate PDF');
      }

      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `receipt-${receipt?.receiptNumber || 'download'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Receipt downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Could not generate receipt. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="font-display text-2xl font-semibold mb-2">
              Sign in to view receipts
            </h1>
            <p className="text-muted-foreground mb-6">
              You need to be logged in to access this receipt
            </p>
            <Link to="/auth">
              <Button variant="gold">Sign In</Button>
            </Link>
          </motion.div>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </Layout>
    );
  }

  if (error || !receipt) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h1 className="font-display text-2xl font-semibold mb-2">
              {error || 'Receipt not found'}
            </h1>
            <p className="text-muted-foreground mb-6">
              The receipt you're looking for doesn't exist or you don't have access to it.
            </p>
            <Button variant="gold" onClick={() => navigate('/bookings')}>
              Go to My Bookings
            </Button>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="gap-2"
            >
              {isGeneratingPDF ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              Download PDF
            </Button>
            <Button
              variant="outline"
              onClick={handlePrint}
              className="gap-2 print:hidden"
            >
              <Printer className="w-4 h-4" />
              Print
            </Button>
          </div>
        </div>

        {/* Receipt */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Receipt ref={receiptRef} data={receipt} />
        </motion.div>
      </div>
    </Layout>
  );
}
