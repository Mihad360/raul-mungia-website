import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  BarChart3,
  DollarSign,
  Percent,
  Settings,
  LogOut,
  ChartBarIcon,
} from "lucide-react";

export const SIDEBAR_MENU_ITEMS = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    label: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: ChartBarIcon,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    label: "Revenue",
    href: "/admin/revenue",
    icon: DollarSign,
  },
  {
    label: "Discounts & Coupons",
    href: "/admin/discounts",
    icon: Percent,
  },
  {
    label: "Settings",
    href: "/admin/settings/profile",
    icon: Settings,
  },
];

export const LOGOUT_ITEM = {
  label: "Logout",
  icon: LogOut,
};
