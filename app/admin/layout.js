"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Images,  LayoutDashboard, LogOut } from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Blogs", href: "/admin/blogs", icon: Images },
  { name: "Logout", href: "#", icon: LogOut, action: "logout" },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar when window resized to large screen
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`bg-white shadow-lg w-64 fixed lg:relative z-30 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="p-6">
          <Link href={"/admin"} className="text-2xl font-bold text-orange-600">
            Admin Panel
          </Link>
          <nav className="flex flex-col gap-1 mt-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                 
                  onClick={async () => {
                   handleLinkClick;

                    if (item.name === "Logout") {
                      await fetch("/api/login");
                      window.location.href = "/login"; // Redirect to login page
                    }
                  }}
                  className={`flex items-center gap-3 px-4 py-2 rounded text-md font-medium transition-all duration-200 ${
                    pathname === item.href
                      ? "bg-orange-100 text-orange-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={20} className="text-orange-500" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 m-0 lg:m-10">
        {/* Topbar for medium and small */}
        <div className="lg:hidden flex justify-between items-center bg-white px-4 py-3 shadow-md">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <span className="text-lg font-semibold text-gray-700">
            Admin Panel
          </span>
        </div>

        {/* Overlay for mobile/medium when sidebar is open */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 bg-opacity-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Children Content */}
        <main className="mx-auto px-4 lg:px-0 mt-4">{children}</main>
      </div>
    </div>
  );
}
