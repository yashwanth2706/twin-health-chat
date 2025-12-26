import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { MessageCircle, X } from "lucide-react";
import ChatWidget from "@/components/chat/ChatWidget";
import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import WhyTwinSection from "@/components/landing/WhyTwinSection";
import { cn } from "@/lib/utils";

const Index = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Helmet>
        <title>Twin Health - Reverse Diabetes with India's Whole Body Digital Twin™</title>
        <meta 
          name="description" 
          content="We help you reverse diabetes, obesity and PCOD by healing the exact root cause of your metabolism. 50000+ members benefitted." 
        />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        <HeroSection />
        <WhyTwinSection />

        {/* Chat Widget Container */}
        <div
          className={cn(
            "fixed bottom-20 right-6 z-50 transition-all duration-300 ease-out",
            "max-h-[calc(100vh-120px)]",
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
