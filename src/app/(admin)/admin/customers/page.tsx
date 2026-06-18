/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import {
  Search,
  Users,
  UserPlus,
  Calendar,
  Activity,
  Mail,
  Phone,
  MapPin,
  Shield,
  Eye,
  User as UserIcon,
} from "lucide-react";
import RmPagination from "@/components/ui/RmPagination";
import RmModal from "@/components/ui/RmModal";
import RmTable from "@/components/ui/RmTable";
import { useGetUsersQuery } from "@/redux/api/userApi";

// ─── Backend-aligned types ────────────────────────────────────
type Role = "user" | "admin" | "super_admin";

type User = {
  _id: string;
  email: string;
  name?: string;
  phone?: string | null;
  address?: string | null;
  profileImage?: string | null;
  role: Role;
  isActive: boolean;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
};

// ─── Helpers ──────────────────────────────────────────────────
const getInitials = (user: User): string => {
  const source = user.name || user.email;
  if (!source) return "?";
  const parts = source.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const formatDate = (iso?: string): string => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const roleConfig: Record<
  Role,
  { label: string; bg: string; text: string; icon: any }
> = {
  user: {
    label: "Customer",
    bg: "bg-gray-100",
    text: "text-gray-700",
    icon: UserIcon,
  },
  admin: {
    label: "Admin",
    bg: "bg-blue-50",
    text: "text-blue-700",
    icon: Shield,
  },
  super_admin: {
    label: "Super Admin",
    bg: "bg-red-50",
    text: "text-red-700",
    icon: Shield,
  },
};

// ─── Role Badge ───────────────────────────────────────────────
const RoleBadge = ({ role }: { role: Role }) => {
  const cfg = roleConfig[role];
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}
    >
      <Icon size={11} />
      {cfg.label}
    </span>
  );
};

// ─── Status Badge ─────────────────────────────────────────────
const StatusBadge = ({ isActive }: { isActive: boolean }) => (
  <span
    className={`px-2 py-1 rounded-full text-xs font-semibold ${
      isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"
    }`}
  >
    {isActive ? "Active" : "Inactive"}
  </span>
);

// ─── KPI Card ─────────────────────────────────────────────────
const KPICard = ({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: any;
  color: string;
}) => (
  <div className="bg-white rounded-lg border border-gray-100 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div
        className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
        style={{ backgroundColor: color }}
      >
        <Icon size={24} />
      </div>
    </div>
    <p className="text-sm text-gray-600 font-medium mb-2">{title}</p>
    <p className="text-3xl font-bold text-gray-900">{value}</p>
  </div>
);

// ─── User Details Modal ───────────────────────────────────────
const UserDetailsModal = ({
  isOpen,
  onClose,
  user,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}) => {
  if (!user) return null;

  return (
    <RmModal
      isOpen={isOpen}
      onClose={onClose}
      title="Customer Details"
      width="max-w-2xl"
    >
      <div className="space-y-5 max-h-[65vh] overflow-y-auto pr-2">
        {/* Profile Header */}
        <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
          <div
            className="w-20 h-20 rounded-full overflow-hidden relative flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "#C70A24" }}
          >
            {user.profileImage ? (
              <Image
                src={user.profileImage}
                alt={user.name || user.email}
                fill
                className="object-cover"
                sizes="80px"
              />
            ) : (
              <span className="text-white text-2xl font-bold">
                {getInitials(user)}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <h2 className="text-xl font-bold text-gray-900">
                {user.name || "Unnamed User"}
              </h2>
              <RoleBadge role={user.role} />
              <StatusBadge isActive={user.isActive} />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail size={14} />
              <span className="truncate">{user.email}</span>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                <Phone size={12} />
                <span>Phone</span>
              </div>
              <p className="text-sm font-medium text-gray-900">
                {user.phone || "—"}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                <MapPin size={12} />
                <span>Address</span>
              </div>
              <p className="text-sm font-medium text-gray-900">
                {user.address || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
            Account Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                <Calendar size={12} />
                <span>Joined</span>
              </div>
              <p className="text-sm font-medium text-gray-900">
                {formatDate(user.createdAt)}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                <Activity size={12} />
                <span>Last Updated</span>
              </div>
              <p className="text-sm font-medium text-gray-900">
                {formatDate(user.updatedAt)}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 md:col-span-2">
              <p className="text-xs text-gray-500 mb-1">User ID</p>
              <p className="text-xs font-mono text-gray-700 break-all">
                {user._id}
              </p>
            </div>
          </div>
        </div>

        {/* Future: Orders Section */}
        <div className="border-t border-gray-100 pt-5">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-700">
            💡 Order history for this customer will be available once the orders
            module is integrated.
          </div>
        </div>
      </div>
    </RmModal>
  );
};

// ─── Main Page ────────────────────────────────────────────────
export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ─── API ─────────────────────────────────────────────────────
  const { data: usersResponse, isLoading } = useGetUsersQuery({
    page: currentPage,
    limit: itemsPerPage,
    searchTerm: searchQuery || undefined,
  });

  const users: User[] = usersResponse?.data || [];
  const meta = usersResponse?.meta || {
    page: 1,
    limit: 10,
    total: users.length,
    totalPage: 1,
  };

  // Reset to page 1 on search change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [searchQuery]);

  // ─── KPIs ────────────────────────────────────────────────────
  const kpis = useMemo(() => {
    const total = meta.total ?? users.length;
    const customers = users.filter((u) => u.role === "user").length;
    const admins = users.filter(
      (u) => u.role === "admin" || u.role === "super_admin",
    ).length;
    const active = users.filter((u) => u.isActive).length;

    // New this month — based on current page only (server should give actual)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const newThisMonth = users.filter(
      (u) => new Date(u.createdAt) >= startOfMonth,
    ).length;

    return { total, customers, admins, active, newThisMonth };
  }, [users, meta.total]);

  // ─── Handlers ───────────────────────────────────────────────
  const openUserModal = (user: User) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  // ─── Table Columns ──────────────────────────────────────────
  const columns = [
    {
      key: "user",
      title: "User",
      render: (user: User) => (
        <div className="flex items-center gap-3 min-w-[220px]">
          <div
            className="w-10 h-10 rounded-full overflow-hidden relative flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "#C70A24" }}
          >
            {user.profileImage ? (
              <Image
                src={user.profileImage}
                alt={user.name || user.email}
                fill
                className="object-cover"
                sizes="40px"
              />
            ) : (
              <span className="text-white text-sm font-bold">
                {getInitials(user)}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 line-clamp-1">
              {user.name || "Unnamed"}
            </p>
            <p className="text-xs text-gray-500 line-clamp-1">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      title: "Phone",
      render: (user: User) => (
        <span className="text-sm text-gray-700">{user.phone || "—"}</span>
      ),
    },
    {
      key: "address",
      title: "Address",
      render: (user: User) => (
        <span className="text-sm text-gray-700 line-clamp-1">
          {user.address || "—"}
        </span>
      ),
    },
    {
      key: "role",
      title: "Role",
      render: (user: User) => <RoleBadge role={user.role} />,
    },
    {
      key: "status",
      title: "Status",
      render: (user: User) => <StatusBadge isActive={user.isActive} />,
    },
    {
      key: "createdAt",
      title: "Joined",
      render: (user: User) => (
        <span className="text-sm text-gray-700 whitespace-nowrap">
          {formatDate(user.createdAt)}
        </span>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      align: "right" as const,
      render: (user: User) => (
        <div className="flex justify-end">
          <button
            onClick={() => openUserModal(user)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-blue-600 border border-blue-200 hover:bg-blue-50 transition-colors cursor-pointer"
          >
            <Eye size={14} />
            View
          </button>
        </div>
      ),
    },
  ];

  // ─── Render ─────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Customer Management
        </h1>
        <p className="text-gray-600">
          View and manage all users in your database
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Users"
          value={kpis.total}
          icon={Users}
          color="#10b981"
        />
        <KPICard
          title="Customers"
          value={kpis.customers}
          icon={UserIcon}
          color="#3b82f6"
        />
        <KPICard
          title="Admins"
          value={kpis.admins}
          icon={Shield}
          color="#a855f7"
        />
        <KPICard
          title="New This Month"
          value={kpis.newThisMonth}
          icon={UserPlus}
          color="#f59e0b"
        />
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-300 transition-all bg-gray-50"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
        <RmTable
          columns={columns}
          data={users}
          loading={isLoading}
          emptyText={
            searchQuery
              ? "No users match your search"
              : "No users found in the system"
          }
        />
      </div>

      {/* Pagination */}
      {meta.totalPage > 1 && (
        <RmPagination
          currentPage={currentPage}
          totalPages={meta.totalPage}
          onPageChange={setCurrentPage}
          showFirstLast
        />
      )}

      {/* Details Modal */}
      <UserDetailsModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />
    </div>
  );
}
