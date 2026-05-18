"use client";

import React, { useState } from "react";
import { useSocketEvent } from "@/components/providers/socket-provider";
import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
}

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: "1", title: "Welcome!", body: "Thanks for joining NightMarket.", createdAt: "Just now", read: false },
    { id: "2", title: "Steam Connected", body: "Your Steam account has been linked successfully.", createdAt: "2 hours ago", read: true },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useSocketEvent("notification", (newNotif: Notification) => {
    setNotifications((prev) => [newNotif, ...prev]);
  });

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
      >
        <Bell className="size-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-flame animate-pulse" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop to close */}
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute right-0 mt-2 w-80 rounded-xl border border-white/5 bg-[#05050a]/95 backdrop-blur-xl p-4 shadow-2xl z-50"
            >
              <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                <h3 className="text-xs font-heading font-bold uppercase tracking-wider text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="text-xs font-medium text-flame">{unreadCount} new</span>
                )}
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-none">
                {notifications.length === 0 ? (
                  <div className="text-xs text-slate-500 text-center py-6">No notifications yet</div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3 rounded-lg border transition-colors ${
                        notif.read 
                          ? "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]" 
                          : "border-flame/20 bg-flame/5 hover:bg-flame/10"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="text-xs font-bold text-white">{notif.title}</div>
                        <div className="text-[10px] text-slate-600 whitespace-nowrap">{notif.createdAt}</div>
                      </div>
                      <div className="text-xs text-slate-400 mt-1 leading-relaxed">{notif.body}</div>
                    </div>
                  ))
                )}
              </div>
              
              <div className="mt-3 pt-2 border-top border-white/5 text-center">
                <button className="text-[10px] uppercase font-bold text-slate-500 hover:text-white transition-colors">
                  Mark all as read
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
