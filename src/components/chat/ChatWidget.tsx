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

interface UserDetails {
  name: string;
  email: string;
  phone: string;
}

type CollectionStage = "greeting" | "name" | "email" | "phone" | "complete";

// Validation patterns
const namePattern = /^[a-zA-Z][a-zA-Z\s'-]*[a-zA-Z]$|^[a-zA-Z]$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[6-9]\d{9}$/;

const ChatWidget = () => {
  const [activeTab, setActiveTab] = useState<"home" | "conversation">("conversation");
  const [userDetails, setUserDetails] = useState<UserDetails>({ name: "", email: "", phone: "" });
  const [collectionStage, setCollectionStage] = useState<CollectionStage>("greeting");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Welcome to Twin Health! 👋",
      isBot: true,
      timestamp: formatTime(new Date(Date.now() - 300000)),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Start the collection flow after initial greeting
  useEffect(() => {
    if (!hasInitialized) {
      setHasInitialized(true);
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setMessages((prev) => [
            ...prev,
            {
              id: "2",
              content: "Before we proceed, I'd like to know your name 😊",
              isBot: true,
              timestamp: formatTime(new Date()),
            },
          ]);
          setCollectionStage("name");
        }, 1500);
      }, 1000);
    }
  }, [hasInitialized]);

  function formatTime(date: Date): string {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  const getValidationError = (stage: CollectionStage, value: string): string | null => {
    const trimmedValue = value.trim();
    
    switch (stage) {
      case "name":
        if (!trimmedValue) return "Please enter your name.";
        if (!namePattern.test(trimmedValue)) {
          return "Please enter a valid name (letters, spaces, apostrophes, and hyphens only). Example: John, O'Neil, Van Der Beek";
        }
        return null;
      case "email":
        if (!trimmedValue) return "Please enter your email.";
        if (!emailPattern.test(trimmedValue)) {
          return "Please enter a valid email address.";
        }
        return null;
      case "phone":
        if (!trimmedValue) return "Please enter your phone number.";
        const cleanPhone = trimmedValue.replace(/\s+/g, "");
        if (!phonePattern.test(cleanPhone)) {
          return "Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.";
        }
        return null;
      default:
        return null;
    }
  };

  const addBotMessage = (content: string, callback?: () => void) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content,
          isBot: true,
          timestamp: formatTime(new Date()),
        },
      ]);
      callback?.();
    }, 1500);
  };

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      isBot: false,
      timestamp: formatTime(new Date()),
    };
    setMessages((prev) => [...prev, newMessage]);

    // Handle collection stages
    if (collectionStage !== "complete") {
      const error = getValidationError(collectionStage, content);
      
      if (error) {
        addBotMessage(error);
        return;
      }

      const trimmedContent = content.trim();

      switch (collectionStage) {
        case "name":
          setUserDetails((prev) => ({ ...prev, name: trimmedContent }));
          addBotMessage(`Nice to meet you, ${trimmedContent}! 🎉\n\nPlease enter your email address:`, () => {
            setCollectionStage("email");
          });
          break;
        case "email":
          setUserDetails((prev) => ({ ...prev, email: trimmedContent }));
          addBotMessage("Great! Now please enter your phone number (10-digit Indian mobile):", () => {
            setCollectionStage("phone");
          });
          break;
        case "phone":
          const cleanPhone = trimmedContent.replace(/\s+/g, "");
          setUserDetails((prev) => ({ ...prev, phone: cleanPhone }));
          setCollectionStage("complete");
          addBotMessage(`Thank you for sharing your details! ✨\n\nI'm here to help you on your journey to reverse diabetes and achieve metabolic wellness. How can I assist you today?`);
          break;
      }
      return;
    }
    
    // Normal conversation after details collected
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

  const getInputPlaceholder = (): string => {
    switch (collectionStage) {
      case "name":
        return "Enter your name...";
      case "email":
        return "Enter your email...";
      case "phone":
        return "Enter your phone number...";
      default:
        return "We are here to help you...";
    }
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
            placeholder={getInputPlaceholder()}
            disabled={isTyping}
          />
        </>
      )}
    </div>
  );
};

export default ChatWidget;
