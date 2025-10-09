"use client"

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Category {
  _id: string;
  name: string;
  image: UploadResponse;
  createdAt: string;
  updatedAt: string;
}

interface UploadResponse {
  url: string;
  fileId: string;
  name: string;
}

const CategoriesGrid: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const params = useParams();
  const rawCategory = params?.name as string || "";
  const categoryName = rawCategory.replace(/-/g, " ");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/categories');
      const result = await response.json();

      if (result.success) {
        setCategories(result.data);
        console.log('Fetched categories:', result.data);
      } else {
        setError(result.error || 'Failed to fetch categories');
      }
    } catch (error) {
      setError('Error fetching categories');
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter categories
  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get suggestions based on search term
  const suggestions = searchTerm.trim() === '' 
    ? categories 
    : categories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

  const handleSuggestionClick = (categoryName: string) => {
    setSearchTerm(categoryName);
    setShowSuggestions(false);
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-[#FF5F1F] text-xl">Loading categories...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto p-6">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-[#FF5F1F] mb-2">Error Loading Categories</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchCategories}
              className="bg-[#FF5F1F] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#e34f14] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id='categories' className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        {/* Search Bar - Centered and Smaller */}
        <div className="mb-8 flex justify-center">
          <div ref={searchRef} className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF5F1F] focus:border-transparent"
            />
            
            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {suggestions.map((category) => (
                  <button
                    key={category._id}
                    onClick={() => handleSuggestionClick(category.name)}
                    className="w-full text-left px-4 py-3 hover:bg-[#FF5F1F]/10 transition-colors border-b border-gray-100 last:border-b-0 text-black"
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Categories Grid */}
        {filteredCategories.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-[#FF5F1F] mb-2">No Categories Found</h2>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? `No categories match "${searchTerm}". Try a different search term.`
                : 'No categories available at the moment.'}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="bg-[#FF5F1F] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#e34f14] transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.map((category) => (
              <Link
                key={category._id}
                href={`/categories/${category.name.replace(/\s+/g, '-').replace(/\(|\)/g, '')}`}
                className="bg-white rounded-xl overflow-hidden hover:bg-[#FF5F1F]/10 transition-all duration-300 transform hover:scale-105 border border-gray-300 hover:border-[#FF5F1F]/50 cursor-pointer block group"
              >
                {/* Category Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={category.image.url}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = '/api/placeholder/300/200';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-all duration-300"></div>
                </div>

                {/* Category Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-black line-clamp-2 group-hover:text-[#FF5F1F] transition-colors">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Results Summary */}
        <div className="text-center mt-4 text-gray-600">
          Showing {filteredCategories.length} of {categories.length} categories
        </div>
      </div>
    </div>
  );
};

export default CategoriesGrid;