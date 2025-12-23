import { Helmet } from "react-helmet";
import ChatWidget from "@/components/chat/ChatWidget";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Twin Health Chat - Your Digital Health Partner</title>
        <meta 
          name="description" 
          content="Connect with Twin Health's AI assistant for personalized guidance on diabetes reversal and metabolic wellness." 
        />
      </Helmet>
      
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header Badge */}
          <div className="text-center mb-6 animate-fade-in">
            <span className="inline-flex items-center gap-2 bg-card px-4 py-2 rounded-full shadow-sm">
              <div className="w-2 h-2 rounded-full bg-chat-online animate-pulse-soft" />
              <span className="text-sm text-muted-foreground font-medium">
                Online Support
              </span>
            </span>
          </div>
          
          {/* Chat Widget */}
          <ChatWidget />
          
          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground mt-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            Powered by Twin Health's Whole Body Digital Twin™
          </p>
        </div>
      </div>
    </>
  );
};

export default Index;
