"use client"

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Heart, BarChart3, ExternalLink } from 'lucide-react';
import { IProduct } from '@/models/post';

const ProductsGrid: React.FC = () => {
    const [posts, setPosts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'newest' | 'score' | 'title'>('newest');

    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 15;

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/auth/post');
            if (!response.ok) throw new Error('Failed to fetch posts');
            const data = await response.json();
            setPosts(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const filteredAndSortedPosts = posts
        .filter(post =>
            post.productTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.productDescription.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            switch (sortBy) {
                case 'score':
                    return b.productScore - a.productScore;
                case 'title':
                    return a.productTitle.localeCompare(b.productTitle);
                case 'newest':
                default:
                    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
            }
        });

    const totalPages = Math.ceil(filteredAndSortedPosts.length / postsPerPage);
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const currentPosts = filteredAndSortedPosts.slice(startIndex, endIndex);

    const goToPage = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) goToPage(currentPage - 1);
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) goToPage(currentPage + 1);
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, sortBy]);

    const ProductCardSkeleton = () => (
        <div className="bg-white rounded-xl p-6 animate-pulse border border-gray-200">
            <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div className="flex justify-between items-center">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
            </div>
        </div>
    );

    const ProductCard: React.FC<{ product: IProduct; index: number }> = ({ product, index }) => {
        const [imageError, setImageError] = useState(false);

        useEffect(() => {
            const checkLikeStatus = async () => {
                try {
                    const response = await fetch(`/api/auth/post/${product._id}/like`);
                    if (response.ok) {
                        const data = await response.json();
                    }
                } catch (error) {
                    console.error('Error checking like status:', error);
                }
            };
            if (product._id) checkLikeStatus();
        }, [product._id]);

        return (
            <div className="bg-white rounded-xl p-6 hover:bg-gray-50 transition-all duration-300 border border-gray-200 hover:border-[#FF5F1F]/50 group relative">
                {/* Rank Badge - Moved to top */}
                {/* <div className="absolute top-4 left-4 bg-[#FF5F1F] text-white rounded-lg px-3 py-1 font-bold text-sm z-10 shadow-lg">
                    #{index + 1}
                </div> */}

                <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-gray-100">
                    {product.productPhotos && product.productPhotos.length > 0 && !imageError ? (
                        <Image
                            src={product.productPhotos[0]}
                            alt={product.productTitle}
                            width={400}
                            height={200}
                            className="w-full h-full object-cover"
                            onError={() => setImageError(true)}
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

                <div className="space-y-3">
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-[#FF5F1F] transition-colors">
                        {product.productTitle}
                    </h3>

                    <div className="flex items-center justify-between">
                        <span className='text-gray-500 text-2xl font-bold'>Product Price</span>
                        <span className="text-2xl font-bold text-[#FF5F1F]">
                            {product.productPrice}
                        </span>
                    </div>
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
                            href={`/products/${product._id}`}
                            className="bg-[#FF5F1F] hover:bg-[#FF5F1F]/90 text-white text-center py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <BarChart3 size={18} />
                            View Analysis
                        </Link>
                        <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                            <ExternalLink size={18} />
                            Affiliate Link
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="bg-white min-h-screen">
                <div className="max-w-7xl mx-auto p-6">
                    <div className="h-16 bg-gray-200 rounded-lg mb-8 animate-pulse"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, index) => (
                            <ProductCardSkeleton key={index} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">😢</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
                    <p className="text-gray-500 mb-6">Error: {error}</p>
                    <button
                        onClick={fetchPosts}
                        className="bg-[#FF5F1F] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#f9926a] transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-7xl mx-auto p-6">
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                Product <span className="text-[#FF5F1F]">Showcase</span>
                            </h1>
                            <p className="text-gray-600">
                                Discover amazing products curated just for you
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-[#FF5F1F] text-2xl font-bold">{filteredAndSortedPosts.length}</p>
                            <p className="text-gray-600 text-sm">Products Available</p>
                        </div>
                    </div>

                    {/* Search + Filter */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF5F1F] focus:border-transparent"
                            />
                        </div>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as 'newest' | 'score' | 'title')}
                            className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF5F1F] focus:border-transparent"
                        >
                            <option value="newest">Newest First</option>
                            <option value="score">Highest Score</option>
                            <option value="title">Alphabetical</option>
                        </select>
                    </div>
                </div>

                {/* Products */}
                {filteredAndSortedPosts.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">🔍</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Products Found</h2>
                        <p className="text-gray-600 mb-6">
                            {searchTerm
                                ? `No products match "${searchTerm}". Try a different search term.`
                                : 'No products available at the moment.'}
                        </p>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="bg-[#FF5F1F] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#f9926a] transition-colors"
                            >
                                Clear Search
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {currentPosts.map((product, index) => (
                                <ProductCard
                                    key={product._id?.toString()}
                                    product={product}
                                    index={startIndex + index}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center space-x-2 mt-8">
                                <button
                                    onClick={goToPreviousPage}
                                    disabled={currentPage === 1}
                                    className="px-3 py-2 bg-white text-[#FF5F1F] border border-[#FF5F1F] rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FF5F1F] hover:text-white transition-colors"
                                >
                                    Previous
                                </button>

                                <div className="flex space-x-1">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNumber;
                                        if (totalPages <= 5) {
                                            pageNumber = i + 1;
                                        } else if (currentPage <= 3) {
                                            pageNumber = i + 1;
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNumber = totalPages - 4 + i;
                                        } else {
                                            pageNumber = currentPage - 2 + i;
                                        }

                                        return (
                                            <button
                                                key={pageNumber}
                                                onClick={() => goToPage(pageNumber)}
                                                className={`px-3 py-2 border rounded-md transition-colors ${currentPage === pageNumber
                                                    ? 'bg-[#FF5F1F] text-white border-[#FF5F1F]'
                                                    : 'bg-white text-[#FF5F1F] border-[#FF5F1F] hover:bg-[#FF5F1F] hover:text-white'
                                                    }`}
                                            >
                                                {pageNumber}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={goToNextPage}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-2 bg-white text-[#FF5F1F] border border-[#FF5F1F] rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FF5F1F] hover:text-white transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        )}

                        <div className="text-center mt-4 text-gray-600">
                            Showing {startIndex + 1}-{Math.min(endIndex, filteredAndSortedPosts.length)} of {filteredAndSortedPosts.length} products
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProductsGrid;