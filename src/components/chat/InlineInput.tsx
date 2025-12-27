import { useState } from "react";
import { ChevronRight } from "lucide-react";

interface InlineInputProps {
  placeholder: string;
  onSubmit: (value: string) => void;
  type?: "text" | "email" | "tel";
}

const InlineInput = ({ placeholder, onSubmit, type = "text" }: InlineInputProps) => {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit(value.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="mt-2 space-y-1.5">
      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`w-full px-3 py-2 text-sm rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none transition-all duration-200 ${
          isFocused ? "border-primary ring-2 ring-primary/20" : "border-border"
        }`}
      />
      <button
        onClick={handleSubmit}
        disabled={!value.trim()}
        className="flex items-center gap-1 text-sm text-primary font-medium hover:text-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
      >
        Submit
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default InlineInput;
