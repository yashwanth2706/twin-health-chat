import { cn } from "@/lib/utils";

interface ChatMessageProps {
  content: string;
  isBot: boolean;
  timestamp: string;
  avatarUrl?: string;
  senderName?: string;
}

const ChatMessage = ({ content, isBot, timestamp, avatarUrl, senderName }: ChatMessageProps) => {
  return (
    <div 
      className={cn(
        "flex gap-2 animate-slide-up",
        isBot ? "justify-start" : "justify-end"
      )}
    >
      {isBot && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-card shadow-sm overflow-hidden flex items-center justify-center">
          {avatarUrl ? (
            <img src={avatarUrl} alt={senderName || "Bot"} className="w-full h-full object-cover" />
          ) : (
            <span className="text-primary font-semibold text-sm">
              {(senderName || "B").charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      )}
      
      <div className={cn("max-w-[75%] flex flex-col", isBot ? "items-start" : "items-end")}>
        {isBot && senderName && (
          <span className="text-xs text-muted-foreground mb-1 ml-1">{senderName}</span>
        )}
        
        <div
          className={cn(
            "px-4 py-3 rounded-2xl shadow-sm",
            isBot 
              ? "bg-chat-bubble-bot text-foreground rounded-tl-md" 
              : "bg-chat-bubble-user text-chat-bubble-user-foreground rounded-tr-md"
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        </div>
        
        <span className={cn(
          "text-[10px] text-muted-foreground mt-1",
          isBot ? "ml-1" : "mr-1"
        )}>
          {timestamp}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;
