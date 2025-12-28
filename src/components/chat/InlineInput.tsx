import { useState } from "react";
import { ChevronRight } from "lucide-react";

interface InlineInputProps {
  placeholder: string;
  onSubmit: (value: string) => void;
  type?: "text" | "email" | "tel";
  label?: string;
}

const MAX_LENGTH = 120;
const VALID_PATTERN = /^[a-zA-Z\s.,!?]*$/;

const InlineInput = ({ placeholder, onSubmit, type = "text", label }: InlineInputProps) => {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState("");

  const validateInput = (input: string): boolean => {
    if (input.length > MAX_LENGTH) {
      setError(`Input cannot exceed ${MAX_LENGTH} characters`);
      return false;
    }
    if (!VALID_PATTERN.test(input)) {
      setError("Kindly provide proper input which includes english alphabets");
      return false;
    }
    setError("");
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= MAX_LENGTH) {
      setValue(newValue);
      validateInput(newValue);
    }
  };

  const handleSubmit = () => {
    if (value.trim() && validateInput(value)) {
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
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        maxLength={MAX_LENGTH}
        className={`w-full px-3 py-2 text-sm rounded-full border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none transition-all duration-200 ${
          error ? "border-destructive ring-2 ring-destructive/20" : isFocused ? "border-primary ring-2 ring-primary/20" : "border-border"
        }`}
      />
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={!value.trim() || !!error}
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
