-- Add additional columns to event_plans table for unified planner
ALTER TABLE public.event_plans 
ADD COLUMN IF NOT EXISTS raw_query text,
ADD COLUMN IF NOT EXISTS ai_summary text,
ADD COLUMN IF NOT EXISTS colors text,
ADD COLUMN IF NOT EXISTS venue text,
ADD COLUMN IF NOT EXISTS timeline jsonb DEFAULT '[]'::jsonb;

-- Create index for faster user queries
CREATE INDEX IF NOT EXISTS idx_event_plans_user_id ON public.event_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_event_plans_created_at ON public.event_plans(created_at DESC);