'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Star, ExternalLink, ArrowLeft, Share2, ShoppingCart, ChevronDown, ChevronUp } from 'lucide-react';
import { IProduct } from '@/models/post';

interface IRedditReview {
    comment: string;
    tag: 'positive' | 'negative' | 'neutral';
    link: string;
    author: string;
    subreddit: string;
}

const RedditReviewCard: React.FC<{ review: IRedditReview }> = ({ review }) => {
    const [showFullText, setShowFullText] = useState(false);

    const maxLength = 150;
    const shouldShowMore = review.comment.length > maxLength;
    const displayText = showFullText ? review.comment : review.comment.substring(0, maxLength);

    const getTagColors = (tag: string) => {
        switch (tag) {
            case 'positive':
                return {
                    tagBg: 'bg-green-500',
                    tagText: 'text-white',
                    borderColor: 'border-green-500/50',
                    bgColor: 'bg-green-100'
                };
            case 'negative':
                return {
                    tagBg: 'bg-red-500',
                    tagText: 'text-white',
                    borderColor: 'border-red-500/50',
                    bgColor: 'bg-red-100'
                };
            default:
                return {
                    tagBg: 'bg-gray-500',
                    tagText: 'text-white',
                    borderColor: 'border-gray-500/50',
                    bgColor: 'bg-gray-100'
                };
        }
    };

    const colors = getTagColors(review.tag);

    return (
        <div className={`relative border-2 ${colors.borderColor} ${colors.bgColor} rounded-lg p-6 pt-8`}>
            <div className={`absolute -top-2 left-4 ${colors.tagBg} ${colors.tagText} px-3 py-1 rounded-full text-xs font-semibold uppercase`}>
                {review.tag}
            </div>

            <div className="mt-1">
                <p className="text-black leading-relaxed text-sm break-words whitespace-pre-wrap">
                    &ldquo;{displayText}{!showFullText && shouldShowMore && '...'}&rdquo;
                </p>
                <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-600">
                    <span>by <span className="font-semibold text-black">{review.author}</span></span>
                    <span>in <span className="font-semibold text-black">r/{review.subreddit}</span></span>
                </div>
            </div>

            {shouldShowMore && (
                <div className="flex justify-center mt-4">
                    <button
                        onClick={() => setShowFullText(!showFullText)}
                        className="flex items-center gap-1 text-lime-600 hover:text-lime-500 text-sm font-medium"
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

            {review.link && (
                <div className="flex justify-end mt-3">
                    <a
                        href={review.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-gray-600 hover:text-lime-600"
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
                    <span className="text-black font-medium">{label}</span>
                </div>
                <div className="text-gray-600">
                    {count} ({percentage}%)
                </div>
            </div>
            <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                        className={`h-full ${bgColor} transition-all duration-500 ease-out relative`}
                        style={{ width: `${percentage}%` }}
                    >
                        <div className={`absolute inset-0 ${color} opacity-80`}></div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-4 bg-gray-100 rounded-xl p-6 border border-gray-300">
            <div className="text-center mb-4">
                <span className="text-gray-700 text-sm">
                    Based on {totalReviews} Reddit review{totalReviews !== 1 ? 's' : ''}
                </span>
            </div>
            
            <div className="space-y-4">
                <ProgressBar label="Positive" count={positiveCount} percentage={positivePercentage} color="bg-green-500" bgColor="bg-green-200" icon="👍" />
                <ProgressBar label="Negative" count={negativeCount} percentage={negativePercentage} color="bg-red-500" bgColor="bg-red-200" icon="👎" />
                <ProgressBar label="Neutral" count={neutralCount} percentage={neutralPercentage} color="bg-gray-500" bgColor="bg-gray-300" icon="😐" />
            </div>

            <div className="mt-6 pt-4 border-t border-gray-300">
                <div className="text-center">
                    <span className="text-gray-700 text-sm">Overall Sentiment: </span>
                    <span className={`font-semibold ${
                        positiveCount > negativeCount + neutralCount 
                            ? 'text-green-600' 
                            : negativeCount > positiveCount + neutralCount 
                            ? 'text-red-600' 
                            : 'text-gray-600'
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
                } catch (err) {
                    setError(err instanceof Error ? err.message : 'An error occurred');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchProductData();
    }, [params.id, session?.user?.id]);

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
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-white text-black flex items-center justify-center">Loading...</div>;
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">😞</div>
                    <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
                    <p className="text-gray-600 mb-6">{error || 'The product you\'re looking for doesn\'t exist.'}</p>
                    <button 
                        onClick={() => router.push('/products')}
                        className="bg-lime-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-lime-600"
                    >
                        Back to Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-black">
            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                {/* <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-600 hover:text-lime-600"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back</span>
                    </button>
                    
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleShare}
                            className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                        >
                            <Share2 className="w-4 h-4" />
                            <span>Share</span>
                        </button>
                    </div>
                </div> */}

                {/* Main Content */}
                <div className="space-y-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="space-y-4 min-w-0">
                            <div className="relative w-full h-96 rounded-xl overflow-hidden bg-gray-200">
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
                                            <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
                                                📦
                                            </div>
                                            <p className="text-lg">No Image Available</p>
                                        </div>
                                    </div>
                                )}
                                
                                <div className="absolute top-4 left-4 bg-white/80 px-3 py-2 rounded-full">
                                    <div className="flex items-center gap-2">
                                        <span>Product Score:</span>
                                        <Star className="w-4 h-4 fill-lime-500 text-lime-500" />
                                        <span className="text-lime-600 font-semibold">{product.productScore}</span>
                                    </div>
                                </div>
                            </div>

                            {product.productPhotos && product.productPhotos.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto">
                                    {product.productPhotos.map((photo, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`relative w-20 h-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0 border-2 transition-colors ${
                                                currentImageIndex === index 
                                                    ? 'border-lime-500' 
                                                    : 'border-gray-300 hover:border-gray-400'
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

                        <div className="space-y-6 min-w-0">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold">{product.productTitle}</h1>
                                <div className="text-3xl font-bold text-lime-600">
                                    {product.productPrice}
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-gray-600 text-sm">
                                <div className="flex items-center gap-1">
                                    <span className="font-bold">Posted On: </span>
                                    <span>
                                        {product.createdAt 
                                            ? new Date(product.createdAt).toLocaleDateString()
                                            : 'Unknown date'
                                        }
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-xl font-semibold">Description</h3>
                                <p className="text-gray-700 leading-relaxed break-words whitespace-pre-wrap">
                                    {product.productDescription}
                                </p>
                            </div>
                            
                            <div className="pt-4">
                                <a
                                    href={product.affiliateLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full bg-lime-500 text-black py-4 px-6 rounded-xl font-bold text-lg hover:bg-lime-600 flex items-center justify-center gap-3"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    <span>{product.affiliateLinkText || 'Buy Now'}</span>
                                    <ExternalLink className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {(product.pros?.length > 0 || product.cons?.length > 0) && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {product.pros?.length > 0 && (
                                <div className="bg-green-100 border border-green-300 rounded-xl p-6">
                                    <h4 className="text-green-700 font-semibold mb-4 flex items-center gap-2 text-xl">
                                        ✅ Pros
                                    </h4>
                                    <ul className="space-y-3">
                                        {product.pros.map((pro, index) => (
                                            <li key={index} className="text-green-700 text-sm break-words whitespace-pre-wrap">
                                                • {pro}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {product.cons?.length > 0 && (
                                <div className="bg-red-100 border border-red-300 rounded-xl p-6">
                                    <h4 className="text-red-700 font-semibold mb-4 flex items-center gap-2 text-xl">
                                        ❌ Cons
                                    </h4>
                                    <ul className="space-y-3">
                                        {product.cons.map((con, index) => (
                                            <li key={index} className="text-red-700 text-sm break-words whitespace-pre-wrap">
                                                • {con}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {product.redditReviews && product.redditReviews.length > 0 && (
                    <div className="mt-12 mb-8">
                        <div className="max-w-4xl mx-auto">
                            <h3 className="text-xl font-semibold mb-6 text-center">Review Summary</h3>
                            <ReviewProgressBars reviews={product.redditReviews} />
                        </div>
                    </div>
                )}

                {product.redditReviews && product.redditReviews.length > 0 && (
                    <div className="space-y-6 mt-12">
                        <h3 className="text-2xl font-bold text-center">Reddit Reviews</h3>
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
