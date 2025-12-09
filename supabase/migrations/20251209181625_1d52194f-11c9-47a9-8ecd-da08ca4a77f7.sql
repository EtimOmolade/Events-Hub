-- Create update_updated_at_column function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create ai_plans table for saving AI-generated event plans
CREATE TABLE public.ai_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  raw_query TEXT NOT NULL,
  ai_summary TEXT,
  event_type TEXT,
  theme TEXT,
  color_palette TEXT,
  guest_count INTEGER,
  venue_type TEXT,
  budget_range TEXT,
  recommended_vendors JSONB DEFAULT '[]'::jsonb,
  packages JSONB DEFAULT '[]'::jsonb,
  timeline_tips JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_plans ENABLE ROW LEVEL SECURITY;

-- Users can view their own plans
CREATE POLICY "Users can view their own AI plans"
ON public.ai_plans
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own plans
CREATE POLICY "Users can create their own AI plans"
ON public.ai_plans
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own plans
CREATE POLICY "Users can update their own AI plans"
ON public.ai_plans
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own plans
CREATE POLICY "Users can delete their own AI plans"
ON public.ai_plans
FOR DELETE
USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER update_ai_plans_updated_at
BEFORE UPDATE ON public.ai_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();