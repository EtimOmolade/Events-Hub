-- Create a table to store user state (Cart, Wishlist, etc.) as JSONB
-- This allows supporting static IDs (like 's1') that wouldn't fit in standard UUID foreign keys yet.

CREATE TABLE public.user_storage (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    cart_data JSONB DEFAULT '[]'::jsonb,
    wishlist_data JSONB DEFAULT '[]'::jsonb,
    recently_viewed_data JSONB DEFAULT '[]'::jsonb,
    recent_searches_data JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_storage ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own storage" 
    ON public.user_storage FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own storage" 
    ON public.user_storage FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own storage" 
    ON public.user_storage FOR UPDATE 
    USING (auth.uid() = user_id);

-- Function to handle timestamp update
CREATE TRIGGER update_user_storage_updated_at 
    BEFORE UPDATE ON public.user_storage
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_storage;
