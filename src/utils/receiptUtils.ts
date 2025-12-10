import { supabase } from '@/integrations/supabase/client';
import { ReceiptData } from '@/components/receipt/Receipt';

// Generate a unique receipt number
export function generateReceiptNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 99999).toString().padStart(5, '0');
  return `INV-${year}-${random}`;
}

// Generate a payment reference
export function generatePaymentReference(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'PAY-';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Create receipt data from booking info
export interface CreateReceiptParams {
  userId: string;
  bookingId?: string;
  customerName: string;
  customerEmail: string;
  eventType: string;
  eventDate: string;
  venue?: string;
  paymentMethod: string;
  subtotal: number;
  serviceFee: number;
  vatAmount?: number;
  discountAmount?: number;
  totalAmount: number;
  items: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
    vendorName?: string;
    category?: string;
  }>;
}

export async function createReceipt(params: CreateReceiptParams): Promise<{ data: ReceiptData | null; error: Error | null }> {
  const receiptNumber = generateReceiptNumber();
  const paymentReference = generatePaymentReference();
  const now = new Date().toISOString();

  try {
    const { data, error } = await supabase
      .from('receipts')
      .insert({
        user_id: params.userId,
        booking_id: params.bookingId || null,
        receipt_number: receiptNumber,
        customer_name: params.customerName,
        customer_email: params.customerEmail,
        event_type: params.eventType,
        event_date: params.eventDate,
        venue: params.venue || null,
        payment_reference: paymentReference,
        payment_method: params.paymentMethod,
        subtotal: params.subtotal,
        service_fee: params.serviceFee,
        vat_amount: params.vatAmount || 0,
        discount_amount: params.discountAmount || 0,
        total_amount: params.totalAmount,
        currency: 'NGN',
        status: 'paid',
        items: params.items,
        created_at: now,
        payment_date: now,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating receipt:', error);
      return { data: null, error: new Error(error.message) };
    }

    // Transform to ReceiptData
    const receiptData: ReceiptData = {
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
      items: params.items,
      createdAt: data.created_at,
      paymentDate: data.payment_date,
    };

    return { data: receiptData, error: null };
  } catch (err) {
    console.error('Error creating receipt:', err);
    return { data: null, error: err as Error };
  }
}

// Fetch user receipts
export async function fetchUserReceipts(userId: string) {
  const { data, error } = await supabase
    .from('receipts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching receipts:', error);
    return { data: null, error };
  }

  return { data, error: null };
}
