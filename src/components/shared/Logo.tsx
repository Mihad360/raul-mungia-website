import Link from "next/link";
import Image from "next/image";

import logo from "../../../assets/Logo.png";

const Logo = () => {
  return (
    <Link href="/" className="inline-block">
      <Image src={logo} alt="Logo" width={60} height={60} priority />
    </Link>
  );
};

export default Logo;
