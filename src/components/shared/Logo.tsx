import Link from "next/link";
import Image from "next/image";

import logo from "../../../assets/Logo.png";
// import logo2 from "../../../assets/banner2.png";

const Logo = () => {
  return (
    <Link href="/" className="inline-block">
      <Image
        src={logo}
        // src={logo2}
        alt="STX Research"
        width={70}
        height={70}
        priority
      />
    </Link>
  );
};

export default Logo;
