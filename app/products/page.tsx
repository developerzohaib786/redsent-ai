"use client"

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Heart } from 'lucide-react';
import { IProduct } from '@/models/post';

const ProductsGrid: React.FC = () => {
    const [posts, setPosts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'newest' | 'score' | 'title'>('newest');
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 15;

    // Fetch posts from API
    const fetchPosts = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/auth/post');
            
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }
            
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

    // Filter and sort posts
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

    // Pagination calculations
    const totalPages = Math.ceil(filteredAndSortedPosts.length / postsPerPage);
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const currentPosts = filteredAndSortedPosts.slice(startIndex, endIndex);

    // Pagination handlers
    const goToPage = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            goToPage(currentPage - 1);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            goToPage(currentPage + 1);
        }
    };

    // Reset pagination when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, sortBy]);

    // Loading skeleton component
    const ProductCardSkeleton = () => (
        <div className="bg-gray-900 rounded-xl p-6 animate-pulse border border-gray-800">
            <div className="w-full h-48 bg-gray-800 rounded-lg mb-4"></div>
            <div className="h-6 bg-gray-800 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-800 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-800 rounded w-2/3 mb-4"></div>
            <div className="flex justify-between items-center">
                <div className="h-6 bg-gray-800 rounded w-16"></div>
                <div className="h-8 bg-gray-800 rounded w-24"></div>
            </div>
        </div>
    );

    // Product card component
    const ProductCard: React.FC<{ product: IProduct }> = ({ product }) => {
        const [imageError, setImageError] = useState(false);
        const [liked, setLiked] = useState(false);
        const [likeCount, setLikeCount] = useState(product.likeCount || 0);
        const [isLiking, setIsLiking] = useState(false);

        // Check if user has liked this product on component mount
        useEffect(() => {
            const checkLikeStatus = async () => {
                try {
                    const response = await fetch(`/api/auth/post/${product._id}/like`);
                    if (response.ok) {
                        const data = await response.json();
                        setLiked(data.userHasLiked);
                        setLikeCount(data.likeCount);
                    }
                } catch (error) {
                    console.error('Error checking like status:', error);
                }
            };

            if (product._id) {
                checkLikeStatus();
            }
        }, [product._id]);

        const handleLike = async (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (isLiking) return;

            setIsLiking(true);
            try {
                const response = await fetch(`/api/auth/post/${product._id}/like`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setLiked(data.liked);
                    setLikeCount(data.likeCount);
                } else {
                    console.error('Error toggling like:', response.status);
                }
            } catch (error) {
                console.error('Error toggling like:', error);
            } finally {
                setIsLiking(false);
            }
        };

        return (
            <Link href={`/products/${product._id}`} className="block">
                <div className="bg-gray-900 rounded-xl p-6 hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 border border-gray-800 hover:border-lime-400/50 group cursor-pointer">
                    {/* Product Image */}
                    <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-gray-800">
                        {product.productPhotos && product.productPhotos.length > 0 && !imageError ? (
                            <Image
                                src={product.productPhotos[0]}
                                alt={product.productTitle}
                                width={400}
                                height={200}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                onError={() => setImageError(true)}
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
                                <span className='text-white'>Product Score: </span>
                                <Star className="w-3 h-3 fill-lime-400 text-lime-400" />
                                <span className="text-lime-400 text-sm font-semibold">{product.productScore}</span>
                            </div>
                        </div>

                        {/* Like Button */}
                        <button
                            onClick={handleLike}
                            disabled={isLiking}
                            className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm p-2 rounded-full hover:bg-lime-400/20 transition-colors z-10 disabled:opacity-50"
                        >
                            <Heart 
                                className={`w-4 h-4 transition-colors ${
                                    liked ? 'fill-lime-400 text-lime-400' : 'text-gray-400'
                                } ${isLiking ? 'animate-pulse' : ''}`} 
                            />
                        </button>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-3">
                        {/* Title */}
                        <h3 className="text-xl font-bold text-white line-clamp-2 group-hover:text-lime-400 transition-colors">
                            {product.productTitle}
                        </h3>

                        {/* Description */}
                        <p className="text-gray-400 text-sm line-clamp-3">
                            {product.productDescription}
                        </p>

                        {/* Price and Meta */}
                        <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-lime-400">
                                {product.productPrice}
                            </span>
                            <div className="flex items-center gap-3 text-gray-500 text-xs">
                                {/* Like Count */}
                                <div className="flex items-center gap-1">
                                    <Heart className="w-3 h-3" />
                                    <span>{likeCount}</span>
                                </div>
                                {/* Date */}
                                <div className="flex items-center gap-1">
                                    {/* <Clock className="w-3 h-3" /> */}
                                    <span>
                                        {product.createdAt 
                                            ? new Date(product.createdAt).toLocaleDateString()
                                            : 'Unknown'
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Pros/Cons Count */}
                        {(product.pros?.length > 0 || product.cons?.length > 0) && (
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                {product.pros?.length > 0 && (
                                    <div className="bg-green-900/30 border border-green-700/50 rounded-lg p-2 text-center">
                                        <p className="text-green-400 font-semibold mb-1">Pros</p>
                                        <p className="text-green-300 text-lg font-bold">
                                            {product.pros.length}
                                        </p>
                                    </div>
                                )}
                                {product.cons?.length > 0 && (
                                    <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-2 text-center">
                                        <p className="text-red-400 font-semibold mb-1">Cons</p>
                                        <p className="text-red-300 text-lg font-bold">
                                            {product.cons.length}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Action Button */}
                        {/* <div className="pt-2">
                            <a
                                href={product.affiliateLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={handleAffiliateLinkClick}
                                className="w-full bg-lime-400 text-black py-2 px-4 rounded-lg font-semibold hover:bg-lime-500 transition-colors flex items-center justify-center gap-2 group"
                            >
                                <span>{product.affiliateLinkText || 'View Product'}</span>
                                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div> */}
                    </div>
                </div>
            </Link>
        );
    };

    if (loading) {
        return (
         <div className="bg-black min-h-screen">
            <div className="min-h-screen bg-black">
                <div className="max-w-7xl mx-auto p-6">
                    <div className="h-16 bg-gray-900 rounded-lg mb-8 animate-pulse"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, index) => (
                            <ProductCardSkeleton key={index} />
                        ))}
                    </div>
                </div>
            </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-black min-h-screen">
             <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">😢</div>
                    <h2 className="text-2xl font-bold text-white mb-2">Oops! Something went wrong</h2>
                    <p className="text-gray-400 mb-6">Error: {error}</p>
                    <button 
                        onClick={fetchPosts}
                        className="bg-lime-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-lime-500 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
            </div>
        );
    }

    return (
        <div className="bg-black min-h-screen">
          <div className="min-h-screen bg-black">
            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">
                                Product <span className="text-lime-400">Showcase</span>
                            </h1>
                            <p className="text-gray-400">
                                Discover amazing products curated just for you
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-lime-400 text-2xl font-bold">{filteredAndSortedPosts.length}</p>
                            <p className="text-gray-400 text-sm">Products Available</p>
                        </div>
                    </div>

                    {/* Search and Filter */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                            />
                        </div>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as 'newest' | 'score' | 'title')}
                            className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                        >
                            <option value="newest">Newest First</option>
                            <option value="score">Highest Score</option>
                            <option value="title">Alphabetical</option>
                        </select>
                    </div>
                </div>

                {/* Products Grid */}
                {filteredAndSortedPosts.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">🔍</div>
                        <h2 className="text-2xl font-bold text-white mb-2">No Products Found</h2>
                        <p className="text-gray-400 mb-6">
                            {searchTerm 
                                ? `No products match "${searchTerm}". Try a different search term.`
                                : 'No products available at the moment.'
                            }
                        </p>
                        {searchTerm && (
                            <button 
                                onClick={() => setSearchTerm('')}
                                className="bg-lime-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-lime-500 transition-colors"
                            >
                                Clear Search
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {currentPosts.map((product) => (
                                <ProductCard key={product._id?.toString()} product={product} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center space-x-2 mt-8">
                                <button
                                    onClick={goToPreviousPage}
                                    disabled={currentPage === 1}
                                    className="px-3 py-2 bg-black text-lime-400 border border-lime-400 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-lime-400 hover:text-black transition-colors"
                                >
                                    Previous
                                </button>
                                
                                {/* Page Numbers */}
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
                                                className={`px-3 py-2 border rounded-md transition-colors ${
                                                    currentPage === pageNumber
                                                        ? 'bg-lime-400 text-black border-lime-400'
                                                        : 'bg-black text-lime-400 border-lime-400 hover:bg-lime-400 hover:text-black'
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
                                    className="px-3 py-2 bg-black text-lime-400 border border-lime-400 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-lime-400 hover:text-black transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        )}

                        {/* Results Summary */}
                        <div className="text-center mt-4 text-gray-400">
                            Showing {startIndex + 1}-{Math.min(endIndex, filteredAndSortedPosts.length)} of {filteredAndSortedPosts.length} products
                        </div>
                    </>
                )}
            </div>
        </div>
        </div>
    );
};

export default ProductsGrid;
