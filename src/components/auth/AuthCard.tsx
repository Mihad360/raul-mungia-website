"use client";

import Logo from "../shared/Logo";

type TAuthCardProps = {
  subtitle: string;
  children: React.ReactNode;
};

const AuthCard = ({ subtitle, children }: TAuthCardProps) => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-[480px]">
        {/* Logo + subtitle */}
        <div className="text-center mb-8">
          <Logo />
          <p className="mt-2 text-gray-500 text-sm">{subtitle}</p>
        </div>

        {/* Form area */}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default AuthCard;
