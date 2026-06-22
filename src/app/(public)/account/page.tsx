"use client";

import {
  User,
  Mail,
  Phone,
  Shield,
  Calendar,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { useGetMyProfileQuery } from "@/redux/api/authApi";

const AccountPage = () => {
  const { data, isLoading, isError } = useGetMyProfileQuery(undefined);
  const user = data?.data;

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-gray-400" />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <XCircle size={48} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Could not load your account
        </h2>
        <p className="text-sm text-gray-500">
          Please refresh the page or sign in again.
        </p>
      </div>
    );
  }

  const getInitials = (name?: string) => {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const formatDate = (date?: string) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">My Account</h1>
        <p className="text-sm text-gray-500">
          Manage your profile information and account settings
        </p>
      </div>

      {/* Profile Card with gradient */}
      <div
        className="rounded-xl p-6 mb-6 text-white relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #C70A24 0%, #9d0820 100%)",
        }}
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-12 -translate-x-12" />

        <div className="relative flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-white text-[#C70A24] flex items-center justify-center font-bold text-2xl flex-shrink-0">
            {getInitials(user.name)}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold mb-1 truncate">
              {user.name || "—"}
            </h2>
            <p className="text-sm opacity-90 truncate mb-2">{user.email}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 bg-white/20 backdrop-blur rounded-full text-xs font-semibold capitalize">
                {user.role === "super_admin"
                  ? "Super Admin"
                  : user.role || "User"}
              </span>
              {user.isVerified ? (
                <span className="px-2.5 py-0.5 bg-green-400/20 backdrop-blur rounded-full text-xs font-semibold flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  Verified
                </span>
              ) : (
                <span className="px-2.5 py-0.5 bg-yellow-400/20 backdrop-blur rounded-full text-xs font-semibold flex items-center gap-1">
                  <XCircle size={12} />
                  Unverified
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Info Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Contact Information */}
        <Section title="Contact Information" icon={<User size={18} />}>
          <InfoRow
            icon={<User size={14} />}
            label="Full Name"
            value={user.name}
          />
          <InfoRow icon={<Mail size={14} />} label="Email" value={user.email} />
          <InfoRow
            icon={<Phone size={14} />}
            label="Phone"
            value={user.phone || "Not provided"}
          />
        </Section>

        {/* Account Information */}
        <Section title="Account Details" icon={<Shield size={18} />}>
          <InfoRow
            icon={<Shield size={14} />}
            label="Account Type"
            value={
              user.role === "super_admin"
                ? "Super Admin"
                : user.role
                  ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                  : "User"
            }
          />
          <InfoRow
            icon={<CheckCircle2 size={14} />}
            label="Status"
            value={user.isVerified ? "Verified" : "Unverified"}
            valueColor={user.isVerified ? "text-green-600" : "text-yellow-600"}
          />
          <InfoRow
            icon={<Calendar size={14} />}
            label="Member Since"
            value={formatDate(user.createdAt)}
          />
        </Section>
      </div>
    </div>
  );
};

export default AccountPage;

// ─── Helper Components ───────────────────────────────────────

const Section = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
    <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
      <span className="text-gray-500">{icon}</span>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-700">
        {title}
      </h3>
    </div>
    <div className="p-5 space-y-4">{children}</div>
  </div>
);

const InfoRow = ({
  icon,
  label,
  value,
  valueColor,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  valueColor?: string;
}) => (
  <div className="flex items-start gap-3">
    <span className="text-gray-400 mt-0.5">{icon}</span>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      <p
        className={`text-sm font-medium truncate ${valueColor || "text-gray-900"}`}
      >
        {value || "—"}
      </p>
    </div>
  </div>
);
