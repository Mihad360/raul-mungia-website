"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Users,
  UserPlus,
  Calendar,
  DollarSign,
  Activity,
  Mail,
  Phone,
  MapPin,
  Package,
  ShoppingBag,
  X,
} from "lucide-react";
import RmPagination from "@/components/ui/RmPagination";
import RmModal from "@/components/ui/RmModal";

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
  orders: number;
  totalSpent: number;
  joinedDate: string;
  status: "active" | "inactive";
  lastOrder?: string;
};

// Status Badge Component
const StatusBadge = ({ status }: { status: "active" | "inactive" }) => {
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-semibold ${
        status === "active"
          ? "bg-green-50 text-green-700"
          : "bg-gray-50 text-gray-700"
      }`}
    >
      {status === "active" ? "Active" : "Inactive"}
    </span>
  );
};

// Customer Card Component
const CustomerCard = ({
  customer,
  onClick,
}: {
  customer: Customer;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg border border-gray-100 p-6 hover:shadow-md transition-all cursor-pointer hover:border-gray-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-lg">
            {customer.avatar}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">
              {customer.name}
            </h3>
            <p className="text-sm text-gray-500">{customer.email}</p>
          </div>
        </div>
        <StatusBadge status={customer.status} />
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Phone size={14} className="text-gray-400" />
          <span>{customer.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin size={14} className="text-gray-400" />
          <span>{customer.address}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
        <div>
          <p className="text-xs text-gray-500 mb-1">Orders</p>
          <p className="text-xl font-bold text-gray-900">{customer.orders}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Total Spent</p>
          <p className="text-xl font-bold text-green-600">
            ${customer.totalSpent.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Joined</p>
          <p className="text-sm font-semibold text-gray-900">
            {customer.joinedDate}
          </p>
        </div>
      </div>
    </div>
  );
};

// Customer Details Modal
const CustomerDetailsModal = ({
  isOpen,
  onClose,
  customer,
}: {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
}) => {
  if (!customer) return null;

  const recentOrders = [
    { id: "#ORD-1001", date: "2026-05-09", amount: 299, status: "completed" },
    { id: "#ORD-1002", date: "2026-05-01", amount: 149, status: "completed" },
    { id: "#ORD-1003", date: "2026-04-25", amount: 599, status: "processing" },
  ];

  return (
    <RmModal
      isOpen={isOpen}
      onClose={onClose}
      title="Customer Details"
      width="max-w-3xl"
      footer={
        <div className="flex gap-3">
          <button className="flex-1 py-2.5 rounded-lg text-gray-700 font-semibold border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer">
            Send Message
          </button>
          <button
            className="flex-1 py-2.5 rounded-lg text-white font-semibold transition-opacity hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: "#C70A24" }}
          >
            View All Orders
          </button>
        </div>
      }
    >
      <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
        {/* Profile Header */}
        <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
          <div className="w-20 h-20 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-2xl">
            {customer.avatar}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold text-gray-900">
                {customer.name}
              </h2>
              <StatusBadge status={customer.status} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail size={14} />
                <span>{customer.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone size={14} />
                <span>{customer.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={14} />
                <span>{customer.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingBag size={16} className="text-gray-500" />
              <p className="text-xs text-gray-500">Total Orders</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {customer.orders}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={16} className="text-gray-500" />
              <p className="text-xs text-gray-500">Total Spent</p>
            </div>
            <p className="text-2xl font-bold text-green-600">
              ${customer.totalSpent.toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={16} className="text-gray-500" />
              <p className="text-xs text-gray-500">Member Since</p>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {customer.joinedDate}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity size={16} className="text-gray-500" />
              <p className="text-xs text-gray-500">Last Order</p>
            </div>
            <p className="text-sm font-semibold text-gray-900">
              {customer.lastOrder || "N/A"}
            </p>
          </div>
        </div>

        {/* Recent Orders */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Package size={18} />
            Recent Orders
          </h3>
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="text-left py-3 font-semibold text-gray-900">
                  Order ID
                </th>
                <th className="text-left py-3 font-semibold text-gray-900">
                  Date
                </th>
                <th className="text-left py-3 font-semibold text-gray-900">
                  Amount
                </th>
                <th className="text-left py-3 font-semibold text-gray-900">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100">
                  <td className="py-3 font-medium text-gray-900">{order.id}</td>
                  <td className="py-3 text-gray-600">{order.date}</td>
                  <td className="py-3 font-semibold text-gray-900">
                    ${order.amount}
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700">
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </RmModal>
  );
};

// KPI Card Component
const KPICard = ({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  icon: any;
  color: string;
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center text-white`}
          style={{ backgroundColor: color }}
        >
          <Icon size={24} />
        </div>
      </div>
      <p className="text-sm text-gray-600 font-medium mb-2">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const allCustomers: Customer[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john@email.com",
      phone: "+1 (234) 567-8901",
      address: "New York, USA",
      avatar: "JD",
      orders: 12,
      totalSpent: 3588,
      joinedDate: "2025-01-15",
      status: "active",
      lastOrder: "2026-05-09",
    },
    {
      id: "2",
      name: "Sarah Smith",
      email: "sarah@email.com",
      phone: "+1 (234) 567-8902",
      address: "Los Angeles, USA",
      avatar: "SS",
      orders: 8,
      totalSpent: 1192,
      joinedDate: "2025-02-20",
      status: "active",
      lastOrder: "2026-05-05",
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike@email.com",
      phone: "+1 (234) 567-8903",
      address: "Chicago, USA",
      avatar: "MJ",
      orders: 15,
      totalSpent: 8985,
      joinedDate: "2024-11-10",
      status: "active",
      lastOrder: "2026-05-08",
    },
    {
      id: "4",
      name: "Emily Brown",
      email: "emily@email.com",
      phone: "+1 (234) 567-8904",
      address: "Houston, USA",
      avatar: "EB",
      orders: 5,
      totalSpent: 495,
      joinedDate: "2025-03-05",
      status: "inactive",
      lastOrder: "2026-04-15",
    },
    {
      id: "5",
      name: "David Wilson",
      email: "david@email.com",
      phone: "+1 (234) 567-8905",
      address: "Phoenix, USA",
      avatar: "DW",
      orders: 20,
      totalSpent: 5980,
      joinedDate: "2024-09-12",
      status: "active",
      lastOrder: "2026-05-10",
    },
    {
      id: "6",
      name: "Lisa Anderson",
      email: "lisa@email.com",
      phone: "+1 (234) 567-8906",
      address: "Miami, USA",
      avatar: "LA",
      orders: 3,
      totalSpent: 447,
      joinedDate: "2025-04-01",
      status: "inactive",
      lastOrder: "2026-04-20",
    },
    {
      id: "7",
      name: "Robert Taylor",
      email: "robert@email.com",
      phone: "+1 (234) 567-8907",
      address: "Seattle, USA",
      avatar: "RT",
      orders: 25,
      totalSpent: 12450,
      joinedDate: "2024-08-15",
      status: "active",
      lastOrder: "2026-05-07",
    },
    {
      id: "8",
      name: "Jennifer Lee",
      email: "jennifer@email.com",
      phone: "+1 (234) 567-8908",
      address: "Boston, USA",
      avatar: "JL",
      orders: 10,
      totalSpent: 3250,
      joinedDate: "2025-01-20",
      status: "active",
      lastOrder: "2026-05-06",
    },
  ];

  // Filter customers based on search
  const filteredCustomers = useMemo(() => {
    return allCustomers.filter((customer) => {
      const matchesSearch =
        searchQuery === "" ||
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.includes(searchQuery);
      return matchesSearch;
    });
  }, [searchQuery]);

  // Reset to first page when search changes
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const openCustomerModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setModalOpen(true);
  };

  // KPI Data
  const kpis = {
    totalCustomers: allCustomers.length,
    activeCustomers: allCustomers.filter((c) => c.status === "active").length,
    newToday: 12,
    newThisMonth: 45,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Customer Management
        </h1>
        <p className="text-gray-600">View and manage your customer database</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Customers"
          value={kpis.totalCustomers.toString()}
          icon={Users}
          color="#10b981"
        />
        <KPICard
          title="Active Customers"
          value={kpis.activeCustomers.toString()}
          icon={Activity}
          color="#3b82f6"
        />
        <KPICard
          title="New Today"
          value={kpis.newToday.toString()}
          icon={UserPlus}
          color="#a855f7"
        />
        <KPICard
          title="New This Month"
          value={kpis.newThisMonth.toString()}
          icon={Calendar}
          color="#f59e0b"
        />
      </div>

      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search customers by name, email or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-300 transition-all bg-gray-50 cursor-text"
          />
        </div>
      </div>

      {/* Customers Grid */}
      {paginatedCustomers.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No customers found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedCustomers.map((customer) => (
              <CustomerCard
                key={customer.id}
                customer={customer}
                onClick={() => openCustomerModal(customer)}
              />
            ))}
          </div>

          {/* Pagination */}
          {filteredCustomers.length > itemsPerPage && (
            <RmPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              showFirstLast
            />
          )}
        </>
      )}

      {/* Customer Details Modal */}
      <CustomerDetailsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        customer={selectedCustomer}
      />
    </div>
  );
}
