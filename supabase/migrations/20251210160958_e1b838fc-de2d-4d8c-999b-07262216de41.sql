-- Create receipts table for storing payment receipts
CREATE TABLE public.receipts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  booking_id uuid REFERENCES public.bookings(id) ON DELETE CASCADE,
  receipt_number text NOT NULL UNIQUE,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  event_type text NOT NULL,
  event_date date NOT NULL,
  venue text,
  payment_reference text NOT NULL,
  payment_method text,
  subtotal numeric NOT NULL DEFAULT 0,
  service_fee numeric NOT NULL DEFAULT 0,
  vat_amount numeric NOT NULL DEFAULT 0,
  discount_amount numeric NOT NULL DEFAULT 0,
  total_amount numeric NOT NULL,
  currency text NOT NULL DEFAULT 'NGN',
  status text NOT NULL DEFAULT 'paid',
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  payment_date timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;

-- Users can view their own receipts
CREATE POLICY "Users can view own receipts"
  ON public.receipts
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own receipts
CREATE POLICY "Users can create own receipts"
  ON public.receipts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_receipts_user_id ON public.receipts(user_id);
CREATE INDEX idx_receipts_booking_id ON public.receipts(booking_id);