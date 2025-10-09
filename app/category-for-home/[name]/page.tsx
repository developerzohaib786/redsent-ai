"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { IProduct } from "@/models/post";
import { BarChart3, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

// Define the type for the FAQ structure
interface IFaq {
  _id?: string; // Optional since your sample didn't explicitly show it on the FAQ objects themselves
  question: string;
  answer: string;
}

// Define the type for the category data (corrected structure)
interface ICategoryData {
  _id: string;
  name: string;
  image: { url: string; fileId: string; name: string };
  faqs: IFaq[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Separate component for the Product Card
interface ProductCardProps {
  product: IProduct;
  idx: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, idx }) => (
  // Added fixed width and flex-shrink-0 for horizontal scrolling
  <div
    className="bg-white rounded-xl p-6 hover:bg-gray-100 transition-all duration-300 border border-gray-200 hover:border-[#FF5F1F]/50 group relative shadow-sm w-full md:w-80 flex-shrink-0 snap-center"
    key={product._id?.toString()}
  >
    {/* Rank Badge - Moved to top */}
    <div className="absolute top-4 left-4 bg-[#FF5F1F] text-white rounded-lg px-3 py-1 font-bold text-sm z-10 shadow-lg">
      #{idx + 1}
    </div>

    {/* Product Image */}
   <Link href={`/products/${product._id?.toString()}-${idx + 1}`}>
    <div className="relative cursor-pointer w-full h-48 mb-4 rounded-lg overflow-hidden bg-gray-100">
      {product.productPhotos && product.productPhotos.length > 0 ? (
        <Image
          src={product.productPhotos[0]}
          alt={product.productTitle}
          width={400}
          height={200}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center">
              📦
            </div>
            <p className="text-sm">No Image</p>
          </div>
        </div>
      )}
    </div>
    </Link>

    {/* Product Info */}
    <div className="space-y-3">
      <h3 className="text-xl font-bold text-black line-clamp-1 group-hover:text-[#FF5F1F] transition-colors">
        {product.productTitle}
      </h3>

      {/* Review Bars */}
      <div className="space-y-2">
        {/* Positive */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-green-600">Positive</span>
            <span className="text-green-600">
              {product.positiveReviewPercentage || 0}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${product.positiveReviewPercentage || 0}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Neutral */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-yellow-600">Neutral</span>
            <span className="text-yellow-600">
              {product.neutralReviewPercentage || 0}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${product.neutralReviewPercentage || 0}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Negative */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-red-600">Negative</span>
            <span className="text-red-600">
              {product.negativeReviewPercentage || 0}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-red-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${product.negativeReviewPercentage || 0}%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2">
        <Link
          href={`/products/${product._id?.toString()}-${idx + 1}`}
          className="bg-[#FF5F1F] hover:bg-[#FF5F1F]/90 text-white text-center py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <BarChart3 size={18} />
          View Analysis
        </Link>
        <Link
          href={product.affiliateLink}
          className="bg-green-600 hover:bg-green-700 text-white text-center py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink size={18} />
          Affiliate Link
        </Link>
      </div>
    </div>
  </div>
);


const CategoryProducts: React.FC = () => {
  const params = useParams();
  const rawCategory = decodeURIComponent(params?.name as string || "");
  const categoryName = rawCategory.replace(/-/g, " ");

  const [products, setProducts] = useState<IProduct[]>([]);
  const [categoryData, setCategoryData] = useState<ICategoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ref for the scrollable container
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Function to handle horizontal scrolling
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      // Scroll by about the width of a card + gap (320px + 24px)
      const scrollAmount = direction === 'left' ? -344 : 344;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Fetch Products
        const productResponse = await fetch("/api/auth/post");
        if (!productResponse.ok) throw new Error("Failed to fetch products");
        const productData = await productResponse.json();
        setProducts(productData);

        // 2. Fetch Category Data (including FAQs)
        // 🚨 Assumed endpoint for category details by name
        const categoryResponse = await fetch(
          `/api/categories?name=${encodeURIComponent(categoryName)}`
        );
        if (!categoryResponse.ok)
          throw new Error("Failed to fetch category data");

        const categoryJson = await categoryResponse.json();

        // CRITICAL FIX: Access the first element of the 'data' array 
        if (categoryJson && categoryJson.data && categoryJson.data.length > 0) {
          const data = categoryJson.data[0];
          setCategoryData(data as ICategoryData);
          console.log("Fetched category data:", data);
        } else {
          console.warn(`Category data for "${categoryName}" not found or empty.`);
          setCategoryData(null);
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [categoryName]);

  const filtered = products
    .filter(
      (p) =>
        p.category?.toLowerCase() === categoryName.toLowerCase() &&
        typeof p.productRank === "number"
    )
    .sort((a, b) => (b.productRank ?? 0) - (a.productRank ?? 0));

  const faqs = categoryData?.faqs || [];

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">
            {categoryName} <span className="text-[#FF5F1F]">Products</span>
          </h1>
          <p className="text-gray-600">
            Showing {filtered.length} products ranked based on reddit reviews
          </p>
        </div>

        {/* Error/Loading */}
        {loading ? (
          <div className="text-center text-black py-16">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-16">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-black mb-2">
              No Products Found
            </h2>
            <p className="text-gray-600 mb-6">
              No products found for this category.
            </p>
          </div>
        ) : (
          <>
            {/* -------------------------------------------------- */}
            {/* 1. Horizontal Scrollable Product Cards Section */}
            {/* -------------------------------------------------- */}
            <div className="relative mb-12">
              {/* Left Scroll Button */}
              {/* Hide the button if there are not enough items to scroll */}
              {filtered.length > 3 && (
                <button
                  onClick={() => scroll('left')}
                  className="absolute left-0 top-1/2 cursor-pointer -translate-y-1/2 bg-white p-2 rounded-full shadow-lg z-20 border border-gray-300 hover:bg-gray-100 transition-colors hidden md:block"
                  aria-label="Scroll Left"
                >
                  <ChevronLeft size={24} className="text-black" />
                </button>
              )}

              {/* Card Container */}
              <div
                ref={scrollContainerRef}
                // Use flex, overflow-x-auto, and snap for horizontal scroll
                className="flex space-x-6 pb-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
              >
                {filtered.map((product, idx) => (
                  <ProductCard product={product} idx={idx} key={product._id?.toString()} />
                ))}
              </div>

              {/* Right Scroll Button */}
              {/* Hide the button if there are not enough items to scroll */}
              {filtered.length > 3 && (
                <button
                  onClick={() => scroll('right')}
                  className="absolute right-0 top-1/2 cursor-pointer -translate-y-1/2 bg-white p-2 rounded-full shadow-lg z-20 border border-gray-300 hover:bg-gray-100 transition-colors hidden md:block"
                  aria-label="Scroll Right"
                >
                  <ChevronRight size={24} className="text-black" />
                </button>
              )}
            </div>

            {/* -------------------------------------------------- */}
            {/* 2. FAQs Section (Below Cards) */}
            {/* -------------------------------------------------- */}
            {faqs.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h2 className="text-3xl font-bold text-black mb-6 text-center">
                  Frequently Asked Questions (FAQs)
                </h2>
                <div className="space-y-4 max-w-4xl mx-auto">
                  {faqs.map((faq, index) => (
                    // Simple Accordion Style for FAQs
                    <div
                      key={faq._id || index} // Use index as fallback key
                      className="border border-gray-200 rounded-lg shadow-sm overflow-hidden"
                    >
                      <h3 className="p-4 bg-gray-50 text-lg font-semibold text-black">
                        {faq.question}
                      </h3>
                      <div className="p-4 text-gray-700 border-t border-gray-100">
                        <p>{faq.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;