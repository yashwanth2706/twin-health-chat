import { useState, useRef, useEffect } from "react";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import ChatNavigation from "./ChatNavigation";
import WelcomeScreen from "./WelcomeScreen";
import TypingIndicator from "./TypingIndicator";

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: string;
}

const ChatWidget = () => {
  const [activeTab, setActiveTab] = useState<"home" | "conversation">("conversation");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Welcome to Twin Health! 👋\n\nI'm here to help you on your journey to reverse diabetes and achieve metabolic wellness. How can I assist you today?",
      isBot: true,
      timestamp: formatTime(new Date(Date.now() - 300000)),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  function formatTime(date: Date): string {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      isBot: false,
      timestamp: formatTime(new Date()),
    };
    setMessages((prev) => [...prev, newMessage]);
    
    // Simulate bot typing
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getBotResponse(content),
        isBot: true,
        timestamp: formatTime(new Date()),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1500);
  };

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("diabetes") || lowerMessage.includes("reverse")) {
      return "At Twin Health, we use your personalized Whole Body Digital Twin™ to help reverse diabetes by addressing the root cause of your metabolism. Would you like to learn more about our approach?";
    }
    if (lowerMessage.includes("help") || lowerMessage.includes("start")) {
      return "I can help you with:\n\n• Understanding our Whole Body Digital Twin™ technology\n• Booking a consultation\n• Learning about diabetes reversal\n• Tracking your metabolic health\n\nWhat would you like to explore?";
    }
    if (lowerMessage.includes("consultation") || lowerMessage.includes("book")) {
      return "Great! I can help you schedule a consultation with our health experts. They'll create a personalized plan based on your health data. Shall I connect you with our team?";
    }
    
    return "Thank you for your message! Our team is here to support your health journey. Is there anything specific about diabetes reversal or metabolic wellness you'd like to know?";
  };

  const botInfo = {
    name: "Twin Health",
    subtitle: "Your Digital Health Partner",
  };

  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto h-[500px] sm:h-[550px] max-h-[calc(100vh-140px)] flex flex-col bg-background rounded-2xl shadow-chat-lg overflow-hidden">
      {activeTab === "home" ? (
        <WelcomeScreen
          brandName="Twin Health"
          tagline="We are here to help you!"
          recentConversation={{
            senderName: "Twin Assistant",
            message: "What are you looking for?",
            time: "3 mins ago",
          }}
          onViewConversation={() => setActiveTab("conversation")}
        />
      ) : (
        <>
          <ChatHeader
            name={botInfo.name}
            subtitle={botInfo.subtitle}
          />
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary/30">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                content={message.content}
                isBot={message.isBot}
                timestamp={message.timestamp}
                senderName={message.isBot ? "Twin Assistant" : undefined}
              />
            ))}
            {isTyping && <TypingIndicator senderName="Twin Assistant" />}
            <div ref={messagesEndRef} />
          </div>
          
          <ChatInput
            onSend={handleSendMessage}
            placeholder="We are here to help you..."
            disabled={isTyping}
          />
        </>
      )}
    </div>
  );
};

export default ChatWidget;
