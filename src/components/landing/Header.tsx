import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import twinHealthLogo from "@/assets/TwinHealthLogo.png";

const Header = () => {
  return (
    <header className="w-full py-4 px-6 md:px-12 flex items-center justify-between bg-[#1a1f3d]">
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          <img src={twinHealthLogo} alt="Twin Health" className="w-10 h-10" />
          <span className="ml-2 text-xl font-bold text-white leading-tight">
            twin<br />health
          </span>
        </div>
      </div>

      <nav className="hidden md:flex items-center gap-8">
        <a href="#about" className="text-white font-medium hover:text-white/80 transition-colors">
          About Twin
        </a>
        <a href="#success" className="text-white font-medium hover:text-white/80 transition-colors">
          Success Stories
        </a>
        <a href="#team" className="text-white font-medium hover:text-white/80 transition-colors">
          Our Team
        </a>
        <Button className="bg-[#e87b35] hover:bg-[#d66a28] text-white rounded-full px-6">
          Get In Touch
        </Button>
        <button className="p-2">
          <Menu className="w-6 h-6 text-white" />
        </button>
      </nav>

      <button className="md:hidden p-2">
        <Menu className="w-6 h-6 text-foreground" />
      </button>
    </header>
  );
};

export default Header;
