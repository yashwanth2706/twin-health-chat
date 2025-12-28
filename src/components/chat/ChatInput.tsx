import { useState } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const MAX_CHARS = 120;
const VALID_PATTERN = /^[a-zA-Z\s.,!?"]*$/;

const ChatInput = ({ onSend, placeholder = "Type your message...", disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const validateInput = (value: string): boolean => {
    if (value.length > MAX_CHARS) {
      setError(`Message cannot exceed ${MAX_CHARS} characters`);
      return false;
    }
    if (!VALID_PATTERN.test(value)) {
      setError("Kindly provide proper input which includes english alphabets");
      return false;
    }
    setError("");
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_CHARS) {
      setMessage(value);
      validateInput(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled && validateInput(message)) {
      onSend(message.trim());
      setMessage("");
      setError("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2 p-4 bg-card border-t border-border">
      <div className="flex-1 relative">
        <textarea
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className={cn(
            "w-full px-4 py-3 rounded-2xl bg-secondary border-0 resize-none",
            "text-sm text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-accent/50",
            "transition-all duration-200",
            "min-h-[44px] max-h-[120px]",
            error && "ring-2 ring-destructive/50"
          )}
          style={{
            height: "auto",
            overflow: "hidden",
          }}
          maxLength={MAX_CHARS}
        />
        {error && (
          <p className="text-xs text-destructive mt-1 px-2">{error}</p>
        )}
        <span className="absolute right-2 bottom-1 text-xs text-muted-foreground">
          {message.length}/{MAX_CHARS}
        </span>
      </div>
      
      <button
        type="submit"
        disabled={!message.trim() || disabled}
        className={cn(
          "flex-shrink-0 p-3 rounded-full transition-all duration-200",
          message.trim() && !disabled
            ? "bg-accent text-accent-foreground shadow-md hover:shadow-lg hover:scale-105"
            : "bg-muted text-muted-foreground cursor-not-allowed"
        )}
      >
        <Send className="w-5 h-5" />
      </button>
    </form>
  );
};

export default ChatInput;
