'use client';
import Products from '@/app/products/page';
import Navbar from './components/NavbarComponent';
import Footer from './components/Footer';

export default function Home() {
  return (
    <div>
      <Navbar />
      <Products />
      <Footer />
    </div>
  );
}
