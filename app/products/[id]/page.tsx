'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Star, ExternalLink, Heart, ArrowLeft, Share2, ShoppingCart, ChevronDown, ChevronUp } from 'lucide-react';
import { IProduct } from '@/models/post';

interface IRedditReview {
    review: string;
    visitLink: string;
    tag: 'positive' | 'negative' | 'neutral';
}

const RedditReviewCard: React.FC<{ review: IRedditReview }> = ({ review }) => {
    const [showFullText, setShowFullText] = useState(false);
    
    const maxLength = 150; // Character limit for preview
    const shouldShowMore = review.review.length > maxLength;
    const displayText = showFullText ? review.review : review.review.substring(0, maxLength);
    
    const getTagColors = (tag: string) => {
        switch (tag) {
            case 'positive':
                return {
                    tagBg: 'bg-green-500',
                    tagText: 'text-white',
                    borderColor: 'border-green-500/50',
                    bgColor: 'bg-green-900/10'
                };
            case 'negative':
                return {
                    tagBg: 'bg-red-500',
                    tagText: 'text-white',
                    borderColor: 'border-red-500/50',
                    bgColor: 'bg-red-900/10'
                };
            default:
                return {
                    tagBg: 'bg-gray-500',
                    tagText: 'text-white',
                    borderColor: 'border-gray-500/50',
                    bgColor: 'bg-gray-900/20'
                };
        }
    };
    
    const colors = getTagColors(review.tag);
    
    return (
        <div className={`relative border-2 ${colors.borderColor} ${colors.bgColor} rounded-lg p-6 pt-8 transition-all duration-300 hover:shadow-lg overflow-visible`}>
            {/* Tag positioned at top-left corner */}
            <div className={`absolute -top-2 left-4 ${colors.tagBg} ${colors.tagText} px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide z-10 shadow-lg`}>
                {review.tag}
            </div>
            
            {/* Review content */}
            <div className="mt-1">
                <p className="text-gray-300 leading-relaxed text-sm break-words whitespace-pre-wrap">
                    &ldquo;{displayText}{!showFullText && shouldShowMore && '...'}&rdquo;
                </p>
            </div>
            
            {/* Show more button centered at bottom */}
            {shouldShowMore && (
                <div className="flex justify-center mt-4">
                    <button
                        onClick={() => setShowFullText(!showFullText)}
                        className="flex items-center gap-1 text-lime-400 hover:text-lime-300 transition-colors text-sm font-medium"
                    >
                        {showFullText ? (
                            <>
                                <span>Show Less</span>
                                <ChevronUp className="w-4 h-4" />
                            </>
                        ) : (
                            <>
                                <span>Show More</span>
                                <ChevronDown className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>
            )}
            
            {/* Reddit link */}
            {review.visitLink && (
                <div className="flex justify-end mt-3">
                    <a
                        href={review.visitLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-lime-400 transition-colors"
                    >
                        <span>View on Reddit</span>
                        <ExternalLink className="w-3 h-3" />
                    </a>
                </div>
            )}
        </div>
    );
};

const ReviewProgressBars: React.FC<{ reviews: IRedditReview[] }> = ({ reviews }) => {
    const totalReviews = reviews.length;
    const positiveCount = reviews.filter(review => review.tag === 'positive').length;
    const negativeCount = reviews.filter(review => review.tag === 'negative').length;
    const neutralCount = reviews.filter(review => review.tag === 'neutral').length;

    const positivePercentage = Math.round((positiveCount / totalReviews) * 100);
    const negativePercentage = Math.round((negativeCount / totalReviews) * 100);
    const neutralPercentage = Math.round((neutralCount / totalReviews) * 100);

    const ProgressBar: React.FC<{ 
        label: string; 
        count: number; 
        percentage: number; 
        color: string; 
        bgColor: string;
        icon: string;
    }> = ({ label, count, percentage, color, bgColor, icon }) => (
        <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                    <span className="text-lg">{icon}</span>
                    <span className="text-white font-medium">{label}</span>
                </div>
                <div className="text-gray-400">
                    {count} ({percentage}%)
                </div>
            </div>
            <div className="relative">
                <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                    <div 
                        className={`h-full ${bgColor} transition-all duration-500 ease-out relative`}
                        style={{ width: `${percentage}%` }}
                    >
                        <div className={`absolute inset-0 ${color} opacity-80`}></div>
                        <div className={`absolute inset-0 ${color} animate-pulse opacity-40`}></div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-4 bg-gray-900/50 rounded-xl p-6 border border-gray-800">
            <div className="text-center mb-4">
                <span className="text-gray-300 text-sm">
                    Based on {totalReviews} Reddit review{totalReviews !== 1 ? 's' : ''}
                </span>
            </div>
            
            <div className="space-y-4">
                <ProgressBar
                    label="Positive"
                    count={positiveCount}
                    percentage={positivePercentage}
                    color="bg-green-500"
                    bgColor="bg-green-900/30"
                    icon="👍"
                />
                
                <ProgressBar
                    label="Negative"
                    count={negativeCount}
                    percentage={negativePercentage}
                    color="bg-red-500"
                    bgColor="bg-red-900/30"
                    icon="👎"
                />
                
                <ProgressBar
                    label="Neutral"
                    count={neutralCount}
                    percentage={neutralPercentage}
                    color="bg-gray-500"
                    bgColor="bg-gray-700/30"
                    icon="😐"
                />
            </div>

            {/* Overall Sentiment */}
            <div className="mt-6 pt-4 border-t border-gray-700">
                <div className="text-center">
                    <span className="text-gray-300 text-sm">Overall Sentiment: </span>
                    <span className={`font-semibold ${
                        positiveCount > negativeCount + neutralCount 
                            ? 'text-green-400' 
                            : negativeCount > positiveCount + neutralCount 
                            ? 'text-red-400' 
                            : 'text-gray-400'
                    }`}>
                        {positiveCount > negativeCount + neutralCount 
                            ? 'Mostly Positive' 
                            : negativeCount > positiveCount + neutralCount 
                            ? 'Mostly Negative' 
                            : 'Mixed Reviews'
                        }
                    </span>
                </div>
            </div>
        </div>
    );
};

const ProductDetailPage: React.FC = () => {
    const params = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const [product, setProduct] = useState<IProduct | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [isLiking, setIsLiking] = useState(false);

    useEffect(() => {
        const fetchProductData = async () => {
            if (params.id) {
                try {
                    setLoading(true);
                    const response = await fetch(`/api/auth/post/${params.id}`);
                    
                    if (!response.ok) {
                        throw new Error('Product not found');
                    }
                    
                    const data = await response.json();
                    setProduct(data);
                    
                    // Check like status for both authenticated and anonymous users
                    try {
                        const likeResponse = await fetch(`/api/auth/post/${params.id}/like`);
                        if (likeResponse.ok) {
                            const likeData = await likeResponse.json();
                            setLiked(likeData.userHasLiked);
                            setLikeCount(likeData.likeCount);
                        }
                    } catch (err) {
                        console.error('Error checking like status:', err);
                        // Fallback to product data like count
                        setLikeCount((data.likeCount || 0) + (data.anonymousLikeCount || 0));
                    }
                } catch (err) {
                    setError(err instanceof Error ? err.message : 'An error occurred');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchProductData();
    }, [params.id, session?.user?.id]);

    const handleLike = async () => {
        setIsLiking(true);
        try {
            const response = await fetch(`/api/auth/post/${params.id}/like`, {
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

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product?.productTitle,
                    text: product?.productDescription,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black">
                <div className="max-w-7xl mx-auto p-6">
                    {/* Header Skeleton */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-10 bg-gray-800 rounded-lg animate-pulse"></div>
                        <div className="w-32 h-6 bg-gray-800 rounded animate-pulse"></div>
                    </div>
                    
                    {/* Content Skeleton */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="w-full h-96 bg-gray-800 rounded-xl animate-pulse"></div>
                            <div className="flex gap-2">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="w-20 h-20 bg-gray-800 rounded-lg animate-pulse"></div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="w-3/4 h-8 bg-gray-800 rounded animate-pulse"></div>
                            <div className="w-1/4 h-6 bg-gray-800 rounded animate-pulse"></div>
                            <div className="space-y-2">
                                <div className="w-full h-4 bg-gray-800 rounded animate-pulse"></div>
                                <div className="w-full h-4 bg-gray-800 rounded animate-pulse"></div>
                                <div className="w-2/3 h-4 bg-gray-800 rounded animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">😞</div>
                    <h2 className="text-2xl font-bold text-white mb-2">Product Not Found</h2>
                    <p className="text-gray-400 mb-6">{error || 'The product you\'re looking for doesn\'t exist.'}</p>
                    <button 
                        onClick={() => router.push('/products')}
                        className="bg-lime-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-lime-500 transition-colors"
                    >
                        Back to Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black">
            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-400 hover:text-lime-400 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back</span>
                    </button>
                    
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleShare}
                            className="flex items-center gap-2 bg-gray-800 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            <Share2 className="w-4 h-4" />
                            <span>Share</span>
                        </button>
                        <button
                            onClick={handleLike}
                            className="flex items-center gap-2 bg-gray-800 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            <Heart 
                                className={`w-4 h-4 transition-colors ${
                                    liked ? 'fill-lime-400 text-lime-400' : 'text-gray-400'
                                }`} 
                            />
                            <span>{liked ? 'Liked' : 'Like'}</span>
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="space-y-12">
                    {/* First Row: Images and Product Info */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 overflow-hidden">
                        {/* Product Images */}
                        <div className="space-y-4 min-w-0">
                            {/* Main Image */}
                            <div className="relative w-full h-96 rounded-xl overflow-hidden bg-gray-800">
                                {product.productPhotos && product.productPhotos.length > 0 ? (
                                    <Image
                                        src={product.productPhotos[currentImageIndex] || product.productPhotos[0]}
                                        alt={product.productTitle}
                                        width={600}
                                        height={400}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                                        <div className="text-center">
                                            <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
                                                📦
                                            </div>
                                            <p className="text-lg">No Image Available</p>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Score Badge */}
                                <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm px-3 py-2 rounded-full">
                                    <div className="flex items-center gap-2">
                                                                                <span className='text-white'>Product Score: </span>
                                        <Star className="w-4 h-4 fill-lime-400 text-lime-400" />
                                        <span className="text-lime-400 font-semibold">{product.productScore}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Thumbnail Images */}
                            {product.productPhotos && product.productPhotos.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto">
                                    {product.productPhotos.map((photo, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`relative w-20 h-20 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0 border-2 transition-colors ${
                                                currentImageIndex === index 
                                                    ? 'border-lime-400' 
                                                    : 'border-gray-700 hover:border-gray-600'
                                            }`}
                                        >
                                            <Image
                                                src={photo}
                                                alt={`${product.productTitle} ${index + 1}`}
                                                width={80}
                                                height={80}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="space-y-6 min-w-0">
                            {/* Title and Price */}
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold text-white break-words">
                                    {product.productTitle}
                                </h1>
                                <div className="text-3xl font-bold text-lime-400 break-words">
                                    {product.productPrice}
                                </div>
                            </div>

                            {/* Meta Info */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 text-gray-400 text-sm">
                                    <div className="flex items-center gap-1">
                                        <span className='font-bold'>Posted On: </span>
                                        <span>
                                            {product.createdAt 
                                                ? new Date(product.createdAt).toLocaleDateString()
                                                : 'Unknown date'
                                            }
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Like Button and Count */}
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                                        <Heart className="w-4 h-4" />
                                        <span>{likeCount} like{likeCount !== 1 ? 's' : ''}</span>
                                    </div>
                                    {/* <button
                                        onClick={handleLike}
                                        disabled={isLiking}
                                        className="flex items-center gap-2 bg-gray-800 hover:bg-lime-400/20 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        <Heart 
                                            className={`w-5 h-5 transition-colors ${
                                                liked ? 'fill-lime-400 text-lime-400' : 'text-gray-400'
                                            } ${isLiking ? 'animate-pulse' : ''}`} 
                                        />
                                        <span className="text-white text-sm">
                                            {liked ? 'Liked' : 'Like'}
                                        </span>
                                    </button> */}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-3">
                                <h3 className="text-xl font-semibold text-white">Description</h3>
                                <p className="text-gray-300 leading-relaxed break-words whitespace-pre-wrap">
                                    {product.productDescription}
                                </p>
                            </div>
                            
                            {/* Buy Button */}
                            <div className="pt-4">
                                <a
                                    href={product.affiliateLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full bg-lime-400 text-black py-4 px-6 rounded-xl font-bold text-lg hover:bg-lime-500 transition-colors flex items-center justify-center gap-3 group"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    <span>{product.affiliateLinkText || 'Buy Now'}</span>
                                    <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Second Row: Pros and Cons */}
                    {(product.pros?.length > 0 || product.cons?.length > 0) && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Pros Section */}
                            {product.pros?.length > 0 && (
                                <div className="bg-green-900/30 border border-green-700/50 rounded-xl p-6">
                                    <h4 className="text-green-400 font-semibold mb-4 flex items-center gap-2 text-xl">
                                        ✅ Pros
                                    </h4>
                                    <ul className="space-y-3">
                                        {product.pros.map((pro, index) => (
                                            <li key={index} className="text-green-300 text-sm break-words whitespace-pre-wrap">
                                                • {pro}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Cons Section */}
                            {product.cons?.length > 0 && (
                                <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-6">
                                    <h4 className="text-red-400 font-semibold mb-4 flex items-center gap-2 text-xl">
                                        ❌ Cons
                                    </h4>
                                    <ul className="space-y-3">
                                        {product.cons.map((con, index) => (
                                            <li key={index} className="text-red-300 text-sm break-words whitespace-pre-wrap">
                                                • {con}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Review Progress Bars */}
                {product.redditReviews && product.redditReviews.length > 0 && (
                    <div className="mt-12 mb-8">
                        <div className="max-w-4xl mx-auto">
                            <h3 className="text-xl font-semibold text-white mb-6 text-center">Review Summary</h3>
                            <ReviewProgressBars reviews={product.redditReviews} />
                        </div>
                    </div>
                )}

                {/* Reddit Reviews - Full Width Below */}
                {product.redditReviews && product.redditReviews.length > 0 && (
                    <div className="space-y-6 mt-12">
                        <h3 className="text-2xl font-bold text-white text-center">Reddit Reviews</h3>
                        <div className="flex justify-center">
                            <div className="w-full max-w-2xl space-y-6 mt-4">
                                {product.redditReviews.map((reviewObj, index) => (
                                    <RedditReviewCard key={index} review={reviewObj} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetailPage;