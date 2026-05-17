import Link from "next/link";
import { FanIcon, Camera, X } from "lucide-react";
import Logo from "../shared/Logo";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 text-gray-100">
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Column 1 — Logo + description + socials */}
          <div>
            <Logo />
            <p className="text-xs text-gray-400 mt-3 leading-relaxed">
              Puretek is a science-driven supplier of research-grade peptides,
              committed to precision, transparency, and quality assurance.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3 mt-4">
              <a
                href="https://tiktok.com"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FanIcon size={20} />
              </a>
              <a
                href="https://instagram.com"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Camera size={20} />
              </a>
              <a
                href="https://twitter.com"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </a>
            </div>
          </div>

          {/* Column 2 — Get Links */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Get Links</h4>
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  href="/shop"
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/certifications"
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  Certifications
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 — Compliance */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">
              Compliance
            </h4>
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  href="/terms"
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/disclaimer"
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  Shipping Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 — Get In Touch */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">
              Get In Touch
            </h4>
            <ul className="flex flex-col gap-3">
              <li className="text-xs text-gray-400">
                <span className="block">📧</span>
                <a
                  href="mailto:support@example.com"
                  className="hover:text-white transition-colors"
                >
                  support@example.com
                </a>
              </li>
              <li className="text-xs text-gray-400">
                <span className="block">📞</span>
                <a
                  href="tel:+17849443124"
                  className="hover:text-white transition-colors"
                >
                  7849-3443-124
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-6">
          <p className="text-xs text-gray-500 text-center">
            2026 Axonpeptides. All right reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
