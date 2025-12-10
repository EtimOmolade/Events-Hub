import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Printer, Eye, Check, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Receipt, ReceiptData } from './Receipt';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ReceiptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receiptData: ReceiptData | null;
  onViewReceipt: () => void;
  onContinue: () => void;
}

export function ReceiptModal({
  open,
  onOpenChange,
  receiptData,
  onViewReceipt,
  onContinue,
}: ReceiptModalProps) {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [pdfError, setPdfError] = useState(false);

  const generatePDF = async (): Promise<Blob | null> => {
    if (!receiptRef.current || !receiptData) return null;

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
    setPdfError(false);

    try {
      const pdfBlob = await generatePDF();
      
      if (!pdfBlob) {
        throw new Error('Failed to generate PDF');
      }

      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `receipt-${receiptData?.receiptNumber || 'download'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Receipt downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      setPdfError(true);
      toast.error('Could not generate receipt. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handlePrint = async () => {
    setIsPrinting(true);
    setPdfError(false);

    try {
      const pdfBlob = await generatePDF();
      
      if (!pdfBlob) {
        throw new Error('Failed to generate PDF for printing');
      }

      const url = URL.createObjectURL(pdfBlob);
      const printWindow = window.open(url, '_blank');
      
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      } else {
        // Fallback: direct print of the receipt element
        window.print();
      }

      toast.success('Opening print dialog...');
    } catch (error) {
      console.error('Print error:', error);
      setPdfError(true);
      toast.error('Could not prepare receipt for printing. Please try again.');
    } finally {
      setIsPrinting(false);
    }
  };

  if (!receiptData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          {/* Success Header */}
          <div className="text-center pt-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center mx-auto mb-4"
            >
              <Check className="w-8 h-8 text-rich-black" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-gold" />
                <h2 className="font-display text-2xl font-bold">Payment Successful!</h2>
                <Sparkles className="w-5 h-5 text-gold" />
              </div>
              <p className="text-muted-foreground">
                Your receipt is ready
              </p>
            </motion.div>
          </div>

          {/* Receipt Preview (hidden but used for PDF generation) */}
          <div className="relative">
            <div className="absolute -left-[9999px]">
              <Receipt ref={receiptRef} data={receiptData} />
            </div>
            
            {/* Visible mini preview */}
            <div className="bg-muted/50 rounded-xl p-4 border">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Receipt #{receiptData.receiptNumber}</span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  Paid
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Event</p>
                  <p className="font-medium">{receiptData.eventType}</p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground text-xs">Total</p>
                  <p className="font-bold text-gold">₦{receiptData.totalAmount.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {pdfError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg text-sm"
            >
              <AlertCircle className="w-4 h-4" />
              <span>Could not generate receipt. Please try again.</span>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="grid gap-3">
            <Button
              variant="gold"
              size="lg"
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="gap-2"
            >
              {isGeneratingPDF ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              Download Receipt (PDF)
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={handlePrint}
                disabled={isPrinting}
                className="gap-2"
              >
                {isPrinting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Printer className="w-4 h-4" />
                )}
                Print
              </Button>
              <Button
                variant="outline"
                onClick={onViewReceipt}
                className="gap-2"
              >
                <Eye className="w-4 h-4" />
                View Receipt
              </Button>
            </div>
            
            <Button
              variant="ghost"
              onClick={onContinue}
              className="mt-2"
            >
              Continue
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
