"use client";
import Link from "next/link";
import { NavItemType } from "./header";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const NavItems = ({ navItems }: { navItems: NavItemType[] }) => {
  const path = usePathname();
  return (
    <nav className="flex items-center space-x-6 text-lg font-semibold">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "transition-colors hover:text-foreground/80",
            path === item.href ? "text-foreground" : "text-foreground/60"
          )}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
};
