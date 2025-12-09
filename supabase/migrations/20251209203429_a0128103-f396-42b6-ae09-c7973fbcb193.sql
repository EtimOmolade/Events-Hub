-- Add ai_conversation column to store chat history
ALTER TABLE public.event_plans
ADD COLUMN ai_conversation jsonb DEFAULT '[]'::jsonb;