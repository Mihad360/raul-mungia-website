/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Mail, MailOpen, Eye, Send, Loader2, CornerDownRight } from "lucide-react";
import { message as antdMessage } from "antd";
import RmPagination from "@/components/ui/RmPagination";
import RmModal from "@/components/ui/RmModal";
import RmTable from "@/components/ui/RmTable";
import {
  useGetAllContactMessagesQuery,
  useMarkContactMessageReadMutation,
  useReplyToContactMessageMutation,
} from "@/redux/api/contactApi";

type ContactReply = {
  _id?: string;
  message: string;
  sentByEmail?: string;
  sentAt?: string;
};

type ContactMessage = {
  _id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  isReplied?: boolean;
  replies?: ContactReply[];
  createdAt: string;
  updatedAt: string;
};

const formatDateTime = (iso?: string): string => {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export default function AdminContactMessagesPage() {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState("");
  const itemsPerPage = 15;

  const { data: response, isLoading } = useGetAllContactMessagesQuery({
    page: currentPage,
    limit: itemsPerPage,
    isRead: filter === "unread" ? false : undefined,
  });

  const [markRead, { isLoading: markingRead }] =
    useMarkContactMessageReadMutation();
  const [sendReply, { isLoading: sendingReply }] =
    useReplyToContactMessageMutation();

  const messages: ContactMessage[] = response?.data || [];
  const meta = response?.meta || {
    page: 1,
    limit: itemsPerPage,
    total: messages.length,
    totalPage: 1,
  };

  const closeModal = () => {
    setSelected(null);
    setReplyText("");
  };

  const handleSendReply = async () => {
    if (!selected) return;
    const body = replyText.trim();
    if (body.length < 2) {
      antdMessage.error("Please write a reply first");
      return;
    }

    try {
      const updated = await sendReply({
        id: selected._id,
        message: body,
      }).unwrap();
      antdMessage.success(`Reply sent to ${selected.email}`);
      setReplyText("");
      if (updated?.data) setSelected(updated.data as ContactMessage);
    } catch (err: any) {
      antdMessage.error(err?.data?.message || "Failed to send the reply");
    }
  };

  const openMessage = async (item: ContactMessage) => {
    setSelected(item);
    setReplyText("");
    if (!item.isRead) {
      try {
        await markRead(item._id).unwrap();
      } catch {
        // silent — reading the message still works
      }
    }
  };

  const handleMarkRead = async (item: ContactMessage) => {
    try {
      await markRead(item._id).unwrap();
      antdMessage.success("Marked as read");
    } catch (err: any) {
      antdMessage.error(err?.data?.message || "Failed to mark as read");
    }
  };

  const columns = [
    {
      key: "from",
      title: "From",
      render: (item: ContactMessage) => (
        <div className="flex items-center gap-3 min-w-[220px]">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
              item.isRead ? "bg-gray-100" : "bg-indigo-50"
            }`}
          >
            {item.isRead ? (
              <MailOpen size={16} className="text-gray-500" />
            ) : (
              <Mail size={16} className="text-indigo-600" />
            )}
          </div>
          <div className="min-w-0">
            <p
              className={`line-clamp-1 text-gray-900 ${
                item.isRead ? "font-medium" : "font-bold"
              }`}
            >
              {item.name}
            </p>
            <p className="text-xs text-gray-500 line-clamp-1">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "message",
      title: "Message",
      render: (item: ContactMessage) => (
        <p className="text-sm text-gray-700 line-clamp-2 max-w-md">
          {item.message}
        </p>
      ),
    },
    {
      key: "createdAt",
      title: "Received",
      render: (item: ContactMessage) => (
        <span className="text-sm text-gray-700 whitespace-nowrap">
          {formatDateTime(item.createdAt)}
        </span>
      ),
    },
    {
      key: "status",
      title: "Status",
      render: (item: ContactMessage) =>
        item.isReplied ? (
          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700">
            Replied
          </span>
        ) : (
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              item.isRead
                ? "bg-gray-100 text-gray-600"
                : "bg-indigo-50 text-indigo-700"
            }`}
          >
            {item.isRead ? "Read" : "Unread"}
          </span>
        ),
    },
    {
      key: "actions",
      title: "Actions",
      align: "right" as const,
      render: (item: ContactMessage) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => openMessage(item)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-blue-600 border border-blue-200 hover:bg-blue-50 transition-colors cursor-pointer"
          >
            <Eye size={14} />
            View
          </button>
          {!item.isRead && (
            <button
              onClick={() => handleMarkRead(item)}
              disabled={markingRead}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
            >
              <MailOpen size={14} />
              Mark read
            </button>
          )}
        </div>
      ),
    },
  ];

  const unreadOnPage = messages.filter((m) => !m.isRead).length;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
          <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
            {meta.total} total
          </span>
          {unreadOnPage > 0 && (
            <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
              {unreadOnPage} unread
            </span>
          )}
        </div>
        <p className="text-gray-600">
          Messages submitted through the website contact form
        </p>
      </div>

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

      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
        <RmTable
          columns={columns}
          data={messages}
          loading={isLoading}
          emptyText={
            filter === "unread"
              ? "No unread messages"
              : "No contact messages yet"
          }
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

      <RmModal
        isOpen={!!selected}
        onClose={closeModal}
        title="Contact Message"
        width="max-w-2xl"
        footer={
          selected ? (
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs text-gray-500">
                Sent from the website to{" "}
                <span className="font-medium text-gray-700">
                  {selected.email}
                </span>
              </p>
              <button
                onClick={handleSendReply}
                disabled={sendingReply || replyText.trim().length < 2}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold transition-opacity hover:opacity-90 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#C70A24" }}
              >
                {sendingReply ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Send size={15} />
                )}
                {sendingReply ? "Sending..." : "Send Reply"}
              </button>
            </div>
          ) : undefined
        }
      >
        {selected && (
          <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Name</p>
                <p className="text-sm font-medium text-gray-900">
                  {selected.name}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Email</p>
                <a
                  href={`mailto:${selected.email}`}
                  className="text-sm font-medium text-blue-600 hover:underline break-all"
                >
                  {selected.email}
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">
                Message
              </h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-lg p-4 border border-gray-100">
                {selected.message}
              </p>
            </div>

            <p className="text-xs text-gray-400">
              Received {formatDateTime(selected.createdAt)}
            </p>

            {(selected.replies?.length ?? 0) > 0 && (
              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                  Previous replies
                </h3>
                <div className="space-y-3">
                  {selected.replies?.map((reply, index) => (
                    <div
                      key={reply._id || index}
                      className="flex gap-2 text-sm"
                    >
                      <CornerDownRight
                        size={15}
                        className="text-gray-300 mt-0.5 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {reply.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {reply.sentByEmail
                            ? `${reply.sentByEmail} · `
                            : ""}
                          {formatDateTime(reply.sentAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-gray-100 pt-4">
              <label
                htmlFor="contact-reply"
                className="block text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide"
              >
                Your reply
              </label>
              <textarea
                id="contact-reply"
                rows={5}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Write a reply to ${selected.name}...`}
                className="w-full px-3.5 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-300 transition-all bg-gray-50 resize-y"
              />
              <p className="text-xs text-gray-400 mt-2">
                This is emailed to the customer from the STX Research inbox with
                their original message quoted below your reply.
              </p>
            </div>
          </div>
        )}
      </RmModal>

      {markingRead && (
        <div className="fixed bottom-6 right-6 flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 shadow-sm text-xs text-gray-500">
          <Loader2 size={14} className="animate-spin" />
          Updating...
        </div>
      )}
    </div>
  );
}
