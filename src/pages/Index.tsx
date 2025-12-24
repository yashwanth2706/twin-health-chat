import { useState } from "react";
import { Helmet } from "react-helmet";
import { MessageCircle, X } from "lucide-react";
import ChatWidget from "@/components/chat/ChatWidget";
import { cn } from "@/lib/utils";

const Index = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Helmet>
        <title>Twin Health Chat - Your Digital Health Partner</title>
        <meta 
          name="description" 
          content="Connect with Twin Health's AI assistant for personalized guidance on diabetes reversal and metabolic wellness." 
        />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        {/* Demo content */}
        <div className="p-8">
          <h1 className="text-2xl font-bold text-foreground">Welcome to Twin Health</h1>
          <p className="text-muted-foreground mt-2">Click the chat button to start a conversation.</p>
        </div>

        {/* Chat Widget Container */}
        <div
          className={cn(
            "fixed bottom-24 right-6 z-50 transition-all duration-300 ease-out",
            isOpen 
              ? "opacity-100 scale-100 translate-y-0" 
              : "opacity-0 scale-95 translate-y-4 pointer-events-none"
          )}
        >
          <ChatWidget />
        </div>

        {/* Floating Chat Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg",
            "flex items-center justify-center transition-all duration-300",
            "bg-accent text-accent-foreground hover:scale-110 hover:shadow-xl",
            isOpen && "rotate-90"
          )}
          aria-label={isOpen ? "Close chat" : "Open chat"}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-6 h-6" />
          )}
        </button>
      </div>
    </>
  );
};

export default Index;
