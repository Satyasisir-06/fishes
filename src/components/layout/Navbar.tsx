"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ShoppingCart, Fish } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/cart/CartContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { cartCount, setIsCartOpen } = useCart();

  if (pathname.startsWith('/admin')) {
    return null;
  }

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Track Order", href: "/track" },
  ];

  return (
    <>
      <nav className="fixed top-0 z-40 w-full bg-transparent border-b border-white/5 transition-all duration-300 backdrop-blur-sm">
        <div className="absolute inset-0 bg-primary/40 backdrop-blur-md -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center gap-3 group">
                <Fish className="w-8 h-8 text-foreground group-hover:text-accent transition-colors duration-300" />
                <span className="font-serif font-bold text-2xl tracking-widest text-foreground uppercase">Kicchu</span>
              </Link>
            </div>

            {/* Desktop Nav Removed for Mobile-First Design */}

            {/* Actions (Cart & Mobile Menu Button) */}
            <div className="flex items-center gap-4">
              
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-foreground/80 hover:text-accent transition-colors rounded-full hover:bg-white/5"
                aria-label="Cart"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute 0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-accent rounded-full border-2 border-primary">
                    {cartCount}
                  </span>
                )}
              </button>

              <div className="flex">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-full text-foreground/80 hover:text-accent hover:bg-white/5 focus:outline-none transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="sr-only">Open main menu</span>
                  {isOpen ? (
                    <X className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Menu className="block h-6 w-6" aria-hidden="true" />
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div 
        className={`fixed inset-0 z-30 transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="absolute inset-0 bg-primary/95 backdrop-blur-2xl"></div>
        <div className="relative pt-24 pb-6 space-y-2 px-6 h-full flex flex-col z-40">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block px-6 py-5 rounded-2xl text-xl font-serif tracking-wide transition-all duration-300 ${
                pathname === link.href
                  ? "text-accent bg-white/5 shadow-lg shadow-black/20"
                  : "text-foreground/80 hover:text-foreground hover:bg-white/5 hover:translate-x-2"
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          <div className="mt-auto pb-8 px-4 flex justify-center">
             <div className="text-muted/60 text-sm flex flex-col items-center gap-3">
                <Fish className="w-6 h-6 opacity-40" />
                <span className="uppercase tracking-widest text-xs">Kicchu Premium Selection</span>
             </div>
          </div>
        </div>
      </div>
    </>
  );
}
