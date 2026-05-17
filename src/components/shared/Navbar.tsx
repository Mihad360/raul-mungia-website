"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Heart,
  Search,
  ShoppingCart,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import Logo from "./Logo";
import CartDrawer from "@/components/cart/CartDrawer";
import {
  AUTH_ITEMS,
  NAVIGATION_ITEMS,
  RESOURCES_ITEMS,
  ROUTES,
} from "@/utils/navigation";

const Navbar = () => {
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="w-full sticky top-0 z-30 bg-white">
        {/* Announcement bar */}
        <div className="bg-gray-100 text-center py-2 text-sm text-gray-600">
          Get 10% OFF your First{" "}
          <Link
            href={ROUTES.REGISTER}
            className="font-semibold hover:underline cursor-pointer"
            style={{ color: "#C70A24" }}
          >
            Sign Up!
          </Link>
        </div>

        {/* Main nav */}
        <div className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            {/* Left — nav links (Desktop) */}
            <nav className="hidden md:flex items-center gap-7">
              {NAVIGATION_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`text-sm font-medium transition-colors cursor-pointer ${
                    item.name === "Home"
                      ? "text-[#C70A24] hover:text-[#C70A24]"
                      : "text-gray-700 hover:text-[#C70A24]"
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              {/* Resources Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setResourcesOpen(!resourcesOpen)}
                  className="flex items-center gap-1 text-sm text-gray-700 font-medium hover:text-[#C70A24] transition-colors cursor-pointer"
                >
                  Resources <ChevronDown size={14} />
                </button>
                {resourcesOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-lg py-2 z-50">
                    {RESOURCES_ITEMS.map((item) => (
                      <Link
                        key={item.path}
                        href={item.path}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#C70A24] cursor-pointer"
                        onClick={() => setResourcesOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            {/* Center — Logo */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <Logo />
            </div>

            {/* Right — actions (Desktop) */}
            <div className="hidden md:flex items-center gap-4 ml-auto">
              {AUTH_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className="text-sm text-gray-700 font-medium hover:text-[#C70A24] transition-colors cursor-pointer"
                >
                  {item.name}
                </Link>
              ))}

              <Link
                href="/wishlist"
                className="text-gray-600 hover:text-[#C70A24] transition-colors cursor-pointer"
              >
                <Heart size={20} />
              </Link>

              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-gray-600 hover:text-[#C70A24] transition-colors cursor-pointer"
              >
                <Search size={20} />
              </button>

              <button
                onClick={() => setCartOpen(true)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-opacity hover:opacity-90 cursor-pointer"
                style={{ backgroundColor: "#C70A24" }}
              >
                <ShoppingCart size={16} />
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden ml-auto text-gray-700 cursor-pointer"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-b border-gray-100 bg-white px-6 py-4 flex flex-col gap-4">
            {NAVIGATION_ITEMS.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className="text-sm text-gray-700 font-medium cursor-pointer hover:text-[#C70A24] transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {/* Resources in mobile */}
            <div className="flex flex-col gap-2 pl-2 border-l-2 border-gray-200">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                Resources
              </p>
              {RESOURCES_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className="text-sm text-gray-600 hover:text-[#C70A24] transition-colors cursor-pointer"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {AUTH_ITEMS.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className="text-sm text-gray-700 font-medium cursor-pointer hover:text-[#C70A24] transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Search Drawer (Optional) */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-20">
          <div className="w-full max-w-2xl mx-4 bg-white rounded-lg shadow-xl">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Search Products</h3>
              <button
                onClick={() => setSearchOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <input
                type="text"
                placeholder="Search for peptides, products..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C70A24]"
                autoFocus
              />
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Navbar;
