"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard, Package, ShoppingBag, Settings, LogOut } from "lucide-react";
import { logout } from "@/lib/actions/auth";

export default function AdminNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  if (pathname === '/admin/login') {
    return null;
  }

  const navLinks = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <>
      <nav className="sticky top-0 z-40 w-full bg-primary/90 backdrop-blur-md border-b border-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/admin" className="flex items-center gap-2 group">
                <span className="font-bold text-xl tracking-tight text-accent">Kicchu Admin</span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                        pathname === link.href
                          ? "text-accent bg-surface/50"
                          : "text-muted hover:text-foreground hover:bg-surface"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {link.name}
                    </Link>
                  );
                })}
                <button 
                  onClick={() => logout()}
                  className="px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 text-danger hover:bg-danger/10"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-muted hover:text-foreground hover:bg-surface focus:outline-none transition-colors"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div 
        className={`fixed inset-0 z-30 transform transition-transform duration-300 ease-in-out bg-primary/95 backdrop-blur-xl ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        <div className="pt-20 pb-3 space-y-2 px-4 h-full flex flex-col">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`px-4 py-4 rounded-xl text-lg font-medium transition-colors flex items-center gap-3 ${
                  pathname === link.href
                    ? "text-accent bg-surface shadow-sm"
                    : "text-muted hover:text-foreground hover:bg-surface/50"
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.name}
              </Link>
            );
          })}
          
          <button 
            onClick={() => logout()}
            className="w-full mt-4 px-4 py-4 rounded-xl text-lg font-medium transition-colors flex items-center gap-3 text-danger hover:bg-danger/10 text-left"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
