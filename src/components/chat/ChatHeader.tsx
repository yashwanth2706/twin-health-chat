import { ChevronLeft } from "lucide-react";

interface ChatHeaderProps {
  name: string;
  subtitle: string;
  avatarUrl?: string;
  onBack?: () => void;
}

const ChatHeader = ({ name, subtitle, avatarUrl, onBack }: ChatHeaderProps) => {
  return (
    <header className="flex items-center gap-3 bg-chat-header px-4 py-3 rounded-t-2xl">
      {onBack && (
        <button 
          onClick={onBack}
          className="text-chat-header-foreground/80 hover:text-chat-header-foreground transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}
      
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-card overflow-hidden flex items-center justify-center shadow-sm">
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-primary font-semibold text-lg">
              {name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-chat-online rounded-full border-2 border-chat-header" />
      </div>
      
      <div className="flex-1 min-w-0">
        <h1 className="text-chat-header-foreground font-semibold text-base truncate">
          {name}
        </h1>
        <p className="text-chat-header-foreground/70 text-xs truncate">
          {subtitle}
        </p>
      </div>
    </header>
  );
};

export default ChatHeader;
