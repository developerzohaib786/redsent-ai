"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart } from "lucide-react";
import { IProduct } from "@/models/post";

const CategoryProducts: React.FC = () => {
  const params = useParams();
  const rawCategory = decodeURIComponent(params?.name as string || "");
  const categoryName = rawCategory.replace(/-/g, " ");
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/auth/post");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter and sort by category and rank
  const filtered = products
    .filter(
      (p) => {
        const match = p.category?.toLowerCase() === categoryName.toLowerCase();
        if (!match) {
          // Debug: log mismatches
          console.log('Category mismatch:', {
            productCategory: p.category,
            urlCategory: categoryName
          });
        }
        return match && typeof p.productRank === "number";
      }
    )
    .sort((a, b) => (b.productRank ?? 0) - (a.productRank ?? 0));

  // Debug: log all products and filtered products
  useEffect(() => {
    console.log('All products:', products);
    console.log('Filtered products:', filtered);
  }, [products, filtered]);

  return (
    <div className="bg-black min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {categoryName} <span className="text-lime-400">Products</span>
          </h1>
          <p className="text-gray-400">
            Showing {filtered.length} products ranked based on reddit reviews
          </p>
        </div>
        {/* Error/Loading */}
        {loading ? (
          <div className="text-center text-white py-16">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-400 py-16">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              No Products Found
            </h2>
            <p className="text-gray-400 mb-6">
              No products found for this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product, idx) => (
              <Link
                href={`/products/${product._id?.toString()}`}
                className="block"
                key={product._id?.toString()}
              >
                <div className="bg-gray-900 rounded-xl p-6 hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 border border-gray-800 hover:border-lime-400/50 group cursor-pointer relative">
                  {/* Product Image */}
                  <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-gray-800">
                    {product.productPhotos && product.productPhotos.length > 0 ? (
                      <Image
                        src={product.productPhotos[0]}
                        alt={product.productTitle}
                        width={400}
                        height={200}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-2 flex items-center justify-center">
                            📦
                          </div>
                          <p className="text-sm">No Image</p>
                        </div>
                      </div>
                    )}

                    {/* Score Badge */}
                    <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-full">
                      <div className="flex items-center px-2 gap-1">
                        <span className="text-white">Product Score: </span>
                        <Star className="w-3 h-3 fill-lime-400 text-lime-400" />
                        <span className="text-lime-400 text-sm font-semibold">
                          {product.productScore}
                        </span>
                      </div>
                    </div>
                    {/* Like Button */}
                    <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm p-2 rounded-full">
                      <Heart className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  {/* Product Info */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-white line-clamp-2 group-hover:text-lime-400 transition-colors">
                      {product.productTitle}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-3">
                      {product.productDescription}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-lime-400">
                        {product.productPrice}
                      </span>
                      <span className="text-gray-400 text-xs">
                        {product.createdAt
                          ? new Date(product.createdAt).toLocaleDateString()
                          : "Unknown"}
                      </span>
                    </div>
                    {/* Rank Badge */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-2 text-center col-span-2">
                        <p className="text-blue-400 text-lg font-semibold mb-1">
                          Ranked #{idx + 1}
                        </p>
                       
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;