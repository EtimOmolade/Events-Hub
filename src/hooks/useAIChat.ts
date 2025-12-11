import { useState, useCallback } from 'react';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-planner`;

const getFallbackResponse = (input: string) => {
  const lower = input.toLowerCase();

  if (lower.includes('wedding')) {
    return "Congratulations on your upcoming wedding! 💍\n\nBased on popular Nigerian wedding trends, here's a quick start plan:\n\n1. **Venue**: Consider an open field or a grand hall depending on the season.\n2. **Colors**: Champagne Gold & White is very trending.\n3. **Vendors**: Check out *Elegance Events* for coordination and *Pixel Perfect* for photos.\n\nWhat is your estimated budget for the big day?";
  }

  if (lower.includes('birthday')) {
    return "Happy birthday in advance! 🎉\n\nFor a memorable party, I suggest:\n\n1. **Theme**: How about a 'Royal Opulence' or 'Retro' theme?\n2. **Entertainment**: *SoundWave Entertainment* is highly rated for DJ services.\n3. **Food**: *Divine Catering* has great Jollof options.\n\nHow many guests are you expecting?";
  }

  if (lower.includes('corporate') || lower.includes('team') || lower.includes('conference')) {
    return "For a professional corporate event, seamless execution is key. 👔\n\nRecommendations:\n1. **Catering**: Buffet style by *Divine Catering*.\n2. **Setup**: Projectors and sound by *SoundWave*.\n\nDo you have a specific date in mind?";
  }

  return "That sounds like an exciting event! ✨\n\nI can help you build the perfect package. To give you the best recommendations, could you tell me:\n\n- The type of event\n- Your guest count\n- Your budget range (e.g., ₦500k - ₦2M)\n\nI'll match you with top-rated vendors instantly.";
};

export function useAIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (input: string) => {
    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);

    let assistantContent = '';

    const updateAssistant = (chunk: string) => {
      assistantContent += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant') {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantContent } : m));
        }
        return [...prev, { role: 'assistant', content: assistantContent }];
      });
    };

    const runFallback = async () => {
      const responseText = getFallbackResponse(input);
      const chars = responseText.split('');
      let i = 0;

      return new Promise<void>((resolve) => {
        const interval = setInterval(() => {
          if (i >= chars.length) {
            clearInterval(interval);
            resolve();
            return;
          }
          updateAssistant(chars[i]);
          i++;
        }, 20);
      });
    };

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      if (!resp.ok) {
        console.warn("AI service unavailable, switching to fallback.");
        await runFallback();
        return;
      }

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) updateAssistant(content);
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) updateAssistant(content);
          } catch { /* ignore */ }
        }
      }
    } catch (e) {
      console.warn("AI Chat error, switching to fallback:", e);
      await runFallback();
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, isLoading, error, sendMessage, clearChat };
}
