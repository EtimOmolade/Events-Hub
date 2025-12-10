import { forwardRef } from 'react';
import { format } from 'date-fns';
import { Check } from 'lucide-react';
import { formatPrice } from '@/data/services';

export interface ReceiptData {
  id: string;
  receiptNumber: string;
  customerName: string;
  customerEmail: string;
  eventType: string;
  eventDate: string;
  venue?: string;
  paymentReference: string;
  paymentMethod: string;
  subtotal: number;
  serviceFee: number;
  vatAmount: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  status: string;
  items: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
    vendorName?: string;
    category?: string;
  }>;
  createdAt: string;
  paymentDate: string;
}

interface ReceiptProps {
  data: ReceiptData;
  showActions?: boolean;
}

export const Receipt = forwardRef<HTMLDivElement, ReceiptProps>(
  ({ data, showActions = false }, ref) => {
    return (
      <div
        ref={ref}
        className="bg-white text-gray-900 rounded-xl shadow-lg overflow-hidden max-w-2xl mx-auto"
        style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Events Hub</h1>
              <p className="text-amber-100 text-sm mt-1">Premium Event Services</p>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full">
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">Payment Successful</span>
              </div>
            </div>
          </div>
        </div>

        {/* Receipt Info */}
        <div className="px-8 py-6 border-b border-gray-100">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Receipt Number</p>
              <p className="font-semibold text-gray-900">{data.receiptNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Payment Date</p>
              <p className="font-semibold text-gray-900">
                {format(new Date(data.paymentDate), 'MMM dd, yyyy • h:mm a')}
              </p>
            </div>
          </div>
        </div>

        {/* Customer & Event Info */}
        <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xs text-gray-500 uppercase tracking-wide mb-3">Bill To</h3>
              <p className="font-semibold text-gray-900">{data.customerName}</p>
              <p className="text-gray-600 text-sm">{data.customerEmail}</p>
            </div>
            <div>
              <h3 className="text-xs text-gray-500 uppercase tracking-wide mb-3">Event Details</h3>
              <p className="font-semibold text-gray-900">{data.eventType}</p>
              <p className="text-gray-600 text-sm">
                {format(new Date(data.eventDate), 'MMMM dd, yyyy')}
              </p>
              {data.venue && (
                <p className="text-gray-600 text-sm">{data.venue}</p>
              )}
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="px-8 py-6">
          <h3 className="text-xs text-gray-500 uppercase tracking-wide mb-4">Services</h3>
          <div className="space-y-4">
            {data.items.map((item, index) => (
              <div key={index} className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {item.vendorName && (
                      <span className="text-xs text-gray-500">by {item.vendorName}</span>
                    )}
                    {item.category && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatPrice(item.unitPrice)} × {item.quantity}
                  </p>
                </div>
                <p className="font-semibold text-gray-900 ml-4">
                  {formatPrice(item.total)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900">{formatPrice(data.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Service Fee (5%)</span>
              <span className="text-gray-900">{formatPrice(data.serviceFee)}</span>
            </div>
            {data.vatAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">VAT</span>
                <span className="text-gray-900">{formatPrice(data.vatAmount)}</span>
              </div>
            )}
            {data.discountAmount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span>-{formatPrice(data.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between pt-3 mt-3 border-t border-gray-200">
              <span className="font-semibold text-gray-900">Total Paid</span>
              <span className="font-bold text-xl text-amber-600">
                {formatPrice(data.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <div>
              <p className="text-gray-500">Payment Reference</p>
              <p className="font-mono text-gray-700">{data.paymentReference}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500">Payment Method</p>
              <p className="text-gray-700 capitalize">{data.paymentMethod}</p>
            </div>
          </div>
        </div>

        {/* Thank You */}
        <div className="px-8 py-6 bg-gradient-to-r from-amber-50 to-orange-50 text-center">
          <p className="text-amber-700 font-medium">
            Thank you for choosing Events Hub!
          </p>
          <p className="text-amber-600/80 text-sm mt-1">
            We're excited to help make your event unforgettable.
          </p>
        </div>
      </div>
    );
  }
);

Receipt.displayName = 'Receipt';
