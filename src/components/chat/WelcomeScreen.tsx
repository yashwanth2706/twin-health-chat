import { Headphones } from "lucide-react";

interface ConversationPreview {
  senderName: string;
  message: string;
  time: string;
  avatarUrl?: string;
}

interface WelcomeScreenProps {
  brandName: string;
  tagline: string;
  logoUrl?: string;
  recentConversation?: ConversationPreview;
  onViewConversation?: () => void;
}

const WelcomeScreen = ({ 
  brandName, 
  tagline, 
  logoUrl,
  recentConversation,
  onViewConversation
}: WelcomeScreenProps) => {
  return (
    <div className="flex-1 flex flex-col">
      {/* Logo Section */}
      <div className="bg-chat-header pt-8 pb-20 flex justify-center items-center rounded-t-2xl">
        <div className="w-16 h-16 bg-card rounded-2xl shadow-lg flex items-center justify-center animate-bounce-in">
          {logoUrl ? (
            <img src={logoUrl} alt={brandName} className="w-10 h-10 object-contain" />
          ) : (
            <span className="text-accent text-2xl font-bold">
              {brandName.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      </div>
      
      {/* Welcome Content */}
      <div className="flex-1 bg-card -mt-8 rounded-t-3xl pt-8 px-6">
        <div className="text-center mb-8 animate-slide-up">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {brandName}
          </h1>
          <p className="text-muted-foreground">
            {tagline}
          </p>
        </div>
        
        {/* Recent Conversation Card */}
        {recentConversation && (
          <button
            onClick={onViewConversation}
            className="w-full bg-secondary/50 rounded-2xl p-4 flex items-center gap-3 hover:bg-secondary transition-colors animate-slide-up group"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="w-12 h-12 rounded-full bg-card shadow-sm overflow-hidden flex-shrink-0 flex items-center justify-center">
              {recentConversation.avatarUrl ? (
                <img 
                  src={recentConversation.avatarUrl} 
                  alt={recentConversation.senderName} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-primary font-semibold">
                  {recentConversation.senderName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            
            <div className="flex-1 text-left min-w-0">
              <p className="font-semibold text-foreground text-sm">
                {recentConversation.senderName}
              </p>
              <p className="text-muted-foreground text-sm truncate">
                {recentConversation.message}
              </p>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <span className="text-xs text-muted-foreground">
                {recentConversation.time}
              </span>
              <Headphones className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

export default WelcomeScreen;
