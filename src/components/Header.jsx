import React from "react";
import { Menu, Bell, Search, ChevronDown } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button className="lg:hidden rounded-lg p-2 hover:bg-gray-100">
            <Menu className="h-5 w-5 text-gray-600" />
          </button>

          {/* Page Title - You can make this dynamic */}
          <h1 className="text-lg font-bold text-gray-900">Ruf Cafe</h1>
          <span className="text-[#00000094] font-bold">Dashboard</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
