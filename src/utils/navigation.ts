export const NAVIGATION_ITEMS = [
  { name: "Home", path: "/" },
  { name: "Shop", path: "/shop" },
  { name: "Contact", path: "/contact" },
] as const;

export const RESOURCES_ITEMS = [
  { name: "About us", path: "/resources/aboutus" },
  { name: "Certifications", path: "/resources/certifications" },
  { name: "Shipping Policies", path: "/resources/shipping-policy" },
  { name: "FAQ", path: "/resources/faq" },
  { name: "Blog", path: "/resources/blog" },
] as const;

export const AUTH_ITEMS = [{ name: "Login/Register", path: "/login" }] as const;

export const ROUTES = {
  REGISTER: "/register",
  CART: "/cart",
} as const;
