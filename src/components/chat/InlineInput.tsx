import { useState } from "react";
import { ChevronRight } from "lucide-react";

interface InlineInputProps {
  placeholder: string;
  onSubmit: (value: string) => void;
  type?: "text" | "email" | "tel";
  label?: string;
}

const InlineInput = ({ placeholder, onSubmit, type = "text", label }: InlineInputProps) => {
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
    <div className="bg-card rounded-xl shadow-sm p-3 space-y-2">
      {label && (
        <p className="text-sm text-foreground">{label}</p>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`w-full px-3 py-2 text-sm rounded-full border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none transition-all duration-200 ${
          isFocused ? "border-primary ring-2 ring-primary/20" : "border-border"
        }`}
      />
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={!value.trim()}
          className="flex items-center gap-0.5 text-sm text-primary font-medium hover:text-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default InlineInput;
