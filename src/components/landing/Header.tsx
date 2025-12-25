import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full py-4 px-6 md:px-12 flex items-center justify-between bg-background">
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 8C20 8 12 14 12 22C12 26.4183 15.5817 30 20 30C24.4183 30 28 26.4183 28 22C28 14 20 8 20 8Z" fill="#E94E87"/>
            <path d="M14 12C14 12 8 16 8 22C8 25.3137 10.6863 28 14 28C17.3137 28 20 25.3137 20 22C20 16 14 12 14 12Z" fill="#4299E1"/>
            <path d="M26 12C26 12 32 16 32 22C32 25.3137 29.3137 28 26 28C22.6863 28 20 25.3137 20 22C20 16 26 12 26 12Z" fill="#F6AD55"/>
          </svg>
          <span className="ml-2 text-xl font-bold text-foreground leading-tight">
            twin<br />health
          </span>
        </div>
      </div>

      <nav className="hidden md:flex items-center gap-8">
        <a href="#about" className="text-foreground font-medium hover:text-primary transition-colors">
          About Twin
        </a>
        <a href="#success" className="text-foreground font-medium hover:text-primary transition-colors">
          Success Stories
        </a>
        <a href="#team" className="text-foreground font-medium hover:text-primary transition-colors">
          Our Team
        </a>
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-6">
          Get In Touch
        </Button>
        <button className="p-2">
          <Menu className="w-6 h-6 text-foreground" />
        </button>
      </nav>

      <button className="md:hidden p-2">
        <Menu className="w-6 h-6 text-foreground" />
      </button>
    </header>
  );
};

export default Header;
