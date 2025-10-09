'use client';
import Navbar from './components/NavbarComponent';
import Footer from './components/Footer';
import Categories from '@/app/category-for-home/page';
import Hero from '@/app/components/Hero';
import Testimonials from '@/app/components/Testimonials';

export default function Home() {
  return (
    <div className="bg-white text-[#FF5F1F]">
      <Navbar />
      <Hero />
      <Categories />
      <Testimonials  />
      <Footer />
    </div>
  );
}
