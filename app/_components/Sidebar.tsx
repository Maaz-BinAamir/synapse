"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  MessageSquare,
  FileQuestion,
  PenSquare,
  Stethoscope,
  BookOpen,
  Settings,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Profile", href: "/profile", icon: User },
  { name: "Forums", href: "/forums", icon: MessageSquare },
  {
    name: "Practice Questions",
    href: "/practice-questions",
    icon: FileQuestion,
  },
  { name: "Make Posts", href: "/post/create", icon: PenSquare },
  {
    name: "Practice Diagnosis",
    href: "/practice-diagnosis",
    icon: Stethoscope,
  },
  { name: "Learning Resources", href: "/learning-resources", icon: BookOpen },
];

// Helper functions for useSyncExternalStore
const STORAGE_KEY = "sidebarCollapsed";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot() {
  const value = localStorage.getItem(STORAGE_KEY);
  return value === "true";
}

function getServerSnapshot() {
  return true; // Default to collapsed on server
}

export function Sidebar() {
  const pathname = usePathname();
  const isCollapsed = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const toggleCollapsed = () => {
    const newValue = !isCollapsed;
    localStorage.setItem(STORAGE_KEY, String(newValue));
    window.dispatchEvent(new StorageEvent("storage"));
  };

  return (
    <div
      className={cn(
        "flex h-screen flex-col bg-[#9d83c4] text-white transition-all duration-300 ease-in-out overflow-hidden",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header*/}
      <div
        className={cn(
          "flex items-center p-6",
          isCollapsed ? "justify-center" : "justify-end"
        )}
      >
        <button
          onClick={toggleCollapsed}
          className="text-white hover:bg-white/10 rounded-md p-1"
        >
          <Menu className="h-8 w-8" />
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 flex flex-col gap-0 mt-4 pr-0">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 py-4 text-lg font-medium transition-all duration-300 ease-in-out relative my-1",
                isCollapsed ? "justify-center px-4 ml-3" : "px-5 ml-3",
                isActive
                  ? "bg-white text-[#9b87f5] rounded-l-full"
                  : "hover:bg-white/10 rounded-l-full"
              )}
            >
              <item.icon
                className={cn(
                  "h-6 w-6 shrink-0 transition-all duration-300 ease-in-out",
                  isCollapsed ? "opacity-100" : "opacity-0 w-0"
                )}
              />
              <span
                className={cn(
                  "whitespace-nowrap transition-all duration-300 ease-in-out",
                  isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
                )}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Settings */}
      <div className={cn("p-4")}>
        <button className="text-white hover:bg-white/10 rounded-full p-2">
          <Settings className="h-8 w-8" />
        </button>
      </div>
    </div>
  );
}
