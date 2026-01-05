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
    </header>
  );
};

export default Header;
