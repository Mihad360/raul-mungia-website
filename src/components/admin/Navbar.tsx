"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Bell, LogOut, ChevronDown } from "lucide-react";
import { Modal, message } from "antd";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { baseApi } from "@/redux/api/baseApi";
import { useGetMyProfileQuery } from "@/redux/api/authApi";
import { useGetUnreadCountQuery } from "@/redux/api/notificationApi";
import { handleLogout as clearAuthSession } from "@/lib/auth/auth.handlers";

const AdminNavbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const dispatch = useDispatch();

  // Get current admin info
  const { data: profileData } = useGetMyProfileQuery(undefined);
  const admin = profileData?.data;

  // Get unread notification count (polls every 30s + refetches on focus)
  const { data: unreadResponse } = useGetUnreadCountQuery(undefined, {
    pollingInterval: 30000,
    refetchOnFocus: true,
  });
  const unreadCount: number = unreadResponse?.data?.count ?? 0;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get initials from admin name
  const getInitials = (name?: string) => {
    if (!name) return "AD";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleLogout = () => {
    setIsProfileOpen(false);
    Modal.confirm({
      title: "Sign out?",
      content: "You'll be signed out and redirected to the home page.",
      okText: "Yes, sign out",
      cancelText: "Cancel",
      okButtonProps: { style: { backgroundColor: "#C70A24" } },
      onOk: () => {
        // Clear token via the shared auth helper
        clearAuthSession();

        // Clear all RTK Query cached data
        dispatch(baseApi.util.resetApiState());

        message.success("Signed out successfully");

        // Hard redirect to public home
        window.location.href = "/";
      },
    });
  };

  return (
    <nav className="h-16 bg-white border-b border-gray-200 sticky top-0 z-40 flex items-center justify-between px-8">
      {/* Left: Logo (links to public home) */}
      <Link
        href="/"
        className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
      >
        <div
          className="w-8 h-8 rounded flex items-center justify-center"
          style={{ backgroundColor: "#C70A24" }}
        >
          <span className="text-white text-xs font-bold">SR</span>
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">STX Research</p>
          <p className="text-xs text-gray-500">Admin Control</p>
        </div>
      </Link>

      {/* Right: Notification + User Profile */}
      <div className="flex items-center gap-6">
        {/* Notification Bell with unread badge */}
        <Link
          href="/admin/notifications"
          className="relative text-gray-600 hover:text-gray-900 transition-colors cursor-pointer p-2"
          aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span
              className="absolute top-0 right-0 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
              style={{ backgroundColor: "#C70A24" }}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Link>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-900">
                {admin?.name || "Admin User"}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {admin?.role === "super_admin"
                  ? "Super Admin"
                  : admin?.role || "Admin"}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <div
                className="w-10 h-10 rounded-full text-white flex items-center justify-center font-semibold text-sm"
                style={{ backgroundColor: "#1f2937" }}
              >
                {getInitials(admin?.name)}
              </div>
              <ChevronDown
                size={16}
                className={`text-gray-400 transition-transform duration-200 ${
                  isProfileOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {admin?.name || "Admin User"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {admin?.email || "—"}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
