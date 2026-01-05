import twinHealthLogo from "@/assets/TwinHealthLogo.png";

const Header = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navItems = [
    { label: "Why Twin", id: "why-twin" },
    { label: "How It Works", id: "how-it-works" },
    { label: "Testimonials", id: "testimonials" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <header className="w-full py-4 px-4 sm:px-6 md:px-12 flex items-center justify-between bg-[#1a1f3d]">
      <div className="flex items-center gap-2">
        <img src={twinHealthLogo} alt="Twin Health" className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0" />
        <span className="text-lg sm:text-xl font-bold text-white leading-tight whitespace-nowrap">
          twin<br />health
        </span>
      </div>

      <nav className="hidden md:flex items-center gap-6 lg:gap-8">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className="text-white/80 hover:text-white transition-colors text-sm lg:text-base font-medium"
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Mobile navigation */}
      <nav className="flex md:hidden items-center gap-3 overflow-x-auto">
        {navItems.slice(0, 3).map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className="text-white/80 hover:text-white transition-colors text-xs font-medium whitespace-nowrap"
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
};

export default Header;
