"use client";

import { useSyncExternalStore, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  User,
  MessageSquare,
  FileQuestion,
  PenSquare,
  Stethoscope,
  BookOpen,
  Menu,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

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

const STORAGE_KEY = "sidebarCollapsed";

// Custom hook for localStorage with proper SSR handling
function useLocalStorageState(key: string, defaultValue: boolean) {
  const subscribe = useCallback(
    (callback: () => void) => {
      const handleStorage = (e: StorageEvent) => {
        if (e.key === key) callback();
      };
      window.addEventListener("storage", handleStorage);
      return () => window.removeEventListener("storage", handleStorage);
    },
    [key]
  );

  const getSnapshot = useCallback(() => {
    const stored = localStorage.getItem(key);
    return stored === null ? defaultValue : stored === "true";
  }, [key, defaultValue]);

  const getServerSnapshot = useCallback(() => defaultValue, [defaultValue]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const isCollapsed = useLocalStorageState(STORAGE_KEY, true);

  const toggleCollapsed = () => {
    const newValue = !isCollapsed;
    localStorage.setItem(STORAGE_KEY, String(newValue));
    // Trigger a storage event to update the state
    window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }));
  };

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/signin");
        },
      },
    });
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 768 && !isCollapsed) {
      toggleCollapsed();
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleCollapsed}
        className={cn(
          "md:hidden fixed top-4 right-4 z-50 p-2 bg-[#9d83c4] text-white rounded-md shadow-md transition-opacity duration-300",
          !isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Mobile Overlay */}
      <div
        className={cn(
          "md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300",
          isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
        onClick={toggleCollapsed}
      />

      <div
        className={cn(
          "flex h-screen flex-col bg-[#9d83c4] text-white transition-all duration-300 ease-in-out overflow-hidden",
          "fixed md:relative z-50",
          isCollapsed
            ? "-translate-x-full md:translate-x-0 md:w-20"
            : "translate-x-0 w-64"
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
                onClick={handleLinkClick}
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
                    isCollapsed
                      ? "opacity-0 w-0 overflow-hidden"
                      : "opacity-100"
                  )}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer / Settings */}
        <div className={cn("p-4 relative")}>
          <button
            onClick={handleLogout}
            className="text-white hover:bg-white/10 rounded-full p-2 transition-colors"
          >
            <LogOut className="h-6 w-6" />
          </button>
        </div>
      </div>
    </>
  );
}
