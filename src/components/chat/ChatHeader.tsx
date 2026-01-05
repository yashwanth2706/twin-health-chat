import twinHealthLogo from "@/assets/TwinHealthLogo.png";
import { RotateCcw } from "lucide-react";

interface ChatHeaderProps {
  name: string;
  subtitle: string;
  onRestart?: () => void;
}

const ChatHeader = ({ name, subtitle, onRestart }: ChatHeaderProps) => {
  return (
    <header className="flex items-center gap-3 bg-chat-header px-4 py-3 rounded-t-2xl">
      <div className="w-10 h-10 rounded-full bg-white overflow-hidden flex items-center justify-center shadow-sm p-1">
        <img src={twinHealthLogo} alt="Twin Health" className="w-full h-full object-contain" />
      </div>
      
      <div className="flex-1 min-w-0">
        <h1 className="text-chat-header-foreground font-semibold text-base truncate">
          {name}
        </h1>
        <p className="text-chat-header-foreground/70 text-xs truncate">
          {subtitle}
        </p>
      </div>

      {onRestart && (
        <button
          onClick={onRestart}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
          title="Restart conversation"
        >
          <RotateCcw className="w-5 h-5 text-chat-header-foreground" />
        </button>
      )}
    </header>
  );
};

export default ChatHeader;
