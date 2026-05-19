import {
  User,
  Shield,
  Bell,
  Palette,
  HelpCircle,
  FileText,
  BookOpen,
  Award,
  FileCheck,
  Truck,
  FlaskConical,
  CreditCard,
  AlertCircle,
} from "lucide-react";

export const SETTINGS_MENU_ITEMS = [
  {
    href: "/admin/settings/profile",
    label: "Profile Settings",
    icon: User,
  },
  {
    href: "/admin/settings/about",
    label: "About Us",
    icon: Shield,
  },
  {
    href: "/admin/settings/blog",
    label: "Blog",
    icon: BookOpen,
  },
  {
    href: "/admin/settings/faq",
    label: "FAQ",
    icon: HelpCircle,
  },
  {
    href: "/admin/settings/certification",
    label: "Certification",
    icon: Award,
  },
  {
    href: "/admin/settings/terms",
    label: "Terms & Conditions",
    icon: FileCheck,
  },
  {
    href: "/admin/settings/disclaimer",
    label: "Disclaimer",
    icon: AlertCircle,
  },
  {
    href: "/admin/settings/shipping",
    label: "Shipping Policy",
    icon: Truck,
  },
  {
    href: "/admin/settings/purity",
    label: "Explore Purity",
    icon: FlaskConical,
  },
  {
    href: "/admin/settings/payment",
    label: "Payment Method",
    icon: CreditCard,
  },
];
