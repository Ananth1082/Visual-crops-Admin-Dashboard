"use client";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { NavItems } from "./nav-items";
import { Button } from "./ui/button";
import { redirect } from "next/navigation";
export type NavItemType = {
  name: string;
  href: string;
};
const adminNavItems = [
  { name: "Visual Crops", href: "/" },
  { name: "User Dashboard", href: "/admin/management" },
  { name: "Poster Dashboard", href: "/admin/poster" },
];
const grpAdminNavItems = [
  { name: "Visual Crops", href: "/" },
  { name: "Group Dashboard", href: "/group-admin/group" },
  { name: "Poster Dashboard", href: "/group-admin/group/poster" },
];

export function Header() {
  const { data, status } = useSession();
  const [navItems, setNavItems] = useState<NavItemType[]>([]);

  useEffect(() => {
    if (status === "loading") return;
    if (!data) {
      setNavItems([{ name: "Visual Crops", href: "/" }]);
    } else if (data.userData.role === "ADMIN") {
      setNavItems(adminNavItems);
    } else if (data.userData.role === "USER") {
      setNavItems(grpAdminNavItems);
    }
  }, [data, status]);

  useEffect(() => {
    if (!data) setNavItems([{ name: "Visual Crops", href: "/" }]);
    else if (data.userData.role === "ADMIN") setNavItems(adminNavItems);
    else if (data.userData.role === "USER") setNavItems(grpAdminNavItems);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-2">
      <div className="flex">
        <NavItems navItems={navItems} />
        <div className="flex h-14 items-center">
          {status === "authenticated" ? (
            <Button
              className="absolute right-4"
              onClick={() => {
                signOut();
                redirect("/login");
              }}
            >
              Logout
            </Button>
          ) : (
            <Button className="absolute right-8">
              <Link href={"/login"}>Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
