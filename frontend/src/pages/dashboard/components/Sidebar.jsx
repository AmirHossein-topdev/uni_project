"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaBoxOpen,
  FaChevronDown,
  FaChevronUp,
  FaHome,
  FaShoppingBag,
  FaStore,
  FaTimes,
  FaUsers,
} from "react-icons/fa";

const menuItems = [
  { label: "داشبورد", icon: <FaHome />, href: "/dashboard" },
  {
    label: "مالکان",
    icon: <FaShoppingBag />,
    href: "/dashboard/main/owners",
  },
  {
    label: "مستغلات سازمانی",
    icon: <FaBoxOpen />,
    href: "/dashboard/main/properties",
  },
  {
    label: "کاربران",
    icon: <FaUsers />,
    href: "/dashboard/main/users",
  },
];

function MenuItem({ item, pathname, onClose, level = 0 }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (item.subMenu && pathname) {
      const matchSub = item.subMenu.some(
        (sub) => pathname === sub.href || pathname.startsWith(sub.href)
      );
      if (matchSub) setOpen(true);
    }
  }, [pathname, item.subMenu]);

  const isActive = pathname
    ? item.href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(item.href)
    : false;

  const paddingRight = 16 + level * 12;
  const fontSize = `${Math.max(14 - level * 2, 10)}px`;

  if (item.subMenu) {
    return (
      <li>
        <div
          className={`flex items-center justify-between rounded-lg p-2 hover:bg-gray-300 ${
            isActive ? "bg-gray-300 text-green-800" : "text-white"
          }`}
          style={{ paddingRight }}
        >
          <Link
            href={item.href}
            className="flex items-center gap-3 flex-1"
            onClick={onClose}
          >
            {item.icon}
            <span className="text-sm font-medium" style={{ fontSize }}>
              {item.label}
            </span>
          </Link>
          <button
            type="button"
            className="text-gray-900 hover:text-green-400 p-1"
            onClick={() => setOpen(!open)}
          >
            {open ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
          </button>
        </div>

        {open && (
          <ul className="mt-1 space-y-1">
            {item.subMenu.map((sub, i) => (
              <MenuItem
                key={i}
                item={sub}
                pathname={pathname}
                onClose={onClose}
                level={level + 1}
              />
            ))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <li>
      <Link
        href={item.href}
        className={`flex items-center gap-3 rounded-lg p-2 hover:bg-gray-800 hover:text-green-400 ${
          isActive ? "bg-gray-800 text-green-400 bg-cyan200" : "text-white"
        }`}
        style={{ paddingRight }}
        onClick={onClose}
      >
        {item.icon}
        <span className="text-sm font-medium" style={{ fontSize }}>
          {item.label}
        </span>
      </Link>
    </li>
  );
}

export default function Sidebar({ isMobileOpen, onClose }) {
  const pathname = usePathname() || "";

  useEffect(() => {
    const sidebarLogo = document.getElementById("sidebarLogo");
    const sidebar = document.getElementById("sidebar");
    const mainContent = document.getElementById("mainContent");

    const toggleSidebar = () => {
      if (window.innerWidth >= 1024) {
        sidebar.classList.toggle("lg:w-20");
        sidebar.classList.toggle("lg:w-56");
        mainContent.classList.toggle("lg:mr-20");
        mainContent.classList.toggle("lg:mr-56");
      }
    };

    sidebarLogo?.addEventListener("click", toggleSidebar);
    return () => sidebarLogo?.removeEventListener("click", toggleSidebar);
  }, []);

  return (
    <div
      id="sidebar"
      className={`fixed top-0 right-0 h-full w-56 z-50 bg-gray-700 text-white flex-col transition-transform duration-300 transform ${
        isMobileOpen ? "translate-x-0" : "translate-x-full"
      } lg:translate-x-0 lg:flex`}
    >
      <div className="flex items-center justify-between p-4">
        <div
          id="sidebarLogo"
          className="flex items-center gap-2 cursor-pointer text-green-900 font-bold text-xl"
        >
          <FaStore />
          <span className="sidebar-title">پنل مدیریت</span>
        </div>
        <button onClick={onClose} className="lg:hidden text-2xl text-white">
          <FaTimes />
        </button>
      </div>

      <ul className="mt-4 space-y-2 px-2 text-white">
        {menuItems.map((item, i) => (
          <MenuItem key={i} item={item} pathname={pathname} onClose={onClose} />
        ))}
      </ul>
    </div>
  );
}
