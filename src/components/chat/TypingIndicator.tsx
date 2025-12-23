interface TypingIndicatorProps {
  avatarUrl?: string;
  senderName?: string;
}

const TypingIndicator = ({ avatarUrl, senderName }: TypingIndicatorProps) => {
  return (
    <div className="flex gap-2 items-end animate-fade-in">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-card shadow-sm overflow-hidden flex items-center justify-center">
        {avatarUrl ? (
          <img src={avatarUrl} alt={senderName || "Bot"} className="w-full h-full object-cover" />
        ) : (
          <span className="text-primary font-semibold text-sm">
            {(senderName || "B").charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      
      <div className="bg-chat-bubble-bot px-4 py-3 rounded-2xl rounded-tl-md shadow-sm">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-typing-1" />
          <div className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-typing-2" />
          <div className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-typing-3" />
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
