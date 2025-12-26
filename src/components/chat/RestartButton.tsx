import { RotateCcw } from "lucide-react";

interface RestartButtonProps {
  onRestart: () => void;
}

const RestartButton = ({ onRestart }: RestartButtonProps) => {
  return (
    <button
      onClick={onRestart}
      className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm font-medium mx-auto mt-4"
    >
      <RotateCcw className="w-4 h-4" />
      Restart
    </button>
  );
};

export default RestartButton;
