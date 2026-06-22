"use client";

import { LOGOUT_ITEM, SIDEBAR_MENU_ITEMS } from "@/utils/admin-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Modal, message } from "antd";
import { handleLogout as clearAuthSession } from "@/lib/auth/auth.handlers";
import { useDispatch } from "react-redux";
import { baseApi } from "@/redux/api/baseApi";

const AdminSidebar = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  const handleLogout = () => {
    Modal.confirm({
      title: "Sign out?",
      content: "You'll be signed out and redirected to the home page.",
      okText: "Yes, sign out",
      cancelText: "Cancel",
      okButtonProps: { style: { backgroundColor: "#C70A24" } },
      onOk: () => {
        clearAuthSession();
        dispatch(baseApi.util.resetApiState());
        message.success("Signed out successfully");
        window.location.href = "/";
      },
    });
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-[calc(100vh-64px)] sticky top-16">
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {SIDEBAR_MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                active ? "text-white" : "text-gray-700 hover:bg-gray-100"
              }`}
              style={active ? { backgroundColor: "#C70A24" } : undefined}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-200 p-4 mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
        >
          <LOGOUT_ITEM.icon size={20} />
          <span>{LOGOUT_ITEM.label}</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
