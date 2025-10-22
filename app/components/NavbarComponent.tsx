"use client";
import Button from "@/app/components/Button";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/aboutus' },
  { label: 'SignUp', href: '/signup' },
  { label: 'LogIn', href: '/login' },
]

export default function Navbar() {
  const [isOpen, setisOpen] = useState(false);
  return (
    <>
      <section className="py-4 lg:py-8 fixed w-full top-0 backdrop-blur z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white border border-[#FF5F1F]/30 text-[#FF5F1F] rounded-[27px] md:rounded-full shadow-md">
            <div className="flex items-center justify-between p-2 px-4 md:pr-2">

              {/* Left: Logo */}
              <Link href="/">
                <div className="flex items-center gap-2">
                  <Image src="/image.png" alt="Logo" width={30} height={30} className="h-9 w-auto" />
                  <span className="text-[#FF5F1F] font-bold text-xl">RedSent AI</span>
                </div>
              </Link>

              {/* Middle: Nav Links */}
              <nav className="hidden lg:flex gap-6 font-medium text-black">
                {navLinks.map((i) => (
                  <a href={i.href} key={i.label} className="hover:text-[#ff7847] transition-colors">
                    {i.label}
                  </a>
                ))}
              </nav>

              {/* Right: Menu + Buttons */}
              <div className="flex items-center gap-4">
                {/* Mobile menu */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  onClick={() => setisOpen(!isOpen)}
                  className="feather feather-menu md:hidden text-[#FF5F1F] cursor-pointer"
                >
                  <line x1={3} y1={12} x2={21} y2={12} className={twMerge('origin-center transition-transform duration-300', isOpen && 'rotate-45 translate-0.5 translate-y-1')} />
                  <line x1={3} y1={6} x2={21} y2={6} className={twMerge('origin-center transition-all duration-300', isOpen && 'opacity-0 rotate-180')} />
                  <line x1={3} y1={18} x2={21} y2={18} className={twMerge('origin-center transition-transform duration-300', isOpen && '-rotate-45')} />
                </svg>

                {/* Desktop buttons */}
                <Link href="/categories">
                  <Button variant="secondary" className="hidden cursor-pointer md:inline-flex items-center text-[#FF5F1F] border-[#FF5F1F] hover:bg-[#FF5F1F] hover:text-white transition">
                    Ranked Categories
                  </Button>
                </Link>
                <Link href="/products">
                  <Button variant="primary" className="hidden cursor-pointer md:inline-flex items-center bg-[#FF5F1F] text-white hover:bg-[#e34f14] transition">
                    All Products
                  </Button>
                </Link>
              </div>
            </div>
            <AnimatePresence>
              {isOpen && (
                <motion.div className="overflow-hidden"
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                >
                  <div className="flex flex-col items-center gap-4 py-4 text-[#FF5F1F]">
                    {navLinks.map((i) =>
                      <a href={i.href} key={i.label} className="hover:text-[#ff7847] transition-colors">{i.label}</a>
                    )}
                    <Link href="/categories">
                      <Button variant="secondary" className="text-[#FF5F1F] border-[#FF5F1F] hover:bg-[#FF5F1F] hover:text-white transition">Ranked Categories</Button>
                    </Link>
                    <Link href="/search">
                      <Button variant="primary" className="bg-[#FF5F1F] text-white hover:bg-[#e34f14] transition">Trending</Button>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
      <div className="h-24 md:h-28 lg:h-32"></div>
    </>
  )
}
