"use client";

import { useState, useMemo } from "react";
import { Eye, Download } from "lucide-react";
import RmTable from "@/components/ui/RmTable";
import RmModal from "@/components/ui/RmModal";
import RmPagination from "@/components/ui/RmPagination";

type Order = {
  orderId: string;
  customer: string;
  email: string;
  phone: string;
  address: string;
  product: string;
  items: number;
  amount: string;
  status: "completed" | "processing" | "pending" | "cancelled";
  date: string;
};

// Status Badge Component
const StatusBadge = ({
  status,
}: {
  status: "completed" | "processing" | "pending" | "cancelled";
}) => {
  const statusConfig = {
    completed: {
      bg: "bg-green-50",
      text: "text-green-700",
      label: "Completed",
    },
    processing: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      label: "Processing",
    },
    pending: { bg: "bg-yellow-50", text: "text-yellow-700", label: "Pending" },
    cancelled: { bg: "bg-red-50", text: "text-red-700", label: "Cancelled" },
  };

  const config = statusConfig[status];
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
};

// Order Details Modal Component using RmModal
const OrderDetailsModal = ({
  isOpen,
  onClose,
  order,
}: {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}) => {
  if (!order) return null;

  return (
    <RmModal
      isOpen={isOpen}
      onClose={onClose}
      title="Order Details"
      width="max-w-2xl"
      footer={
        <div className="flex gap-3">
          <button
            className="flex-1 py-3 rounded-lg text-white font-semibold transition-opacity hover:opacity-90 active:opacity-80 cursor-pointer"
            style={{ backgroundColor: "#C70A24" }}
          >
            Mark as Complete
          </button>
          <button className="flex-1 py-3 rounded-lg text-gray-900 font-semibold border border-gray-300 hover:bg-gray-100 transition-colors cursor-pointer">
            Cancel Order
          </button>
        </div>
      }
    >
      <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
        {/* Subtitle */}
        <p className="text-sm text-gray-500 -mt-2">{order.orderId}</p>

        {/* Customer Information */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">👤</span>
            <h3 className="text-lg font-semibold text-gray-900">
              Customer Information
            </h3>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold">
                {order.customer.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{order.customer}</p>
                <p className="text-sm text-gray-500">Customer</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>✉️</span>
              <span>{order.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>📱</span>
              <span>{order.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>📍</span>
              <span>{order.address}</span>
            </div>
          </div>
        </div>

        {/* Order Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>📦</span>
            Order Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Product</p>
              <p className="font-semibold text-gray-900">{order.product}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Quantity</p>
              <p className="font-semibold text-gray-900">{order.items} Items</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Order Date</p>
              <p className="font-semibold text-gray-900">{order.date}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Total Amount</p>
              <p className="font-semibold text-green-600 text-lg">
                {order.amount}
              </p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Order Items
          </h3>
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="text-left py-3 font-semibold text-gray-900">
                  Item
                </th>
                <th className="text-left py-3 font-semibold text-gray-900">
                  Qty
                </th>
                <th className="text-left py-3 font-semibold text-gray-900">
                  Price
                </th>
                <th className="text-left py-3 font-semibold text-gray-900">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-3 font-medium text-gray-900">
                    Premium Package
                  </td>
                  <td className="py-3 text-gray-600">1</td>
                  <td className="py-3 text-gray-600">$299.00</td>
                  <td className="py-3 font-semibold text-gray-900">$299.00</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </RmModal>
  );
};

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const allOrders: Order[] = [
    {
      orderId: "#ORD-1001",
      customer: "John Doe",
      email: "john@email.com",
      phone: "+1 (650) 543-4567",
      address: "123 Main Street, New York, NY 10001",
      product: "Premium Package",
      items: 3,
      amount: "$299.00",
      status: "completed",
      date: "2026-05-09",
    },
    {
      orderId: "#ORD-1002",
      customer: "Sarah Smith",
      email: "sarah@email.com",
      phone: "+1 (650) 543-4567",
      address: "123 Main Street, New York, NY 10001",
      product: "Standard Plan",
      items: 1,
      amount: "$149.00",
      status: "processing",
      date: "2026-05-09",
    },
    {
      orderId: "#ORD-1003",
      customer: "Mike Johnson",
      email: "mike@email.com",
      phone: "+1 (650) 543-4567",
      address: "123 Main Street, New York, NY 10001",
      product: "Enterprise Suite",
      items: 5,
      amount: "$599.00",
      status: "completed",
      date: "2026-05-08",
    },
    {
      orderId: "#ORD-1004",
      customer: "Emily Brown",
      email: "emily@email.com",
      phone: "+1 (650) 543-4567",
      address: "123 Main Street, New York, NY 10001",
      product: "Basic Package",
      items: 2,
      amount: "$99.00",
      status: "pending",
      date: "2026-05-08",
    },
    {
      orderId: "#ORD-1005",
      customer: "David Wilson",
      email: "david@email.com",
      phone: "+1 (650) 543-4567",
      address: "123 Main Street, New York, NY 10001",
      product: "Premium Package",
      items: 3,
      amount: "$299.00",
      status: "completed",
      date: "2026-05-07",
    },
    {
      orderId: "#ORD-1006",
      customer: "Lisa Anderson",
      email: "lisa@email.com",
      phone: "+1 (650) 543-4567",
      address: "123 Main Street, New York, NY 10001",
      product: "Standard Plan",
      items: 1,
      amount: "$149.00",
      status: "cancelled",
      date: "2026-05-07",
    },
    {
      orderId: "#ORD-1007",
      customer: "Tom Martinez",
      email: "tom@email.com",
      phone: "+1 (650) 543-4567",
      address: "123 Main Street, New York, NY 10001",
      product: "Enterprise Suite",
      items: 4,
      amount: "$599.00",
      status: "processing",
      date: "2026-05-06",
    },
    {
      orderId: "#ORD-1008",
      customer: "Rachel Green",
      email: "rachel@email.com",
      phone: "+1 (650) 543-4567",
      address: "123 Main Street, New York, NY 10001",
      product: "Premium Package",
      items: 3,
      amount: "$299.00",
      status: "completed",
      date: "2026-05-06",
    },
  ];

  // Filter orders based on tab and search
  const filteredOrders = useMemo(() => {
    return allOrders.filter((order) => {
      const matchesTab =
        activeTab === "all" ||
        (activeTab === "completed" && order.status === "completed") ||
        (activeTab === "processing" && order.status === "processing") ||
        (activeTab === "pending" && order.status === "pending") ||
        (activeTab === "cancelled" && order.status === "cancelled");

      const matchesSearch =
        searchQuery === "" ||
        order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesTab && matchesSearch;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, searchQuery]);

  // Reset to first page when filters change
  useMemo(() => {
    // eslint-disable-next-line react-hooks/set-state-in-render
    setCurrentPage(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const openOrderModal = (order: Order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  // RmTable columns definition
  const columns = [
    {
      key: "orderId",
      title: "Order ID",
      width: "120px",
    },
    {
      key: "customer",
      title: "Customer",
      render: (record: Order) => (
        <div>
          <p className="font-medium text-gray-900">{record.customer}</p>
          <p className="text-xs text-gray-500">{record.email}</p>
        </div>
      ),
    },
    {
      key: "product",
      title: "Product",
    },
    {
      key: "items",
      title: "Items",
      width: "80px",
      align: "center" as const,
    },
    {
      key: "amount",
      title: "Amount",
      width: "100px",
    },
    {
      key: "status",
      title: "Status",
      render: (record: Order) => <StatusBadge status={record.status} />,
      width: "120px",
    },
    {
      key: "date",
      title: "Date",
      width: "120px",
    },
    {
      key: "actions",
      title: "Actions",
      width: "80px",
      render: (record: Order) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            openOrderModal(record);
          }}
          className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer p-1 hover:bg-gray-100 rounded"
        >
          <Eye size={18} />
        </button>
      ),
    },
  ];

  // Tab counts
  const tabCounts = {
    all: allOrders.length,
    completed: allOrders.filter((o) => o.status === "completed").length,
    processing: allOrders.filter((o) => o.status === "processing").length,
    pending: allOrders.filter((o) => o.status === "pending").length,
    cancelled: allOrders.filter((o) => o.status === "cancelled").length,
  };

  const tabs = [
    { id: "all", label: "All Orders", badge: tabCounts.all.toString() },
    {
      id: "completed",
      label: "Completed",
      badge: tabCounts.completed.toString(),
    },
    {
      id: "processing",
      label: "Processing",
      badge: tabCounts.processing.toString(),
    },
    { id: "pending", label: "Pending", badge: tabCounts.pending.toString() },
    {
      id: "cancelled",
      label: "Cancelled",
      badge: tabCounts.cancelled.toString(),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Orders Management
        </h1>
        <p className="text-gray-600">
          Manage and track all your business orders
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-3 border-b border-gray-200 pb-0 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <span>{tab.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  activeTab === tab.id
                    ? "bg-gray-900 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {tab.badge}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Search & Export */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search orders by ID or customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-300 transition-all bg-gray-50 cursor-text"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
          <Download size={16} />
          Export
        </button>
      </div>

      {/* RmTable */}
      <div className="bg-white rounded-lg border border-gray-200">
        <RmTable
          columns={columns}
          data={paginatedOrders}
          striped
          hover
          bordered={false}
          rowClassName="cursor-pointer"
          onRowClick={openOrderModal}
          emptyText="No orders found"
        />
      </div>

      {/* Pagination */}
      {filteredOrders.length > itemsPerPage && (
        <RmPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          showFirstLast
        />
      )}

      {/* Order Details Modal */}
      <OrderDetailsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
}
