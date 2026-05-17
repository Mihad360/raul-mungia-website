"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const PasswordUpdatedPage = () => {
  const router = useRouter();

  // Auto-redirect to login after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/login");
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-4 text-center">
        {/* Badge icon - matches Figma scalloped badge */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "#C70A24" }}
        >
          {/* Scalloped / badge shape via clip-path */}
          <svg
            viewBox="0 0 80 80"
            className="absolute w-20 h-20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M40 4
                 L46.5 8.5 L54 6 L58.5 12.5 L66 13 L67.5 20.5
                 L74 24 L72.5 31.5 L76 38 L72.5 44.5
                 L74 52 L67.5 55.5 L66 63 L58.5 64.5
                 L54 71 L46.5 69.5 L40 74
                 L33.5 69.5 L26 71 L21.5 64.5
                 L14 63 L12.5 55.5 L6 52 L7.5 44.5
                 L4 38 L7.5 31.5 L6 24 L12.5 20.5
                 L14 13 L21.5 12.5 L26 6 L33.5 8.5 Z"
              fill="#C70A24"
            />
          </svg>
          <svg
            viewBox="0 0 24 24"
            className="relative z-10 w-9 h-9"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <p className="text-gray-700 font-medium text-base leading-snug">
          Password Updated
          <br />
          Successfully
        </p>

        <p className="text-xs text-gray-400">Redirecting to login...</p>
      </div>
    </div>
  );
};

export default PasswordUpdatedPage;
