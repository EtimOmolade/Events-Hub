import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Event services and vendor data for context
const eventContext = `
You are an AI Event Planning Assistant for EventsHub, a Nigerian event services marketplace.

Available Event Categories:
- Weddings (traditional & white weddings)
- Birthdays (children's parties, milestone celebrations)
- Corporate Events (conferences, product launches, team building)
- Baby Showers
- Concerts & Entertainment
- Catering Services
- Decorations & Styling
- Photography & Videography
- Equipment Rentals

Available Vendors:
1. Elegance Events - Wedding Planning (Lagos) - 4.9★
2. Divine Catering Co. - Catering Services (Abuja) - 4.8★
3. Pixel Perfect Studios - Photography & Video (Lagos) - 4.9★
4. Royal Décor - Event Decorations (Port Harcourt) - 4.7★
5. SoundWave Entertainment - DJ & Sound (Lagos) - 4.8★

Price Ranges (in Naira):
- Budget: Under ₦500,000
- Mid-range: ₦500,000 - ₦2,000,000
- Premium: ₦2,000,000 - ₦5,000,000
- Luxury: Above ₦5,000,000

Popular Themes:
- Classic Elegance (Gold & White, Champagne)
- Romantic Garden (Blush Pink, Sage Green)
- Modern Minimalist (Black & White, Silver)
- Vibrant Afrocentric (Bold Colors, Traditional Patterns)
- Rustic Charm (Earth Tones, Natural Elements)
- Royal Opulence (Deep Purple, Gold, Burgundy)

When helping users:
1. Ask clarifying questions about event type, guest count, budget, and preferences
2. Suggest appropriate vendors and services based on their needs
3. Provide package recommendations with estimated costs
4. Share timeline tips and planning milestones
5. Offer theme and color palette suggestions
6. Be warm, professional, and culturally aware of Nigerian celebrations
`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: eventContext },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("AI Planner error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
