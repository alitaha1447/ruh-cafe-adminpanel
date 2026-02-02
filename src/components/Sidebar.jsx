import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router";
import {
  Globe,
  LayoutDashboard,
  Image,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  LogOut,
  FileText,
  Form,
  BriefcaseBusiness,
  GitBranch,
  ShieldHalf,
  User,
  SquareMenu,
  Footprints,
} from "lucide-react";
import ruhCafeLogo from "../assets/logo/ruhCafeLogo.png";

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({
    // 2: true, // Team Management dropdown open by default
    // 5: true, // Gallery Management dropdown open by default
  });

  const routes = [
    {
      id: 1,
      name: "Admin Dashboard",
      layout: "/admin",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      id: 2,
      name: "Banner Management",
      layout: "/admin",
      path: "/bannerManagement",
      icon: Image,
    },
    {
      id: 3,
      name: "360' Viewer Image",
      layout: "/admin",
      path: "/threeDViewer",
      icon: Image,
    },
    {
      id: 4,
      name: "Content Management",
      layout: "/admin",
      path: "/contentManagement",
      icon: Image,
    },
    {
      id: 5,
      name: "Menu Management",
      layout: "/admin",
      path: "/menu",
      icon: Image,
    },
    {
      id: 6,
      name: "About Owner",
      layout: "/admin",
      path: "/about-owner",
      icon: Image,
    },
    {
      id: 7,
      name: "About Cafe",
      layout: "/admin",
      path: "/about-cafe",
      icon: Image,
    },
    {
      id: 8,
      name: "Career Management",
      layout: "/admin",
      path: "/career",
      icon: Image,
    },
    {
      id: 9,
      name: "Form Management",
      layout: "/admin",
      path: "/form",
      icon: Image,
    },
    {
      id: 10,
      name: "SEO",
      layout: "/admin",
      path: "/seo",
      icon: Image,
    },

    // {
    //   id: 3,
    //   name: "About Us",
    //   layout: "/admin",
    //   path: "/about",
    //   icon: User,
    // },
    // {
    //   id: 4,
    //   name: "Content Management",
    //   layout: "/admin",
    //   path: "/content",
    //   icon: Image,
    // },

    // {
    //   id: 5,
    //   name: "Menu Management",
    //   layout: "/admin",
    //   icon: SquareMenu,
    //   children: [
    //     {
    //       id: 51,
    //       name: "Menu Content",
    //       layout: "/admin",
    //       path: "/menu/content",
    //       icon: FileText,
    //     },
    //   ],
    // },

    // {
    //   id: 6,
    //   name: "Branch Management",
    //   layout: "/admin",
    //   path: "/branchs",
    //   icon: GitBranch,
    // },
    // {
    //   id: 7,
    //   name: "Career Management ",
    //   layout: "/admin",
    //   path: "/career",
    //   icon: BriefcaseBusiness,
    // },
    // {
    //   id: 8,
    //   name: "Gallery Management",
    //   layout: "/admin",
    //   path: "/gallery",
    //   icon: Image,
    // },
    // {
    //   id: 9,
    //   name: "Form Management ",
    //   layout: "/admin",
    //   path: "/form",
    //   icon: Form,
    // },
    // {
    //   id: 10,
    //   name: "SEO ",
    //   layout: "/admin",
    //   path: "/seo",
    //   icon: Globe,
    // },
    // {
    //   id: 11,
    //   name: "Footer ",
    //   layout: "/admin",
    //   path: "/footer",
    //   icon: Footprints,
    // },
  ];

  const toggleDropdown = (routeId) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [routeId]: !prev[routeId],
    }));
  };

  const renderRoutes = (routesList) =>
    routesList.map((route) => {
      const Icon = route.icon;

      if (route.children?.length) {
        return (
          <div key={route.id} className="mb-1">
            <button
              onClick={() => toggleDropdown(route.id)}
              className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5" />
                <span>{route.name}</span>
              </div>
              {openDropdowns[route.id] ? (
                <ChevronDown className="w-4 h-4 transition-transform duration-200" />
              ) : (
                <ChevronRight className="w-4 h-4 transition-transform duration-200" />
              )}
            </button>

            {openDropdowns[route.id] && (
              <div className="ml-10 mt-1 space-y-1 border-l border-gray-200 pl-3">
                {renderRoutes(route.children)}
              </div>
            )}
          </div>
        );
      }

      return (
        <NavLink
          key={route.id}
          to={route.layout + route.path}
          end={route.path === "/dashboard"}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200
            ${
              isActive
                ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600 -ml-1"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`
          }
          onClick={() => setSidebarOpen(false)}
        >
          <Icon className="w-5 h-5" />
          <span>{route.name}</span>
        </NavLink>
      );
    });
  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-lg bg-white p-2.5 shadow-lg md:hidden hover:bg-gray-50 transition-colors"
        aria-label="Open sidebar"
      >
        <Menu className="w-5 h-5 text-gray-700" />
      </button>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white shadow-xl transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0`}
      >
        {/* Header */}
        <div className="flex items-center justify-center border-b border-gray-200 px-0 py-2 ">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <div className="flex">
              <img src={ruhCafeLogo} className="h-14" />
            </div>
            <div className="flex flex-row justify-between items-center gap-2"></div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1.5 hover:bg-gray-100 md:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="mb-6">
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Main Navigation
            </h3>
            <nav className="space-y-1">{renderRoutes(routes)}</nav>
          </div>
        </div>

        {/* Footer - Logout */}
        <div className="border-t border-gray-200 p-4">
          <button
            // onClick={handleLogout}
            className="flex w-full items-center justify-center gap-3 rounded-lg bg-linear-to-r from-red-50 to-red-50 px-4 py-3 text-sm font-medium text-red-600 transition-all duration-200 hover:from-red-100 hover:to-red-100 hover:shadow-sm"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
