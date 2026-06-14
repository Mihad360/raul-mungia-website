"use client";

import { useState, useEffect } from "react";
import Logo from "@/components/shared/Logo";

const AgeVerificationModal = () => {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [researchConfirmed, setResearchConfirmed] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const verified = sessionStorage.getItem("raul_age_verified");
    if (!verified) {
      setIsOpen(true);
    }
  }, []);

  const handleConfirm = () => {
    if (!ageConfirmed || !researchConfirmed) return;
    sessionStorage.setItem("raul_age_verified", "true");
    setIsOpen(false);
  };

  const handleExit = () => {
    window.location.href = "https://www.google.com";
  };

  // Don't render anything until client-mounted + verified
  if (!mounted || !isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
    >
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl px-8 py-8">
        <div className="text-center mb-1">
          <Logo />
        </div>

        <h2 className="text-center text-lg font-semibold text-gray-800 mb-4">
          Age Verification Required
        </h2>

        <p className="text-sm text-gray-600 mb-5 leading-relaxed">
          This website is restricted. To continue, please confirm you meet the
          minimum age requirement and accept the agreement below.
        </p>

        <div className="flex flex-col gap-3 mb-7">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={ageConfirmed}
              onChange={(e) => setAgeConfirmed(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-[#C70A24] cursor-pointer"
            />
            <span className="text-sm text-gray-700">
              I confirm I am <strong>21+</strong> years of age or older.
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={researchConfirmed}
              onChange={(e) => setResearchConfirmed(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-[#C70A24] cursor-pointer"
            />
            <span className="text-sm text-gray-700">
              I agree that products and information are provided for{" "}
              <strong>Laboratory research use only.</strong>
            </span>
          </label>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleExit}
            className="flex-1 py-3 rounded-lg bg-gray-900 text-white font-semibold text-sm hover:bg-gray-800 transition-colors"
          >
            Exit
          </button>
          <button
            onClick={handleConfirm}
            disabled={!ageConfirmed || !researchConfirmed}
            className="flex-1 py-3 rounded-lg text-white font-semibold text-sm transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
            style={{ backgroundColor: "#C70A24" }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgeVerificationModal;
