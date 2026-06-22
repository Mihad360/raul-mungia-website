"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Heart,
  Search,
  ShoppingCart,
  ChevronDown,
  Menu,
  X,
  User,
  LogOut,
  Package,
  UserCircle,
} from "lucide-react";
import Logo from "./Logo";
import CartDrawer from "@/components/cart/CartDrawer";
import {
  AUTH_ITEMS,
  NAVIGATION_ITEMS,
  RESOURCES_ITEMS,
} from "@/utils/navigation";
import { getClientToken } from "@/lib/auth/cookies.client";
import { handleLogout } from "@/lib/auth/auth.handlers";
import { toast } from "sonner";
import { useGetMyProfileQuery } from "@/redux/api/authApi";
import { useGetCartCountQuery } from "@/redux/api/cartApi";
// TODO: Adjust hook name if your wishlist API exposes it differently
import { useGetMyWishlistQuery } from "@/redux/api/wishlistApi";
import SearchDrawer from "./SearchDrawer";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // ─── Hydration-safe auth check ─────────────────────────
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    setIsLoggedIn(!!getClientToken());
  }, []);

  const { data: profileData } = useGetMyProfileQuery(undefined, {
    skip: !isLoggedIn,
  });

  // ─── Cart count (always fetched — backend supports guest carts) ───
  const { data: cartCountData } = useGetCartCountQuery(undefined);
  const cartCount =
    cartCountData?.data?.totalItems ?? cartCountData?.data?.totalQuantity ?? 0;
  // ─── Wishlist count (only when logged in) ───
  const { data: wishlistData } = useGetMyWishlistQuery(undefined, {
    skip: !isLoggedIn,
  });
  const wishlistCount =
    wishlistData?.data?.products?.length ??
    wishlistData?.data?.products?.length ??
    0;

  const user = profileData?.data;

  const onLogoutClick = () => {
    handleLogout();
    setIsLoggedIn(false);
    setProfileOpen(false);
    setMobileOpen(false);
    toast.success("Logged out successfully");
    router.push("/");
    router.refresh();
  };

  const isActiveLink = (path: string) => {
    if (path === "/") return pathname === path;
    return pathname?.startsWith(path);
  };

  return (
    <>
      <header className="w-full sticky top-0 z-30 bg-white">
        <div className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            {/* Left — nav links (Desktop) */}
            <nav className="hidden md:flex items-center gap-7">
              {NAVIGATION_ITEMS.map((item) => {
                const isActive = isActiveLink(item.path);
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`text-sm font-medium transition-colors cursor-pointer ${
                      isActive
                        ? "text-[#C70A24]"
                        : "text-gray-700 hover:text-[#C70A24]"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}

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
              {/* Auth Section */}
              {!mounted ? (
                <div className="w-20 h-4 bg-gray-100 rounded animate-pulse" />
              ) : !isLoggedIn ? (
                <>
                  {AUTH_ITEMS.map((item) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      className="text-sm text-gray-700 font-medium hover:text-[#C70A24] transition-colors cursor-pointer"
                    >
                      {item.name}
                    </Link>
                  ))}
                </>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 text-sm text-gray-700 font-medium hover:text-[#C70A24] transition-colors cursor-pointer"
                  >
                    {user?.profileImage ? (
                      <Image
                        src={user.profileImage}
                        alt={user.name || "User"}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                        style={{ backgroundColor: "#C70A24" }}
                      >
                        {user?.name?.charAt(0).toUpperCase() || (
                          <User size={16} />
                        )}
                      </div>
                    )}
                    <span className="max-w-[120px] truncate">
                      {user?.name || "Account"}
                    </span>
                    <ChevronDown size={14} />
                  </button>

                  {profileOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setProfileOpen(false)}
                      />
                      <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-100 rounded-lg shadow-lg py-2 z-50">
                        {user && (
                          <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {user.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {user.email}
                            </p>
                          </div>
                        )}

                        <Link
                          href="/account"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#C70A24] transition-colors cursor-pointer"
                        >
                          <UserCircle size={16} />
                          My Account
                        </Link>

                        <Link
                          href="/orders"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#C70A24] transition-colors cursor-pointer"
                        >
                          <Package size={16} />
                          My Orders
                        </Link>

                        {(user?.role === "admin" ||
                          user?.role === "super_admin") && (
                          <Link
                            href="/admin/dashboard"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#C70A24] transition-colors cursor-pointer"
                          >
                            <User size={16} />
                            Admin Dashboard
                          </Link>
                        )}

                        <div className="border-t border-gray-100 my-1" />

                        <button
                          onClick={onLogoutClick}
                          className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-[#C70A24] transition-colors cursor-pointer"
                        >
                          <LogOut size={16} />
                          Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* ─── Wishlist with badge ─── */}
              <Link
                href="/wishlist"
                className="relative text-gray-600 hover:text-[#C70A24] transition-colors cursor-pointer"
              >
                <Heart size={20} />
                {mounted && wishlistCount > 0 && (
                  <span
                    className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                    style={{ backgroundColor: "#C70A24" }}
                  >
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-gray-600 hover:text-[#C70A24] transition-colors cursor-pointer"
              >
                <Search size={20} />
              </button>

              {/* ─── Cart with badge ─── */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative w-9 h-9 rounded-full flex items-center justify-center text-white transition-opacity hover:opacity-90 cursor-pointer"
                style={{ backgroundColor: "#C70A24" }}
              >
                <ShoppingCart size={16} />
                {mounted && cartCount > 0 && (
                  <span
                    className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-white text-[10px] font-bold flex items-center justify-center border-2"
                    style={{
                      color: "#C70A24",
                      borderColor: "#C70A24",
                    }}
                  >
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden ml-auto text-gray-700 cursor-pointer flex items-center gap-3"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {/* Mobile: show cart badge inline */}
              {mounted && cartCount > 0 && (
                <span className="relative">
                  <ShoppingCart size={20} />
                  <span
                    className="absolute -top-2 -right-2 min-w-[16px] h-[16px] px-1 rounded-full text-white text-[9px] font-bold flex items-center justify-center"
                    style={{ backgroundColor: "#C70A24" }}
                  >
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                </span>
              )}
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-b border-gray-100 bg-white px-6 py-4 flex flex-col gap-4">
            {NAVIGATION_ITEMS.map((item) => {
              const isActive = isActiveLink(item.path);
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? "text-[#C70A24]"
                      : "text-gray-700 hover:text-[#C70A24]"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}

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

            {/* Mobile: Wishlist + Cart links with counts */}
            <div className="flex flex-col gap-3 pt-3 border-t border-gray-100">
              <Link
                href="/wishlist"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 text-sm text-gray-700 hover:text-[#C70A24] transition-colors cursor-pointer"
              >
                <Heart size={16} />
                Wishlist
                {mounted && wishlistCount > 0 && (
                  <span
                    className="ml-auto px-2 py-0.5 rounded-full text-white text-xs font-bold"
                    style={{ backgroundColor: "#C70A24" }}
                  >
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                href="/cart"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 text-sm text-gray-700 hover:text-[#C70A24] transition-colors cursor-pointer"
              >
                <ShoppingCart size={16} />
                Cart
                {mounted && cartCount > 0 && (
                  <span
                    className="ml-auto px-2 py-0.5 rounded-full text-white text-xs font-bold"
                    style={{ backgroundColor: "#C70A24" }}
                  >
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>

            <div className="pt-3 border-t border-gray-100">
              {!mounted ? (
                <div className="w-24 h-4 bg-gray-100 rounded animate-pulse" />
              ) : !isLoggedIn ? (
                <div className="flex flex-col gap-3">
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
              ) : (
                <div className="flex flex-col gap-3">
                  {user && (
                    <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                      {user.profileImage ? (
                        <Image
                          src={user.profileImage}
                          alt={user.name || "User"}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                          style={{ backgroundColor: "#C70A24" }}
                        >
                          {user.name?.charAt(0).toUpperCase() || (
                            <User size={18} />
                          )}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  )}

                  <Link
                    href="/account"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 text-sm text-gray-700 hover:text-[#C70A24] transition-colors cursor-pointer"
                  >
                    <UserCircle size={16} />
                    My Account
                  </Link>

                  <Link
                    href="/orders"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 text-sm text-gray-700 hover:text-[#C70A24] transition-colors cursor-pointer"
                  >
                    <Package size={16} />
                    My Orders
                  </Link>

                  {(user?.role === "admin" || user?.role === "super_admin") && (
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2.5 text-sm text-gray-700 hover:text-[#C70A24] transition-colors cursor-pointer"
                    >
                      <User size={16} />
                      Admin Dashboard
                    </Link>
                  )}

                  <button
                    onClick={onLogoutClick}
                    className="flex items-center gap-2.5 text-sm text-gray-700 hover:text-[#C70A24] transition-colors cursor-pointer text-left"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Search Drawer */}
      {/* Search Drawer */}
      <SearchDrawer isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Navbar;
