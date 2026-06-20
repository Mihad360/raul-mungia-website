/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Eye,
  CheckCircle2,
  XCircle,
  Truck,
  RotateCcw,
  FileText,
  RefreshCw,
  Package,
  MapPin,
  CreditCard,
  User,
  Mail,
  Phone,
  Calendar,
  ExternalLink,
  AlertCircle,
  Search,
  Loader2,
} from "lucide-react";
import { message, Modal } from "antd";
import RmTable from "@/components/ui/RmTable";
import RmModal from "@/components/ui/RmModal";
import RmPagination from "@/components/ui/RmPagination";
import RmInput from "@/components/ui/RmInput";
import {
  useGetAllOrdersAdminQuery,
  useConfirmManualPaymentMutation,
  useCancelOrderByAdminMutation,
  useProcessRefundMutation,
  useMarkOrderAsShippedMutation,
  useGenerateShippingLabelMutation,
  useRefreshTrackingInfoMutation,
  useMarkOrderAsDeliveredMutation,
  useUpdateOrderAdminNoteMutation,
} from "@/redux/api/adminApiV2";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
  formatDate,
  formatDateShort,
  OrderStatus,
} from "@/utils/orderHelpers";

// ═══════════════ TYPES ═══════════════
type OrderUser = {
  _id: string;
  email: string;
  name: string;
  phone: string | null;
};

type OrderItem = {
  product: string;
  productName: string;
  productCode: string;
  mainImage: string;
  size: string;
  quantity: number;
  priceAtPurchase: number;
  weight: number;
  lineTotal: number;
};

type AdminOrder = {
  _id: string;
  orderNumber: string;
  user: OrderUser;
  items: OrderItem[];
  totalQuantity: number;
  subtotal: number;
  appliedCoupon?: {
    code: string;
    discountPercent: number;
    discountAmount: number;
  };
  couponDiscountAmount: number;
  appliedDiscount?: { discountPercent: number; discountAmount: number };
  bulkDiscountAmount: number;
  shippingCost: number;
  actualShippingCost?: number;
  freeShippingApplied?: boolean;
  freeShippingSavings?: number;
  total: number;
  shippingAddress: {
    fullName: string;
    email: string;
    phone: string | null;
    street: string;
    apartment: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: {
    paymentMethodId: string;
    type: string;
    displayName: string;
    isAutomated: boolean;
    handle?: string;
  };
  paymentStatus: string;
  latestTransactionId: string | null;
  shippingMethod: string;
  trackingNumber: string;
  shippingLabelUrl: string;
  status: OrderStatus;
  cancellationReason: string;
  customerNote: string;
  adminNote: string;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
};

const STATUS_TABS: { value: string; label: string }[] = [
  { value: "", label: "All" },
  { value: "awaiting_payment", label: "Awaiting Payment" },
  { value: "paid", label: "Paid" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

// ═══════════════════════════════════════════════════════════════════════
//  MAIN ORDERS PAGE
// ═══════════════════════════════════════════════════════════════════════
export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const { data: ordersResponse, isLoading } = useGetAllOrdersAdminQuery({
    page: currentPage,
    limit: 10,
    status: statusFilter || undefined,
    searchTerm: searchQuery || undefined,
  });

  const orders: AdminOrder[] = ordersResponse?.data || [];
  const meta = ordersResponse?.meta || {
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 1,
  };

  const openDetails = (order: AdminOrder) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  // ─── Table columns ────────────────────────────────────────
  const columns = [
    {
      key: "orderNumber",
      title: "Order",
      render: (record: AdminOrder) => (
        <div>
          <p className="font-mono font-semibold text-gray-900 text-sm">
            {record.orderNumber}
          </p>
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
            <Calendar size={10} />
            {formatDateShort(record.createdAt)}
          </p>
        </div>
      ),
    },
    {
      key: "customer",
      title: "Customer",
      render: (record: AdminOrder) => (
        <div className="min-w-0">
          <p className="font-medium text-gray-900 text-sm truncate">
            {record.user?.name || record.shippingAddress?.fullName || "—"}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {record.user?.email || record.shippingAddress?.email}
          </p>
        </div>
      ),
    },
    {
      key: "items",
      title: "Items",
      width: "150px",
      align: "center" as const,
      render: (record: AdminOrder) => {
        const items = record.items || [];
        const visibleCount = Math.min(items.length, 3);
        const remaining = items.length - visibleCount;

        return (
          <div className="flex flex-col items-center gap-1.5">
            {/* Stacked thumbnails */}
            <div className="flex items-center -space-x-2.5">
              {items.slice(0, visibleCount).map((item, idx) => (
                <div
                  key={idx}
                  className="relative w-9 h-9 bg-white rounded-full border-2 border-white shadow-sm overflow-hidden ring-1 ring-gray-100 hover:z-10 hover:scale-110 transition-transform"
                  style={{ zIndex: visibleCount - idx }}
                  title={`${item.productName} (${item.size}) × ${item.quantity}`}
                >
                  {item.mainImage ? (
                    <Image
                      src={item.mainImage}
                      alt={item.productName}
                      fill
                      className="object-contain p-0.5"
                      sizes="36px"
                    />
                  ) : (
                    <Package
                      size={14}
                      className="text-gray-300 absolute inset-0 m-auto"
                    />
                  )}
                </div>
              ))}
              {remaining > 0 && (
                <div
                  className="relative w-9 h-9 rounded-full border-2 border-white bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-sm"
                  title={`${remaining} more product${remaining > 1 ? "s" : ""}`}
                >
                  <span className="text-[10px] font-bold text-gray-700">
                    +{remaining}
                  </span>
                </div>
              )}
            </div>

            {/* Count details */}
            <div className="flex items-center gap-1 text-[10px] leading-none">
              <span className="font-bold text-gray-900">
                {record.totalQuantity}
              </span>
              <span className="text-gray-500">
                {record.totalQuantity === 1 ? "quantity" : "quantities"}
              </span>
              {items.length > 1 && (
                <>
                  <span className="text-gray-300 mx-0.5">·</span>
                  <span className="font-bold text-gray-900">
                    {items.length}
                  </span>
                  <span className="text-gray-500">
                    product{items.length > 1 ? "s" : ""}
                  </span>
                </>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: "total",
      title: "Total",
      width: "100px",
      render: (record: AdminOrder) => (
        <p className="font-bold text-gray-900">${record.total?.toFixed(2)}</p>
      ),
    },
    {
      key: "payment",
      title: "Payment",
      render: (record: AdminOrder) => (
        <div className="space-y-1">
          <p className="text-xs text-gray-700">
            {record.paymentMethod?.displayName}
          </p>
          <PaymentStatusBadge status={record.paymentStatus as any} />
        </div>
      ),
    },
    {
      key: "status",
      title: "Status",
      render: (record: AdminOrder) => (
        <OrderStatusBadge status={record.status} size="sm" />
      ),
    },
    {
      key: "actions",
      title: "Actions",
      width: "80px",
      render: (record: AdminOrder) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            openDetails(record);
          }}
          className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer p-1.5 hover:bg-gray-100 rounded"
          title="View details"
        >
          <Eye size={16} />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Orders Management
            </h1>
            <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
              Total: {meta.total ?? 0}
            </span>
          </div>
          <p className="text-gray-600">
            Manage payments, shipping, refunds, and order lifecycle
          </p>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 border-b border-gray-200 overflow-x-auto pb-0">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value || "all"}
            onClick={() => {
              setStatusFilter(tab.value);
              setCurrentPage(1);
            }}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              statusFilter === tab.value
                ? "text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
            style={
              statusFilter === tab.value
                ? { borderColor: "#C70A24" }
                : undefined
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          type="text"
          placeholder="Search by order number or tracking number..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-300 transition-all bg-gray-50"
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="bg-white rounded-lg border border-gray-100 py-20 flex justify-center">
          <Loader2 size={32} className="animate-spin text-gray-400" />
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <RmTable
              columns={columns}
              data={orders}
              striped
              hover
              bordered={false}
              rowClassName="cursor-pointer"
              onRowClick={openDetails}
              emptyText="No orders found"
            />
          </div>

          {meta.totalPage > 1 && (
            <RmPagination
              currentPage={currentPage}
              totalPages={meta.totalPage}
              onPageChange={setCurrentPage}
              showFirstLast
            />
          )}
        </>
      )}

      {/* Details Modal */}
      <OrderDetailsModal
        isOpen={detailsOpen}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
//  ORDER DETAILS MODAL — with all admin actions
// ═══════════════════════════════════════════════════════════════════════
const OrderDetailsModal = ({
  isOpen,
  onClose,
  order,
}: {
  isOpen: boolean;
  onClose: () => void;
  order: AdminOrder | null;
}) => {
  // Sub-modals
  const [cancelOpen, setCancelOpen] = useState(false);
  const [refundOpen, setRefundOpen] = useState(false);
  const [shipOpen, setShipOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);

  // Mutations
  const [confirmPayment, { isLoading: confirming }] =
    useConfirmManualPaymentMutation();
  const [generateLabel, { isLoading: generatingLabel }] =
    useGenerateShippingLabelMutation();
  const [refreshTracking, { isLoading: refreshing }] =
    useRefreshTrackingInfoMutation();
  const [markDelivered, { isLoading: delivering }] =
    useMarkOrderAsDeliveredMutation();

  if (!order) return null;

  const canConfirmPayment =
    order.paymentStatus === "awaiting_confirmation" ||
    (order.paymentStatus === "unpaid" && !order.paymentMethod?.isAutomated);

  const canShip =
    ["paid", "processing"].includes(order.status) && !order.trackingNumber;

  const canRefreshTracking =
    !!order.trackingNumber && order.status === "shipped";

  const canMarkDelivered = order.status === "shipped";

  const canCancel = !["delivered", "cancelled", "refunded"].includes(
    order.status,
  );

  const canRefund =
    order.paymentStatus === "paid" &&
    !["refunded", "cancelled"].includes(order.status);

  // ─── Handlers ─────────────────────────────────────────────
  const handleConfirmPayment = () => {
    Modal.confirm({
      title: "Confirm Payment Received?",
      content: `Mark order ${order.orderNumber} as paid? This will transition it to "paid" status and prepare for shipping.`,
      okText: "Yes, Confirm",
      cancelText: "Cancel",
      okButtonProps: { style: { backgroundColor: "#C70A24" } },
      onOk: async () => {
        try {
          await confirmPayment({ id: order._id, body: {} }).unwrap();
          message.success("Payment confirmed!");
        } catch (err: any) {
          message.error(err?.data?.message || "Failed to confirm payment");
        }
      },
    });
  };

  const handleGenerateLabel = () => {
    Modal.confirm({
      title: "Generate FedEx Shipping Label?",
      content: `This will create a real shipping label via FedEx and mark the order as shipped. Are you sure?`,
      okText: "Generate",
      cancelText: "Cancel",
      okButtonProps: { style: { backgroundColor: "#C70A24" } },
      onOk: async () => {
        try {
          await generateLabel(order._id).unwrap();
          message.success("Shipping label generated!");
        } catch (err: any) {
          message.error(err?.data?.message || "Failed to generate label");
        }
      },
    });
  };

  const handleRefreshTracking = async () => {
    try {
      await refreshTracking(order._id).unwrap();
      message.success("Tracking refreshed!");
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to refresh tracking");
    }
  };

  const handleMarkDelivered = () => {
    Modal.confirm({
      title: "Mark as Delivered?",
      content: `Mark order ${order.orderNumber} as delivered. This is final.`,
      okText: "Mark Delivered",
      cancelText: "Cancel",
      okButtonProps: { style: { backgroundColor: "#10b981" } },
      onOk: async () => {
        try {
          await markDelivered(order._id).unwrap();
          message.success("Order marked as delivered!");
        } catch (err: any) {
          message.error(err?.data?.message || "Failed to mark as delivered");
        }
      },
    });
  };

  return (
    <>
      <RmModal
        isOpen={isOpen}
        onClose={onClose}
        title={`Order ${order.orderNumber}`}
        width="max-w-4xl"
        footer={
          <div className="flex flex-wrap gap-2">
            {/* Status-dependent action buttons */}
            {canConfirmPayment && (
              <ActionBtn
                onClick={handleConfirmPayment}
                disabled={confirming}
                color="green"
                icon={CheckCircle2}
                label={confirming ? "Confirming..." : "Confirm Payment"}
              />
            )}

            {canShip && (
              <>
                <ActionBtn
                  onClick={handleGenerateLabel}
                  disabled={generatingLabel}
                  color="primary"
                  icon={FileText}
                  label={
                    generatingLabel ? "Generating..." : "Generate FedEx Label"
                  }
                />
                <ActionBtn
                  onClick={() => setShipOpen(true)}
                  color="purple"
                  icon={Truck}
                  label="Mark Shipped (Manual)"
                />
              </>
            )}

            {canRefreshTracking && (
              <ActionBtn
                onClick={handleRefreshTracking}
                disabled={refreshing}
                color="blue"
                icon={RefreshCw}
                label={refreshing ? "Refreshing..." : "Refresh Tracking"}
              />
            )}

            {canMarkDelivered && (
              <ActionBtn
                onClick={handleMarkDelivered}
                disabled={delivering}
                color="green"
                icon={CheckCircle2}
                label={delivering ? "Updating..." : "Mark Delivered"}
              />
            )}

            {canRefund && (
              <ActionBtn
                onClick={() => setRefundOpen(true)}
                color="orange"
                icon={RotateCcw}
                label="Process Refund"
              />
            )}

            {canCancel && (
              <ActionBtn
                onClick={() => setCancelOpen(true)}
                color="red"
                icon={XCircle}
                label="Cancel Order"
              />
            )}

            <ActionBtn
              onClick={() => setNoteOpen(true)}
              color="gray"
              icon={FileText}
              label={order.adminNote ? "Update Note" : "Add Note"}
            />
          </div>
        }
      >
        <div className="space-y-5 max-h-[65vh] overflow-y-auto pr-2">
          {/* Status banner */}
          <div className="flex items-center gap-2 flex-wrap">
            <OrderStatusBadge status={order.status} />
            <PaymentStatusBadge status={order.paymentStatus as any} />
            <span className="text-xs text-gray-500 ml-auto">
              Created {formatDate(order.createdAt)}
            </span>
          </div>

          {/* Cancellation reason banner */}
          {order.status === "cancelled" && order.cancellationReason && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-xs font-semibold text-red-800 mb-0.5">
                Cancellation Reason
              </p>
              <p className="text-sm text-red-700">{order.cancellationReason}</p>
            </div>
          )}

          {/* Customer info */}
          <Section title="Customer" icon={<User size={16} />}>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-gray-500 mb-1">Name</p>
                <p className="font-medium text-gray-900">{order.user?.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <Mail size={10} /> Email
                </p>
                <p className="font-medium text-gray-900 truncate">
                  {order.user?.email}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <Phone size={10} /> Phone
                </p>
                <p className="font-medium text-gray-900">
                  {order.user?.phone || order.shippingAddress?.phone || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">User ID</p>
                <p className="font-mono text-[10px] text-gray-700 truncate">
                  {order.user?._id}
                </p>
              </div>
            </div>
          </Section>

          {/* Items */}
          <Section
            title={`Items (${order.items?.length || 0})`}
            icon={<Package size={16} />}
          >
            <div className="space-y-3">
              {order.items?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0"
                >
                  <div className="relative w-14 h-14 bg-gray-50 rounded overflow-hidden flex-shrink-0">
                    {item.mainImage ? (
                      <Image
                        src={item.mainImage}
                        alt={item.productName}
                        fill
                        className="object-contain p-1"
                        sizes="56px"
                      />
                    ) : (
                      <Package
                        size={20}
                        className="text-gray-300 absolute inset-0 m-auto"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">
                      {item.productName}
                    </p>
                    <p className="text-[11px] text-gray-500 font-mono">
                      {item.productCode}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.size} · Qty {item.quantity} · $
                      {item.priceAtPurchase?.toFixed(2)} each
                    </p>
                  </div>
                  <p className="font-bold text-gray-900">
                    ${item.lineTotal?.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </Section>

          {/* Pricing breakdown */}
          <Section title="Pricing">
            <div className="space-y-1.5 text-sm">
              <Row label="Subtotal" value={`$${order.subtotal?.toFixed(2)}`} />
              {order.bulkDiscountAmount > 0 && (
                <Row
                  label={`Bulk discount (${order.appliedDiscount?.discountPercent}%)`}
                  value={`−$${order.bulkDiscountAmount.toFixed(2)}`}
                  green
                />
              )}
              {order.couponDiscountAmount > 0 && (
                <Row
                  label={`Coupon (${order.appliedCoupon?.code})`}
                  value={`−$${order.couponDiscountAmount.toFixed(2)}`}
                  green
                />
              )}
              <Row
                label="Shipping (charged)"
                value={`$${order.shippingCost?.toFixed(2)}`}
              />
              {order.actualShippingCost &&
                order.actualShippingCost !== order.shippingCost && (
                  <Row
                    label="Actual FedEx cost"
                    value={`$${order.actualShippingCost.toFixed(2)}`}
                    muted
                  />
                )}
              {order.freeShippingApplied && order.freeShippingSavings ? (
                <Row
                  label="Free shipping savings"
                  value={`−$${order.freeShippingSavings.toFixed(2)}`}
                  green
                />
              ) : null}
              <div className="flex justify-between font-bold text-base pt-2 mt-2 border-t border-gray-100 text-gray-900">
                <span>Total Paid</span>
                <span style={{ color: "#C70A24" }}>
                  ${order.total?.toFixed(2)}
                </span>
              </div>
            </div>
          </Section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Shipping address */}
            <Section title="Shipping Address" icon={<MapPin size={16} />}>
              <div className="text-sm text-gray-700 space-y-0.5">
                <p className="font-semibold text-gray-900">
                  {order.shippingAddress?.fullName}
                </p>
                <p>{order.shippingAddress?.street}</p>
                {order.shippingAddress?.apartment && (
                  <p>{order.shippingAddress.apartment}</p>
                )}
                <p>
                  {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
                  {order.shippingAddress?.postalCode}
                </p>
                <p>{order.shippingAddress?.country}</p>
                <p className="text-xs text-gray-500 pt-1">
                  {order.shippingAddress?.email}
                </p>
                {order.shippingAddress?.phone && (
                  <p className="text-xs text-gray-500">
                    {order.shippingAddress.phone}
                  </p>
                )}
              </div>
            </Section>

            {/* Payment Method */}
            <Section title="Payment Method" icon={<CreditCard size={16} />}>
              <div className="text-sm space-y-1">
                <p className="font-semibold text-gray-900">
                  {order.paymentMethod?.displayName}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {order.paymentMethod?.type} ·{" "}
                  {order.paymentMethod?.isAutomated ? "Automated" : "Manual"}
                </p>
                {order.paymentMethod?.handle && (
                  <p className="text-xs font-mono text-gray-700">
                    {order.paymentMethod.handle}
                  </p>
                )}
                {order.latestTransactionId && (
                  <p className="text-[10px] text-gray-500 font-mono pt-1">
                    Txn: {order.latestTransactionId}
                  </p>
                )}
              </div>
            </Section>
          </div>

          {/* Tracking */}
          {order.trackingNumber && (
            <Section title="Shipping & Tracking" icon={<Truck size={16} />}>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Tracking Number</p>
                    <p className="font-mono font-bold text-gray-900">
                      {order.trackingNumber}
                    </p>
                  </div>

                  <a
                    href={`https://www.fedex.com/fedextrack/?trknbr=${order.trackingNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold text-white"
                    style={{ backgroundColor: "#C70A24" }}
                  >
                    Track <ExternalLink size={11} />
                  </a>
                </div>
                <p className="text-xs text-gray-500">
                  Method: {order.shippingMethod}
                </p>
                {order.shippingLabelUrl && (
                  <a
                    href={order.shippingLabelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
                  >
                    Download Label <ExternalLink size={10} />
                  </a>
                )}
              </div>
            </Section>
          )}

          {/* Notes */}
          {(order.customerNote || order.adminNote) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {order.customerNote && (
                <Section title="Customer Note">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {order.customerNote}
                  </p>
                </Section>
              )}
              {order.adminNote && (
                <Section title="Admin Note">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {order.adminNote}
                  </p>
                </Section>
              )}
            </div>
          )}

          {/* Timestamps */}
          <Section title="Timeline">
            <div className="text-xs text-gray-600 space-y-1">
              <TimeRow label="Placed" date={order.createdAt} />
              <TimeRow label="Paid" date={order.paidAt} />
              <TimeRow label="Shipped" date={order.shippedAt} />
              <TimeRow label="Delivered" date={order.deliveredAt} />
            </div>
          </Section>
        </div>
      </RmModal>

      {/* Sub-modals */}
      <CancelOrderModal
        isOpen={cancelOpen}
        onClose={() => setCancelOpen(false)}
        order={order}
        onSuccess={() => {
          setCancelOpen(false);
          onClose();
        }}
      />
      <RefundOrderModal
        isOpen={refundOpen}
        onClose={() => setRefundOpen(false)}
        order={order}
        onSuccess={() => setRefundOpen(false)}
      />
      <ShipOrderModal
        isOpen={shipOpen}
        onClose={() => setShipOpen(false)}
        order={order}
        onSuccess={() => setShipOpen(false)}
      />
      <AdminNoteModal
        isOpen={noteOpen}
        onClose={() => setNoteOpen(false)}
        order={order}
        onSuccess={() => setNoteOpen(false)}
      />
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════
//  SUB-MODALS — Cancel / Refund / Ship / Note
// ═══════════════════════════════════════════════════════════════════════

const CancelOrderModal = ({
  isOpen,
  onClose,
  order,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  order: AdminOrder;
  onSuccess: () => void;
}) => {
  const [reason, setReason] = useState("");
  const [cancelOrder, { isLoading }] = useCancelOrderByAdminMutation();

  const handleSubmit = async () => {
    if (!reason.trim()) {
      message.error("Cancellation reason is required");
      return;
    }
    try {
      await cancelOrder({
        id: order._id,
        body: { cancellationReason: reason.trim() },
      }).unwrap();
      message.success("Order cancelled");
      setReason("");
      onSuccess();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to cancel");
    }
  };

  return (
    <RmModal
      isOpen={isOpen}
      onClose={onClose}
      title="Cancel Order"
      width="max-w-md"
      footer={
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-lg text-gray-700 font-semibold border border-gray-300 hover:bg-gray-50 cursor-pointer disabled:opacity-50"
          >
            Keep Order
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !reason.trim()}
            className="flex-1 py-2.5 rounded-lg text-white font-semibold bg-red-600 hover:bg-red-700 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? "Cancelling..." : "Confirm Cancel"}
          </button>
        </div>
      }
    >
      <div className="py-2">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 flex items-start gap-2">
          <AlertCircle
            size={14}
            className="text-yellow-700 mt-0.5 flex-shrink-0"
          />
          <p className="text-xs text-yellow-800">
            This will cancel order <strong>{order.orderNumber}</strong> and
            cannot be undone. If payment was made, you&apos;ll need to refund
            separately.
          </p>
        </div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cancellation reason <span className="text-red-500">*</span>
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Explain why this order is being cancelled..."
          rows={4}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-gray-300 bg-gray-50 resize-none"
        />
      </div>
    </RmModal>
  );
};

const RefundOrderModal = ({
  isOpen,
  onClose,
  order,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  order: AdminOrder;
  onSuccess: () => void;
}) => {
  const [amount, setAmount] = useState<string>("");
  const [reason, setReason] = useState("");
  const [refund, { isLoading }] = useProcessRefundMutation();

  const handleSubmit = async () => {
    if (!reason.trim()) {
      message.error("Refund reason is required");
      return;
    }
    const refundAmount = amount ? parseFloat(amount) : undefined;
    if (refundAmount !== undefined) {
      if (isNaN(refundAmount) || refundAmount <= 0) {
        message.error("Invalid refund amount");
        return;
      }
      if (refundAmount > order.total) {
        message.error("Refund amount cannot exceed order total");
        return;
      }
    }
    try {
      await refund({
        id: order._id,
        body: { amount: refundAmount, reason: reason.trim() },
      }).unwrap();
      message.success("Refund processed");
      setAmount("");
      setReason("");
      onSuccess();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to process refund");
    }
  };

  return (
    <RmModal
      isOpen={isOpen}
      onClose={onClose}
      title="Process Refund"
      width="max-w-md"
      footer={
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-lg text-gray-700 font-semibold border border-gray-300 hover:bg-gray-50 cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !reason.trim()}
            className="flex-1 py-2.5 rounded-lg text-white font-semibold transition-opacity hover:opacity-90 cursor-pointer disabled:opacity-50"
            style={{ backgroundColor: "#f97316" }}
          >
            {isLoading ? "Processing..." : "Process Refund"}
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-xs text-orange-800">
          Order total: <strong>${order.total?.toFixed(2)}</strong>
          <p className="mt-1 text-[11px]">
            Leave amount empty for full refund.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Refund Amount (USD)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={`Full refund: ${order.total?.toFixed(2)}`}
            step="0.01"
            min="0"
            max={order.total}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-gray-300 bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Reason <span className="text-red-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason for the refund..."
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-gray-300 bg-gray-50 resize-none"
          />
        </div>
      </div>
    </RmModal>
  );
};

const ShipOrderModal = ({
  isOpen,
  onClose,
  order,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  order: AdminOrder;
  onSuccess: () => void;
}) => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shippingLabelUrl, setShippingLabelUrl] = useState("");
  const [shippingMethod, setShippingMethod] = useState(
    order.shippingMethod || "FEDEX_GROUND",
  );
  const [ship, { isLoading }] = useMarkOrderAsShippedMutation();

  const handleSubmit = async () => {
    if (!trackingNumber.trim()) {
      message.error("Tracking number is required");
      return;
    }
    try {
      await ship({
        id: order._id,
        body: {
          trackingNumber: trackingNumber.trim(),
          shippingLabelUrl: shippingLabelUrl.trim() || undefined,
          shippingMethod,
        },
      }).unwrap();
      message.success("Order marked as shipped");
      onSuccess();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to mark as shipped");
    }
  };

  return (
    <RmModal
      isOpen={isOpen}
      onClose={onClose}
      title="Mark as Shipped (Manual)"
      width="max-w-md"
      footer={
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-lg text-gray-700 font-semibold border border-gray-300 hover:bg-gray-50 cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !trackingNumber.trim()}
            className="flex-1 py-2.5 rounded-lg text-white font-semibold transition-opacity hover:opacity-90 cursor-pointer disabled:opacity-50"
            style={{ backgroundColor: "#a855f7" }}
          >
            {isLoading ? "Marking..." : "Mark Shipped"}
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <p className="text-xs text-gray-600">
          Use this for orders shipped outside of FedEx auto-label flow (e.g.
          USPS, manual FedEx, alternate carrier).
        </p>

        <div>
          <label className="block text-[11px] font-medium text-gray-700 mb-1">
            Tracking Number{" "}
            <span className="text-gray-400">(leave empty if FedEx auto)</span>
          </label>
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="794828998836"
            className="w-full px-3 py-1.5 rounded border border-purple-200 text-sm outline-none focus:border-purple-400 bg-white font-mono"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Shipping Method
          </label>
          <select
            value={shippingMethod}
            onChange={(e) => setShippingMethod(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-gray-300 bg-gray-50 cursor-pointer"
          >
            <option value="FEDEX_GROUND">FedEx Ground</option>
            <option value="FEDEX_EXPRESS_SAVER">FedEx Express Saver</option>
            <option value="FEDEX_2_DAY">FedEx 2 Day</option>
            <option value="FEDEX_OVERNIGHT">FedEx Overnight</option>
            <option value="USPS">USPS</option>
            <option value="UPS">UPS</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Label URL{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={shippingLabelUrl}
            onChange={(e) => setShippingLabelUrl(e.target.value)}
            placeholder="https://..."
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-300 transition-all bg-white"
          />
        </div>
      </div>
    </RmModal>
  );
};

const AdminNoteModal = ({
  isOpen,
  onClose,
  order,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  order: AdminOrder;
  onSuccess: () => void;
}) => {
  const [note, setNote] = useState(order.adminNote || "");
  const [updateNote, { isLoading }] = useUpdateOrderAdminNoteMutation();

  const handleSubmit = async () => {
    try {
      await updateNote({
        id: order._id,
        body: { adminNote: note.trim() },
      }).unwrap();
      message.success("Note saved");
      onSuccess();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to save note");
    }
  };

  return (
    <RmModal
      isOpen={isOpen}
      onClose={onClose}
      title={order.adminNote ? "Update Admin Note" : "Add Admin Note"}
      width="max-w-md"
      footer={
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-lg text-gray-700 font-semibold border border-gray-300 hover:bg-gray-50 cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-lg text-white font-semibold transition-opacity hover:opacity-90 cursor-pointer disabled:opacity-50"
            style={{ backgroundColor: "#C70A24" }}
          >
            {isLoading ? "Saving..." : "Save Note"}
          </button>
        </div>
      }
    >
      <div className="py-2">
        <p className="text-xs text-gray-500 mb-3">
          Internal note only visible to admins.
        </p>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Internal notes about this order..."
          rows={5}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-gray-300 bg-gray-50 resize-none"
        />
      </div>
    </RmModal>
  );
};

// ═══════════════════════════════════════════════════════════════════════
//  HELPER COMPONENTS
// ═══════════════════════════════════════════════════════════════════════

const Section = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="bg-gray-50 rounded-lg p-4">
    <div className="flex items-center gap-1.5 mb-3">
      {icon}
      <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-700">
        {title}
      </h3>
    </div>
    {children}
  </div>
);

const Row = ({
  label,
  value,
  green,
  muted,
}: {
  label: string;
  value: string;
  green?: boolean;
  muted?: boolean;
}) => (
  <div
    className={`flex justify-between ${
      green ? "text-green-600" : muted ? "text-gray-400" : "text-gray-700"
    }`}
  >
    <span>{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

const TimeRow = ({ label, date }: { label: string; date?: string }) => (
  <div className="flex justify-between">
    <span className="text-gray-500">{label}:</span>
    <span className={date ? "font-medium text-gray-900" : "text-gray-300"}>
      {date ? formatDate(date) : "—"}
    </span>
  </div>
);

const colorClasses: Record<string, string> = {
  primary: "text-white",
  green: "bg-green-600 hover:bg-green-700 text-white",
  red: "bg-red-600 hover:bg-red-700 text-white",
  orange: "bg-orange-500 hover:bg-orange-600 text-white",
  purple: "bg-purple-600 hover:bg-purple-700 text-white",
  blue: "bg-blue-600 hover:bg-blue-700 text-white",
  gray: "bg-gray-100 hover:bg-gray-200 text-gray-700",
};

const ActionBtn = ({
  onClick,
  disabled,
  color,
  icon: Icon,
  label,
}: {
  onClick: () => void;
  disabled?: boolean;
  color: keyof typeof colorClasses;
  icon: any;
  label: string;
}) => {
  const isPrimary = color === "primary";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50 ${colorClasses[color]}`}
      style={isPrimary ? { backgroundColor: "#C70A24" } : undefined}
    >
      <Icon size={14} />
      {label}
    </button>
  );
};
