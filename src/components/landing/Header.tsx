import twinHealthLogo from "@/assets/TwinHealthLogo.png";

const Header = () => {
  return (
    <header className="w-full py-4 px-4 sm:px-6 md:px-12 flex items-center justify-start bg-[#1a1f3d]">
      <div className="flex items-center gap-2">
        <img src={twinHealthLogo} alt="Twin Health" className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0" />
        <span className="text-lg sm:text-xl font-bold text-white leading-tight whitespace-nowrap">
          twin<br />health
        </span>
      </div>
    </header>
  );
};

export default Header;
