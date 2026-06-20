"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Store, Package, ShoppingCart, Fish } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";

const NAV_ITEMS = [
  { name: "Home", href: "/", icon: Home },
  { name: "Shop", href: "/shop", icon: Store },
  { name: "Cart", href: "#cart", icon: ShoppingCart, isCart: true },
  { name: "Track", href: "/track", icon: Package },
];

export default function Navbar() {
  const pathname = usePathname();
  const { cartCount, setIsCartOpen } = useCart();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* ─── Top Header: Logo only ─── */}
      <nav
        className="fixed top-0 z-40 w-full backdrop-blur-md border-b border-white/5"
        aria-label="Top header"
      >
        <div className="absolute inset-0 bg-primary/60 -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo — centered on mobile, left on desktop */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group mx-auto md:mx-0"
            >
              <Fish className="w-7 h-7 text-accent group-hover:text-accent-hover transition-colors duration-300" />
              <span className="font-serif font-bold text-xl tracking-[0.2em] text-foreground uppercase">
                Kicchu
              </span>
            </Link>

            {/* Desktop Nav — center */}
            <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = item.isCart ? false : isActive(item.href);

                if (item.isCart) {
                  return (
                    <button
                      key={item.name}
                      onClick={() => setIsCartOpen(true)}
                      className="relative px-5 py-2.5 rounded-xl text-sm font-medium tracking-wide transition-all duration-200 text-foreground/70 hover:text-foreground hover:bg-white/5 cursor-pointer flex items-center gap-2"
                    >
                      <Icon className="w-4 h-4" />
                      {item.name}
                      {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 text-xs font-bold text-white bg-accent rounded-full flex items-center justify-center border-2 border-primary">
                          {cartCount}
                        </span>
                      )}
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    prefetch={true}
                    className={`px-5 py-2.5 rounded-xl text-sm font-medium tracking-wide transition-all duration-200 flex items-center gap-2 ${
                      active
                        ? "text-accent bg-accent/10 shadow-sm"
                        : "text-foreground/70 hover:text-foreground hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Desktop: Cart button */}
            <div className="hidden md:flex items-center">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-foreground/80 hover:text-accent transition-colors rounded-full hover:bg-white/5 cursor-pointer"
                aria-label="Open cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 text-xs font-bold text-white bg-accent rounded-full flex items-center justify-center border-2 border-primary">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ─── Floating Bottom Pill Nav (Mobile Only) ─── */}
      <div
        className="md:hidden fixed bottom-5 left-4 right-4 z-50"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="bottom-nav-pill flex items-center justify-around px-2 py-2 h-16">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = item.isCart ? false : isActive(item.href);

            if (item.isCart) {
              return (
                <button
                  key={item.name}
                  onClick={() => setIsCartOpen(true)}
                  className="relative flex items-center justify-center gap-2 py-2.5 px-3 rounded-full transition-all duration-300 ease-out text-foreground/50 hover:text-foreground/80 cursor-pointer"
                  aria-label={`${item.name}${cartCount > 0 ? ` (${cartCount} items)` : ""}`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-0.5 min-w-[18px] h-[18px] text-[10px] font-bold text-primary bg-accent rounded-full flex items-center justify-center px-1">
                      {cartCount}
                    </span>
                  )}
                </button>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                prefetch={true}
                className={`relative flex items-center justify-center gap-2 py-2.5 rounded-full transition-all duration-300 ease-out cursor-pointer ${
                  active
                    ? "nav-active-pill px-5 text-foreground"
                    : "px-3 text-foreground/50 hover:text-foreground/80"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 transition-colors duration-300 ${
                    active ? "text-accent" : ""
                  }`}
                  strokeWidth={active ? 2.5 : 2}
                />
                <span
                  className={`text-sm font-semibold tracking-wide overflow-hidden transition-all duration-300 ease-out ${
                    active
                      ? "max-w-[80px] opacity-100"
                      : "max-w-0 opacity-0"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
