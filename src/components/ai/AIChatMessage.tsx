import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

export function AIChatMessage({ role, content }: AIChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div className={cn("flex gap-3 p-4", isUser ? "flex-row-reverse" : "flex-row")}>
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
          isUser ? "bg-gold text-rich-black" : "bg-muted text-foreground"
        )}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3",
          isUser
            ? "bg-gold text-rich-black rounded-br-md"
            : "bg-muted text-foreground rounded-bl-md"
        )}
      >
        <p className="text-sm whitespace-pre-wrap leading-relaxed">{content}</p>
      </div>
    </div>
  );
}
