const TopNavbar = ({ onMenuClick }) => {
  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
      {/* Mobile Menu Button */}
      <button
        className=" text-indigo-600 text-2xl"
        onClick={onMenuClick}
        aria-label="Open Menu"
      >
        ☰
      </button>
      <h1 className="text-xl font-semibold text-gray-700">لوحة التحكم</h1>
    </header>
  );
};

export default TopNavbar;
