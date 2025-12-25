import twinHealthLogo from "@/assets/TwinHealthLogo.png";

interface ChatHeaderProps {
  name: string;
  subtitle: string;
}

const ChatHeader = ({ name, subtitle }: ChatHeaderProps) => {
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
    </header>
  );
};

export default ChatHeader;
