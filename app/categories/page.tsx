"use client"

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const categories = [
  "Action Cameras",
  "Air Fryers",
  "Air Purifiers",
  "Camping Tents",
  "Dash Cams",
  "Drip Coffee Makers",
  "Drones",
  "Electric Coffee Grinders",
  "Electric Scooters",
  "Fitness Trackers",
  "Gaming Headsets",
  "Gaming Keyboards",
  "Gaming Mice",
  "Home Projectors",
  "IEMs (In-Ear Monitors)",
  "Mesh WiFi Systems",
  "Outdoor Sleeping Bags",
  "Portable Air Conditioners",
  "Portable Bluetooth Speakers",
  "Portable Monitors",
  "Robot Vacuums",
  "Sleeping Pads",
  "Smart Doorbells",
  "Soundbars",
  "Trail Running Shoes",
  "Travel Car Seats",
  "Travel Strollers",
  "Ultrawide Monitors",
  "Vacuum Cleaners",
  "Webcams",
  "WiFi Routers",
  "Wireless Earbuds"
];

const CategoriesGrid: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const params = useParams();
  const rawCategory = params?.name as string || "";
  const categoryName = rawCategory.replace(/-/g, " ");

  const filteredCategories = categories.filter(cat =>
    cat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Now use categoryName to filter your products/categories array
  const filtered = categories.filter(
    (p) => p.toLowerCase() === categoryName.toLowerCase()
  );

  return (
    <div className="bg-black min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Product <span className="text-[#FF5F1F]">Categories</span>
          </h1>
          <p className="text-gray-400 mb-4">
            Browse all available product categories
          </p>
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF5F1F] focus:border-transparent"
          />
        </div>

        {/* Categories Grid */}
        {filteredCategories.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-white mb-2">No Categories Found</h2>
            <p className="text-gray-400 mb-6">
              {searchTerm
                ? `No categories match "${searchTerm}". Try a different search term.`
                : 'No categories available at the moment.'}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="bg-[#FF5F1F] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#FF5F1F]/90 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.map((cat, idx) => (
              <Link
                key={cat}
                href={`/categories/${cat.replace(/\s+/g, '-').replace(/\(|\)/g, '')}`}
                className="bg-gray-900 rounded-xl p-6 hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 border border-gray-800 hover:border-[#FF5F1F]/50 cursor-pointer block"
              >
                <h3 className="text-xl font-bold text-white line-clamp-2 group-hover:text-[#FF5F1F] transition-colors">
                  {cat}
                </h3>
              </Link>
            ))}
          </div>
        )}

        {/* Results Summary */}
        <div className="text-center mt-4 text-gray-400">
          Showing {filteredCategories.length} of {categories.length} categories
        </div>
      </div>
    </div>
  );
};

export default CategoriesGrid;