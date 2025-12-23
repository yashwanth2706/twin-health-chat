import { Home, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type TabType = "home" | "conversation";

interface ChatNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const ChatNavigation = ({ activeTab, onTabChange }: ChatNavigationProps) => {
  const tabs = [
    { id: "home" as TabType, label: "Home", icon: Home },
    { id: "conversation" as TabType, label: "Conversation", icon: MessageCircle },
  ];

  return (
    <nav className="flex bg-card border-t border-border rounded-b-2xl overflow-hidden">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex-1 flex flex-col items-center gap-1 py-3 transition-all duration-200",
              isActive 
                ? "text-primary" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className={cn("w-5 h-5", isActive && "fill-primary/10")} />
            <span className="text-xs font-medium">{tab.label}</span>
            {isActive && (
              <div className="w-6 h-0.5 bg-primary rounded-full mt-0.5 animate-fade-in" />
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default ChatNavigation;
