"use client";

import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full border-t border-white/10 bg-black text-gray-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center py-8 px-6 gap-4">
        
        {/* Left section */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2">
            {/* Logo */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={28}
              height={28}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#FF5F1F]"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="7.5 4.21 12 6.81 16.5 4.21" />
              <polyline points="7.5 19.79 7.5 14.6 3 12" />
              <polyline points="21 12 16.5 14.6 16.5 19.79" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1={12} y1={22.08} x2={12} y2={12} />
            </svg>
            <span className="text-white font-semibold text-lg">Reddit Reviews</span>
          </div>
          <p className="text-sm">
            A library created with <span className="text-[#FF5F1F]">♥</span> by{" "}
            <Link href="https://github.com/developerzohaib786" target="_blank" className="text-[#FF5F1F] hover:underline">
              developerzohaib
            </Link>
          </p>
        </div>

        {/* Right section nav */}
        <div className="flex flex-wrap justify-center md:justify-end gap-6 text-sm">
          <Link href="/products" className="hover:text-[#FF5F1F] transition-colors">All Products</Link>
          <Link href="/categories" className="hover:text-[#FF5F1F] transition-colors">Ranked Categories</Link>
          <Link href="/faqs" className="hover:text-[#FF5F1F] transition-colors">Faqs</Link>
          <Link href="/login" className="hover:text-[#FF5F1F] transition-colors">Admin</Link>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className=" text-center py-4 text-sm text-gray-500">
        © {new Date().getFullYear()} Reddit Reviews. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
