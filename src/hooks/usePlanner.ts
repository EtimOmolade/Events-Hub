import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useAIChat, Message } from '@/hooks/useAIChat';
import { parseAIRecommendations } from '@/utils/aiParser';
import { toast } from 'sonner';

export interface PlannerFormData {
  name: string;
  eventType: string | null;
  theme: string | null;
  colors: string | null;
  guestCount: number | null;
  venue: string | null;
  eventDate: string | null;
  budget: number | null;
  vendors: any[];
  notes: string;
}

export interface SavedPlan {
  id: string;
  name: string;
  event_type: string | null;
  theme: string | null;
  colors: string | null;
  guest_count: number | null;
  venue: string | null;
  event_date: string | null;
  budget: number | null;
  selected_vendors: any[];
  notes: string | null;
  ai_conversation: Message[];
  ai_summary: string | null;
  raw_query: string | null;
  created_at: string;
  updated_at: string;
}

const initialFormData: PlannerFormData = {
  name: '',
  eventType: null,
  theme: null,
  colors: null,
  guestCount: null,
  venue: null,
  eventDate: null,
  budget: null,
  vendors: [],
  notes: '',
};

export function usePlanner() {
  const { user, isAuthenticated } = useAuth();
  const aiChat = useAIChat();
  const [formData, setFormData] = useState<PlannerFormData>(initialFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);

  // Update a single form field
  const updateField = useCallback(<K extends keyof PlannerFormData>(
    field: K,
    value: PlannerFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Apply AI recommendations to the form
  const applyAIToForm = useCallback(() => {
    const latestAssistantMsg = [...aiChat.messages].reverse().find(m => m.role === 'assistant');
    if (!latestAssistantMsg) {
      toast.error('No AI recommendations to apply');
      return;
    }

    const parsed = parseAIRecommendations(latestAssistantMsg.content);
    if (!parsed) {
      toast.error('Could not parse AI recommendations');
      return;
    }

    const applied: string[] = [];
    
    if (parsed.eventType) {
      setFormData(prev => ({ ...prev, eventType: parsed.eventType! }));
      applied.push('Event Type');
    }
    if (parsed.theme) {
      setFormData(prev => ({ ...prev, theme: parsed.theme! }));
      applied.push('Theme');
    }
    if (parsed.colorPalette) {
      setFormData(prev => ({ ...prev, colors: parsed.colorPalette! }));
      applied.push('Colors');
    }
    if (parsed.guestSize) {
      // Parse guest size to number
      const match = parsed.guestSize.match(/\d+/);
      if (match) {
        setFormData(prev => ({ ...prev, guestCount: parseInt(match[0]) }));
        applied.push('Guest Count');
      }
    }
    if (parsed.venueType) {
      setFormData(prev => ({ ...prev, venue: parsed.venueType! }));
      applied.push('Venue');
    }
    if (parsed.budget) {
      // Parse budget to number
      const match = parsed.budget.replace(/[^0-9]/g, '');
      if (match) {
        setFormData(prev => ({ ...prev, budget: parseInt(match) }));
        applied.push('Budget');
      }
    }

    if (applied.length > 0) {
      toast.success('AI recommendations applied!', {
        description: `Applied: ${applied.join(', ')}`,
      });
    } else {
      toast.info('No specific recommendations found to apply');
    }
  }, [aiChat.messages]);

  // Save the current plan
  const savePlan = useCallback(async () => {
    if (!isAuthenticated || !user) {
      toast.error('Please sign in to save your plan');
      return null;
    }

    if (!formData.name.trim() && !formData.eventType) {
      toast.error('Please provide a plan name or event type');
      return null;
    }

    setIsSaving(true);
    try {
      const planData = {
        user_id: user.id,
        name: formData.name || `${formData.eventType || 'Event'} Plan`,
        event_type: formData.eventType,
        theme: formData.theme,
        colors: formData.colors,
        guest_count: formData.guestCount,
        venue: formData.venue,
        event_date: formData.eventDate,
        budget: formData.budget,
        selected_vendors: formData.vendors,
        notes: formData.notes || null,
        ai_conversation: aiChat.messages as any,
        raw_query: aiChat.messages.find(m => m.role === 'user')?.content || null,
        ai_summary: aiChat.messages.find(m => m.role === 'assistant')?.content?.slice(0, 500) || null,
      };

      if (currentPlanId) {
        // Update existing plan
        const { error } = await supabase
          .from('event_plans')
          .update({
            ...planData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', currentPlanId);

        if (error) throw error;
        toast.success('Plan updated successfully!');
        return currentPlanId;
      } else {
        // Create new plan
        const { data, error } = await supabase
          .from('event_plans')
          .insert(planData)
          .select()
          .single();

        if (error) throw error;
        setCurrentPlanId(data.id);
        toast.success('Plan saved successfully!');
        return data.id;
      }
    } catch (err) {
      console.error('Save error:', err);
      toast.error('Failed to save plan');
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [isAuthenticated, user, formData, aiChat.messages, currentPlanId]);

  // Load an existing plan
  const loadPlan = useCallback(async (planId: string) => {
    try {
      const { data, error } = await supabase
        .from('event_plans')
        .select('*')
        .eq('id', planId)
        .single();

      if (error) throw error;

      setFormData({
        name: data.name || '',
        eventType: data.event_type,
        theme: data.theme,
        colors: data.colors,
        guestCount: data.guest_count,
        venue: data.venue,
        eventDate: data.event_date,
        budget: data.budget ? Number(data.budget) : null,
        vendors: (data.selected_vendors as any[]) || [],
        notes: data.notes || '',
      });
      setCurrentPlanId(planId);

      toast.success('Plan loaded!');
    } catch (err) {
      console.error('Load error:', err);
      toast.error('Failed to load plan');
    }
  }, []);

  // Start a new plan (clear everything)
  const startNewPlan = useCallback(() => {
    setFormData(initialFormData);
    setCurrentPlanId(null);
    aiChat.clearChat();
    toast.success('Started a new plan');
  }, [aiChat]);

  // Delete a plan
  const deletePlan = useCallback(async (planId: string) => {
    try {
      const { error } = await supabase
        .from('event_plans')
        .delete()
        .eq('id', planId);

      if (error) throw error;

      if (currentPlanId === planId) {
        startNewPlan();
      }
      toast.success('Plan deleted');
      return true;
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Failed to delete plan');
      return false;
    }
  }, [currentPlanId, startNewPlan]);

  return {
    // Form state
    formData,
    updateField,
    setFormData,
    
    // AI chat
    messages: aiChat.messages,
    isAILoading: aiChat.isLoading,
    aiError: aiChat.error,
    sendMessage: aiChat.sendMessage,
    clearChat: aiChat.clearChat,
    
    // Actions
    applyAIToForm,
    savePlan,
    loadPlan,
    startNewPlan,
    deletePlan,
    
    // State
    isSaving,
    currentPlanId,
    isAuthenticated,
  };
}
