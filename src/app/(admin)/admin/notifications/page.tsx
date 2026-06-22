/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCheck,
  Loader2,
  Package,
  ShoppingBag,
  Truck,
  DollarSign,
  AlertTriangle,
  MessageSquare,
  Mail,
  XCircle,
  Home,
  UserPlus,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { message } from "antd";
import {
  useGetMyNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} from "@/redux/api/notificationApi";
import RmPagination from "@/components/ui/RmPagination";
import { formatDate } from "@/utils/orderHelpers";

type NotificationType =
  | "order_placed"
  | "order_confirmed"
  | "order_processing"
  | "order_ready_for_pickup"
  | "order_shipped"
  | "order_delivered"
  | "order_completed"
  | "order_cancelled"
  | "order_cancelled_by_user"
  | "payment_captured"
  | "payment_failed"
  | "payment_refunded"
  | "payment_received"
  | "payment_refund_requested"
  | "coupon_applied"
  | "welcome"
  | "user_registration"
  | "new_order"
  | "low_stock"
  | "out_of_stock"
  | "new_contact_message"
  | "newsletter_signup"
  | "message"
  | "system_announcement";

type Notification = {
  _id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
};

// ─── Type → icon + color mapping ───────────────────────────
const typeStyles: Record<string, { icon: any; color: string; bg: string }> = {
  // Orders
  new_order: {
    icon: ShoppingBag,
    color: "text-emerald-700",
    bg: "bg-emerald-50",
  },
  order_placed: {
    icon: ShoppingBag,
    color: "text-emerald-700",
    bg: "bg-emerald-50",
  },
  order_confirmed: {
    icon: CheckCheck,
    color: "text-blue-700",
    bg: "bg-blue-50",
  },
  order_processing: {
    icon: Package,
    color: "text-amber-700",
    bg: "bg-amber-50",
  },
  order_ready_for_pickup: {
    icon: Home,
    color: "text-amber-700",
    bg: "bg-amber-50",
  },
  order_shipped: { icon: Truck, color: "text-purple-700", bg: "bg-purple-50" },
  order_delivered: {
    icon: CheckCheck,
    color: "text-emerald-700",
    bg: "bg-emerald-50",
  },
  order_completed: {
    icon: CheckCheck,
    color: "text-emerald-700",
    bg: "bg-emerald-50",
  },
  order_cancelled: { icon: XCircle, color: "text-red-700", bg: "bg-red-50" },
  order_cancelled_by_user: {
    icon: XCircle,
    color: "text-red-700",
    bg: "bg-red-50",
  },
  // Payments
  payment_received: {
    icon: DollarSign,
    color: "text-emerald-700",
    bg: "bg-emerald-50",
  },
  payment_captured: {
    icon: DollarSign,
    color: "text-emerald-700",
    bg: "bg-emerald-50",
  },
  payment_failed: { icon: XCircle, color: "text-red-700", bg: "bg-red-50" },
  payment_refunded: {
    icon: RotateCcw,
    color: "text-orange-700",
    bg: "bg-orange-50",
  },
  payment_refund_requested: {
    icon: RotateCcw,
    color: "text-orange-700",
    bg: "bg-orange-50",
  },
  // Inventory
  low_stock: {
    icon: AlertTriangle,
    color: "text-yellow-700",
    bg: "bg-yellow-50",
  },
  out_of_stock: { icon: AlertTriangle, color: "text-red-700", bg: "bg-red-50" },
  // Users
  user_registration: {
    icon: UserPlus,
    color: "text-blue-700",
    bg: "bg-blue-50",
  },
  welcome: { icon: Sparkles, color: "text-blue-700", bg: "bg-blue-50" },
  // Communications
  new_contact_message: {
    icon: MessageSquare,
    color: "text-indigo-700",
    bg: "bg-indigo-50",
  },
  newsletter_signup: { icon: Mail, color: "text-cyan-700", bg: "bg-cyan-50" },
  // Misc
  coupon_applied: { icon: Sparkles, color: "text-pink-700", bg: "bg-pink-50" },
  message: { icon: MessageSquare, color: "text-gray-700", bg: "bg-gray-50" },
  system_announcement: { icon: Bell, color: "text-gray-700", bg: "bg-gray-50" },
};

const getStyle = (type: string) =>
  typeStyles[type] || { icon: Bell, color: "text-gray-700", bg: "bg-gray-50" };

// ─── Relative time helper ─────────────────────────────────
const timeAgo = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(dateStr);
};

export default function AdminNotificationsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: notificationsResponse, isLoading } = useGetMyNotificationsQuery(
    {
      page: currentPage,
      limit: 15,
      isRead: filter === "unread" ? false : undefined,
    },
  );

  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAllAsRead, { isLoading: markingAll }] =
    useMarkAllNotificationsAsReadMutation();

  const notifications: Notification[] = notificationsResponse?.data || [];
  const meta = notificationsResponse?.meta || {
    page: 1,
    limit: 15,
    total: 0,
    totalPage: 1,
  };

  const handleNotificationClick = async (n: Notification) => {
    // Mark as read if not already
    if (!n.isRead) {
      try {
        await markAsRead(n._id).unwrap();
      } catch {
        // silent fail — user-facing flow continues
      }
    }

    // Navigate based on type/data
    const orderId = n.data?.orderId as string | undefined;
    if (orderId) {
      router.push(`/admin/orders`);
      return;
    }
    if (n.type === "new_contact_message") {
      router.push(`/admin/contact-messages`);
      return;
    }
    if (n.type === "user_registration") {
      router.push(`/admin/customers`);
      return;
    }
    if (n.type === "low_stock" || n.type === "out_of_stock") {
      router.push(`/admin/products`);
      return;
    }
    if (n.type === "newsletter_signup") {
      router.push(`/admin/newsletter`);
      return;
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead(undefined).unwrap();
      message.success("All notifications marked as read");
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to mark all as read");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
              {meta.total} total
            </span>
          </div>
          <p className="text-gray-600 text-sm">
            Order updates, payments, and system alerts
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          disabled={markingAll || meta.total === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border border-gray-300 hover:bg-gray-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <CheckCheck size={16} />
          {markingAll ? "Marking..." : "Mark all as read"}
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { value: "all" as const, label: "All" },
          { value: "unread" as const, label: "Unread" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setFilter(tab.value);
              setCurrentPage(1);
            }}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
              filter === tab.value
                ? "text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
            style={
              filter === tab.value ? { borderColor: "#C70A24" } : undefined
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notification list */}
      {isLoading ? (
        <div className="bg-white rounded-lg border border-gray-100 py-20 flex justify-center">
          <Loader2 size={32} className="animate-spin text-gray-400" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-100 py-20 text-center">
          <Bell size={48} className="mx-auto text-gray-300 mb-3 stroke-1" />
          <p className="text-gray-500 mb-1">
            {filter === "unread"
              ? "You're all caught up!"
              : "No notifications yet"}
          </p>
          <p className="text-xs text-gray-400">
            New activity will show up here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-100 overflow-hidden divide-y divide-gray-100">
          {notifications.map((n) => {
            const style = getStyle(n.type);
            const Icon = style.icon;

            return (
              <button
                key={n._id}
                onClick={() => handleNotificationClick(n)}
                className={`w-full text-left px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer flex items-start gap-4 ${
                  !n.isRead ? "bg-red-50/30" : ""
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full ${style.bg} flex items-center justify-center flex-shrink-0`}
                >
                  <Icon size={18} className={style.color} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p
                      className={`text-sm ${
                        n.isRead
                          ? "font-medium text-gray-900"
                          : "font-bold text-gray-900"
                      }`}
                    >
                      {n.title}
                    </p>
                    {!n.isRead && (
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: "#C70A24" }}
                      />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {n.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {timeAgo(n.createdAt)}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {meta.totalPage > 1 && (
        <div className="flex justify-center">
          <RmPagination
            currentPage={currentPage}
            totalPages={meta.totalPage}
            onPageChange={setCurrentPage}
            showFirstLast
          />
        </div>
      )}
    </div>
  );
}
