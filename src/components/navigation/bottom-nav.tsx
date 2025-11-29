"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Heart, MessageCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/discover",
      label: "Discover",
      icon: Search,
    },
    {
      href: "/matches",
      label: "Matches",
      icon: MessageCircle,
    },
    {
      href: "/likes",
      label: "Likes",
      icon: Heart,
    },
    {
      href: "/profile",
      label: "Profile",
      icon: User,
    },
  ];

  const isAuthPage = pathname === "/sign-in" || pathname === "/sign-up";

  if (isAuthPage) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border sm:hidden pb-safe">
      <nav className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "w-6 h-6 transition-transform duration-200",
                  isActive && "scale-110"
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
