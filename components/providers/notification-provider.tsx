"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Toast = {
  id: string;
  title: string;
  tone?: "success" | "error";
};

type ToastContextValue = {
  notify: (title: string, tone?: Toast["tone"]) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const value = useMemo(
    () => ({
      notify(title: string, tone: Toast["tone"] = "success") {
        const id = crypto.randomUUID();
        setToasts((current) => [...current, { id, title, tone }]);
        window.setTimeout(() => {
          setToasts((current) => current.filter((toast) => toast.id !== id));
        }, 2800);
      },
    }),
    [],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-50 space-y-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "min-w-64 rounded-2xl border px-4 py-3 text-sm shadow-glow backdrop-blur",
              toast.tone === "error"
                ? "border-red-400/30 bg-red-500/10 text-red-100"
                : "border-glow/30 bg-glow/10 text-accent",
            )}
          >
            {toast.title}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useNotify() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useNotify must be used within NotificationProvider");
  return context;
}
