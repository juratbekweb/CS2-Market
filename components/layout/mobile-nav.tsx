"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Session } from "next-auth";

interface NavItem {
  href: string;
  label: string;
}

interface MobileNavProps {
  nav: NavItem[];
  session: Session | null;
}

export function MobileNav({ nav, session }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        className="xl:hidden p-2 text-white hover:text-[#00f0ff] transition-colors"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="size-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-[#020204] bg-opacity-95 backdrop-blur-xl xl:hidden flex flex-col"
          >
            <div className="flex justify-end p-6 border-b border-white/10">
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-white hover:text-[#ff2a5f] transition-colors bg-white/5 rounded-full"
              >
                <X className="size-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {nav.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-2xl font-heading font-bold uppercase tracking-wider text-white border-b border-white/5 pb-4"
                >
                  {item.label}
                </Link>
              ))}
              
              {session?.user.role === "ADMIN" && (
                <Link 
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="text-2xl font-heading font-bold uppercase tracking-wider text-[#ff2a5f] border-b border-white/5 pb-4"
                >
                  Admin
                </Link>
              )}
            </div>
            
            {!session?.user && (
              <div className="p-6 border-t border-white/10 pb-safe">
                <Link 
                  href="/login" 
                  onClick={() => setIsOpen(false)}
                  className="block w-full py-4 text-center rounded-xl bg-gradient-to-r from-[#a100ff] to-[#00f0ff] text-white text-sm font-bold uppercase tracking-wider"
                >
                  Login
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
