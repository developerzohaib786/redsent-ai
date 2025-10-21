"use client";

import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full border-t border-[#FF5F1F]/30 bg-white text-[#FF5F1F]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center py-8 px-6 gap-4">

        {/* Left section */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2">
            {/* Logo */}
                             <Image src="/image.png" alt="Logo" width={30} height={30} className="h-9 w-auto" />
            <span className="text-[#FF5F1F] font-semibold text-lg">RedSent AI</span>
          </div>
          <p className="text-sm text-black/70">
            Hand-picked resources <span className="text-[#FF5F1F]">♥</span> for Reddit product reviews.
          </p>
        </div>

        {/* Right section nav */}
        <div className="flex flex-wrap justify-center md:justify-end text-black gap-6 text-[16px]">
          <Link href="/pipeline" className="hover:text-[#e34f14] transition-colors">Pipeline</Link>
          <Link href="/faq" className="hover:text-[#e34f14] transition-colors">FAQs</Link>
          <Link href="/privacy-policy" className="hover:text-[#e34f14] transition-colors">Privacy Policy</Link>
          <Link href="/categories-list" className="hover:text-[#e34f14] transition-colors">Products Ranked List</Link>
          {/* <Link href="/login" className="hover:text-[#e34f14] transition-colors">Admin</Link> */}
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="text-center py-4 text-sm text-[#FF5F1F]/80">
        © {new Date().getFullYear()} RedSent AI. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
