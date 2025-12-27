import { useState, useRef, useEffect } from "react";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import WelcomeScreen from "./WelcomeScreen";
import TypingIndicator from "./TypingIndicator";
import InlineInput from "./InlineInput";
import { chatAPI } from "@/lib/api";

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: string;
  inputType?: "name" | "email" | "phone";
  inputSubmitted?: boolean;
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

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

const getInitialMessages = (): Message[] => [
  {
    id: "1",
    content: "Welcome to Twin Health! 👋",
    isBot: true,
    timestamp: formatTime(new Date()),
  },
];

const ChatWidget = () => {
  const [activeTab, setActiveTab] = useState<"home" | "conversation">("conversation");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails>({ name: "", email: "", phone: "" });
  const [collectionStage, setCollectionStage] = useState<CollectionStage>("greeting");
  const [messages, setMessages] = useState<Message[]>(getInitialMessages());
  const [isTyping, setIsTyping] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Initialize chat session
  useEffect(() => {
    const initializeSession = async () => {
      try {
        const response = await chatAPI.createSession();
        setSessionId(response.session_id);
        setApiError(null);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to initialize chat session';
        console.error('Session initialization error:', errorMessage);
        setApiError(errorMessage);
      }
    };

    if (!sessionId) {
      initializeSession();
    }
  }, []);

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
              content: "Can you please help me with your name?",
              isBot: true,
              timestamp: formatTime(new Date()),
              inputType: "name",
            },
          ]);
          setCollectionStage("name");
        }, 1500);
      }, 1000);
    }
  }, [hasInitialized]);

  const getValidationError = (stage: CollectionStage, value: string): string | null => {
    const trimmedValue = value.trim();
    
    switch (stage) {
      case "name":
        if (!trimmedValue) return "Please enter your name.";
        if (!namePattern.test(trimmedValue)) {
          return "Please enter a valid name (letters, spaces, apostrophes, and hyphens only).";
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

  const addBotMessage = (content: string, inputType?: "name" | "email" | "phone", callback?: () => void) => {
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
          inputType,
        },
      ]);
      callback?.();
    }, 1500);
  };

  const handleInlineSubmit = async (value: string, inputType: "name" | "email" | "phone") => {
    const error = getValidationError(inputType as CollectionStage, value);
    
    if (error) {
      addBotMessage(error, inputType);
      return;
    }

    // Mark current input as submitted
    setMessages((prev) =>
      prev.map((msg) =>
        msg.inputType === inputType && !msg.inputSubmitted
          ? { ...msg, inputSubmitted: true }
          : msg
      )
    );

    // Add user response message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: value,
      isBot: false,
      timestamp: formatTime(new Date()),
    };
    setMessages((prev) => [...prev, userMessage]);

    const trimmedValue = value.trim();
    let updatedDetails = { ...userDetails };

    switch (inputType) {
      case "name":
        updatedDetails = { ...updatedDetails, name: trimmedValue };
        setUserDetails(updatedDetails);
        addBotMessage(`Nice to meet you, ${trimmedValue}! 🎉\n\nPlease enter your email address:`, "email", () => {
          setCollectionStage("email");
        });
        break;
      case "email":
        updatedDetails = { ...updatedDetails, email: trimmedValue };
        setUserDetails(updatedDetails);
        addBotMessage("Great! Now please enter your phone number:", "phone", () => {
          setCollectionStage("phone");
        });
        break;
      case "phone":
        const cleanPhone = trimmedValue.replace(/\s+/g, "");
        updatedDetails = { ...updatedDetails, phone: cleanPhone };
        setUserDetails(updatedDetails);
        
        // Update user details on backend
        if (sessionId) {
          try {
            await chatAPI.updateUserDetails(sessionId, updatedDetails);
            setApiError(null);
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update user details';
            console.error('Update details error:', errorMessage);
            setApiError(errorMessage);
          }
        }
        
        // Set collection stage to complete immediately (not async)
        setCollectionStage("complete");
        
        addBotMessage(`Thank you for sharing your details! ✨\n\nI'm here to help you on your journey to reverse diabetes and achieve metabolic wellness. How can I assist you today?`);
        break;
    }
  };

  const handleSendMessage = async (content: string) => {
    if (collectionStage !== "complete" || !sessionId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      isBot: false,
      timestamp: formatTime(new Date()),
    };
    setMessages((prev) => [...prev, newMessage]);
    
    // Show typing indicator
    setIsTyping(true);

    try {
      // Send message to Django backend with Gemini
      const response = await chatAPI.sendMessage(
        sessionId,
        content,
        userDetails
      );

      setApiError(null);

      // Add bot response
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: response.bot_response,
        isBot: true,
        timestamp: formatTime(new Date()),
      };
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get response from Gemini';
      console.error('Send message error:', errorMessage);
      setApiError(errorMessage);
      
      const errorMessage_: Message = {
        id: (Date.now() + 2).toString(),
        content: `Sorry, I encountered an error: ${errorMessage}. Please try again.`,
        isBot: true,
        timestamp: formatTime(new Date()),
      };
      setMessages((prev) => [...prev, errorMessage_]);
    } finally {
      setIsTyping(false);
    }
  };

  const getInputPlaceholder = (type: "name" | "email" | "phone"): string => {
    switch (type) {
      case "name":
        return "Enter your name";
      case "email":
        return "Enter your email";
      case "phone":
        return "Enter your phone number";
    }
  };

  const getInputType = (type: "name" | "email" | "phone"): "text" | "email" | "tel" => {
    switch (type) {
      case "name":
        return "text";
      case "email":
        return "email";
      case "phone":
        return "tel";
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
              <div key={message.id}>
                {/* Hide bot message if it has an active input field (label shown in card) */}
                {!(message.isBot && message.inputType && !message.inputSubmitted) && (
                  <ChatMessage
                    content={message.content}
                    isBot={message.isBot}
                    timestamp={message.timestamp}
                    senderName={message.isBot ? "Twin Assistant" : undefined}
                  />
                )}
                {message.isBot && message.inputType && !message.inputSubmitted && (
                  <div className="mt-2 ml-10">
                    <InlineInput
                      label={message.content}
                      placeholder={getInputPlaceholder(message.inputType)}
                      type={getInputType(message.inputType)}
                      onSubmit={(value) => handleInlineSubmit(value, message.inputType!)}
                    />
                  </div>
                )}
              </div>
            ))}
            {isTyping && <TypingIndicator senderName="Twin Assistant" />}
            <div ref={messagesEndRef} />
          </div>
          
          <ChatInput
            onSend={handleSendMessage}
            placeholder={collectionStage === "complete" ? "We are here to help you..." : "Enter details in the input field"}
            disabled={isTyping || collectionStage !== "complete"}
          />
        </>
      )}
    </div>
  );
};

export default ChatWidget;
