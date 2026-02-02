import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 py-4 px-6">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="mb-3 md:mb-0">
          <p className="text-sm text-gray-600">
            © {currentYear} Ba-Dastoor Admin Portal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
