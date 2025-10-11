'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { IProduct } from '@/models/post'; // Assuming IProduct exists and includes likesAndDislikes

// --- Interface Definitions ---

interface LikeDislikePoint {
    heading: string;
    points: string[];
}

interface LikesDislikesData {
    likes: LikeDislikePoint[];
    dislikes: LikeDislikePoint[];
}

interface IRedditReview {
    comment: string;
    tag: 'positive' | 'negative' | 'neutral';
    link: string;
    author: string;
    subreddit: string;
}

// --- NEW COMPONENT: LikesDislikesFeature ---

interface LikesDislikesFeatureProps {
    data: LikeDislikePoint[];
    type: 'like' | 'dislike';
}

const LikesDislikesFeature: React.FC<LikesDislikesFeatureProps> = ({ data, type }) => {
    // State to manage which heading is currently expanded
    const [expandedHeading, setExpandedHeading] = useState<string | null>(null);

    const toggleExpansion = (heading: string) => {
        setExpandedHeading(expandedHeading === heading ? null : heading);
    };

    const isLike = type === 'like';
    const textColor = isLike ? 'text-green-600' : 'text-red-600';
    const title = isLike ? 'Positive Things:' : 'Negative Things:';
    const Icon = expandedHeading ? ChevronUp : ChevronDown;

    return (
        <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold mb-4 border-b pb-2 text-gray-800">{title}</h3>
            <div className="space-y-3">
                {data.map((item) => (
                    <div key={item.heading} className="border-b border-gray-100 last:border-b-0">
                        <button
                            onClick={() => toggleExpansion(item.heading)}
                            className="flex justify-between items-center w-full py-2 px-1 text-left hover:bg-gray-50 transition-colors rounded"
                        >
                            <span className={`font-semibold text-sm ${textColor}`}>
                                {item.heading}
                            </span>
                            {/* Display the Chevron icon based on expansion state */}
                            {expandedHeading === item.heading ? (
                                <ChevronUp className="w-4 h-4 text-gray-500" />
                            ) : (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                            )}
                        </button>
                        {/* Display points only if the current heading is expanded */}
                        {expandedHeading === item.heading && (
                            <ul className="list-disc pl-8 py-2 text-sm text-gray-600 space-y-1 bg-gray-50 rounded-b">
                                {item.points.map((point, index) => (
                                    <li key={index} className="pl-1 pr-4">{point}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};


// --- NEW COMPONENT: ProductLikesDislikes ---

interface ProductLikesDislikesProps {
    likesAndDislikes: LikesDislikesData;
}

const ProductLikesDislikes: React.FC<ProductLikesDislikesProps> = ({ likesAndDislikes }) => {
    if (!likesAndDislikes || (likesAndDislikes.likes?.length === 0 && likesAndDislikes.dislikes?.length === 0)) {
        return null;
    }

    return (
        <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Community Insights</h2>
            <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                <LikesDislikesFeature data={likesAndDislikes.likes || []} type="like" />
                <LikesDislikesFeature data={likesAndDislikes.dislikes || []} type="dislike" />
            </div>
        </div>
    );
};

// --- Existing Components (Unchanged) ---

const RedditReviewCard: React.FC<{ review: IRedditReview }> = ({ review }) => {
    const [showFullText, setShowFullText] = useState(false);

    const maxLength = 200;
    const shouldShowMore = review.comment.length > maxLength;
    const displayText = showFullText ? review.comment : review.comment.substring(0, maxLength);

    const getTagColors = (tag: string) => {
        switch (tag) {
            case 'positive':
                return {
                    tagBg: 'bg-green-500',
                    tagText: 'text-white',
                    borderColor: 'border-l-green-500',
                    bgColor: 'bg-white'
                };
            case 'negative':
                return {
                    tagBg: 'bg-red-500',
                    tagText: 'text-white',
                    borderColor: 'border-l-red-500',
                    bgColor: 'bg-white'
                };
            default:
                return {
                    tagBg: 'bg-yellow-500',
                    tagText: 'text-white',
                    borderColor: 'border-l-yellow-500',
                    bgColor: 'bg-white'
                };
        }
    };

    const colors = getTagColors(review.tag);

    return (
        <div className={`relative border-l-4 ${colors.borderColor} ${colors.bgColor} rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300`}>
            <div className="flex items-start gap-3 mb-3">
                <div className={`${colors.tagBg} ${colors.tagText} px-3 py-1 rounded text-xs font-semibold uppercase`}>
                    {review.tag}
                </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-[#FF5F1F] rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {review.author.charAt(0).toUpperCase()}
                </div>
                <div className="text-sm">
                    <span className="font-semibold text-gray-900">{review.author}</span>
                    <span className="text-gray-500"> • 5 months ago</span>
                </div>
            </div>

            <div className="mb-3">
                <p className="text-gray-700 leading-relaxed text-sm break-words">
                    {displayText}{!showFullText && shouldShowMore && '...'}
                </p>
            </div>

            <div className="flex items-center justify-between">
                {shouldShowMore && (
                    <button
                        onClick={() => setShowFullText(!showFullText)}
                        className="text-[#FF5F1F] hover:text-[#E54E0F] text-sm font-medium cursor-pointer"
                    >
                        {showFullText ? 'Show less' : 'Show more'}
                    </button>
                )}
                {review.link && (
                    <a
                        href={review.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#FF5F1F] transition-colors ml-auto cursor-pointer"
                    >
                        <span>View on Reddit</span>
                        <ExternalLink className="w-3 h-3" />
                    </a>
                )}
            </div>
        </div>
    );
};

const ReviewProgressBars: React.FC<{ reviews: IRedditReview[] }> = ({ reviews }) => {
    const totalReviews = reviews.length;
    const positiveCount = reviews.filter(review => review.tag === 'positive').length;
    const negativeCount = reviews.filter(review => review.tag === 'negative').length;
    const neutralCount = reviews.filter(review => review.tag === 'neutral').length;

    const positivePercentage = totalReviews > 0 ? Math.round((positiveCount / totalReviews) * 100) : 0;
    const negativePercentage = totalReviews > 0 ? Math.round((negativeCount / totalReviews) * 100) : 0;
    const neutralPercentage = totalReviews > 0 ? Math.round((neutralCount / totalReviews) * 100) : 0;

    return (
        <div className="space-y-3 bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 min-w-[80px]">
                    <span className="text-lg">👍</span>
                    <span className="font-bold text-gray-900">{positiveCount}</span>
                </div>
                <div className="flex-1 bg-gray-200 h-6 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-green-500 transition-all duration-500"
                        style={{ width: `${positivePercentage}%` }}
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 min-w-[80px]">
                    <span className="text-lg">😐</span>
                    <span className="font-bold text-gray-900">{neutralCount}</span>
                </div>
                <div className="flex-1 bg-gray-200 h-6 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-yellow-500 transition-all duration-500"
                        style={{ width: `${neutralPercentage}%` }}
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 min-w-[80px]">
                    <span className="text-lg">👎</span>
                    <span className="font-bold text-gray-900">{negativeCount}</span>
                </div>
                <div className="flex-1 bg-gray-200 h-6 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-red-500 transition-all duration-500"
                        style={{ width: `${negativePercentage}%` }}
                    />
                </div>
            </div>

            <div className="flex justify-end pt-2">
                <span className="text-xs text-gray-400">Last updated: Oct 4, 2025</span>
            </div>

            <div className="flex justify-end">
                <button className="text-xs text-gray-500 hover:text-[#FF5F1F] flex items-center gap-1 cursor-pointer">
                    <span className="text-sm">ⓘ</span>
                    <span>Scoring</span>
                </button>
            </div>
        </div>
    );
};

// --- ProductDetailPage (Main Component) ---

const ProductDetailPage: React.FC = () => {
    const params = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const [product, setProduct] = useState<IProduct | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    const [productRank, setProductRank] = useState<number | null>(null);

    useEffect(() => {
        console.log('Product data is: ->->-> ', product);
    }, [product]);

    useEffect(() => {
        const fetchProductData = async () => {
            if (params.id) {
                try {
                    setLoading(true);

                    // Extract product ID and rank from the params
                    const fullId = params.id as string;
                    const lastDashIndex = fullId.lastIndexOf('-');

                    let productId = fullId;
                    let rank = null;

                    if (lastDashIndex !== -1) {
                        productId = fullId.substring(0, lastDashIndex);
                        const rankString = fullId.substring(lastDashIndex + 1);
                        rank = parseInt(rankString, 10);

                        if (!isNaN(rank)) {
                            setProductRank(rank);
                        }
                    }

                    const response = await fetch(`/api/auth/post/${productId}`);

                    if (!response.ok) {
                        throw new Error('Product not found');
                    }

                    const data = await response.json();
                    console.log('Fetched product data: ', data);
                    setProduct(data);
                    console.log('Product data is: ->->-> ', product)
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

    const getTopics = () => {
        if (!product?.redditReviews) return [];

        // Extract unique meaningful keywords from reviews
        const topics = new Set<string>();

        product.redditReviews.forEach(review => {
            const text = review.comment.toLowerCase();

            // Add relevant topics based on common keywords
            if (text.includes('price') || text.includes('cheap') || text.includes('expensive') || text.includes('worth') || text.includes('value')) {
                topics.add('price/value');
            }
            if (text.includes('quality') || text.includes('build') || text.includes('durable') || text.includes('sturdy')) {
                topics.add('quality');
            }
            if (text.includes('performance') || text.includes('fast') || text.includes('slow') || text.includes('speed')) {
                topics.add('performance');
            }
            if (text.includes('easy') || text.includes('difficult') || text.includes('simple') || text.includes('complicated') || text.includes('use')) {
                topics.add('ease of use');
            }
            if (text.includes('feature') || text.includes('function') || text.includes('capability') || text.includes('capabilities')) {
                topics.add('features');
            }
            if (text.includes('design') || text.includes('look') || text.includes('aesthetic') || text.includes('style')) {
                topics.add('design');
            }
            if (text.includes('battery') || text.includes('power') || text.includes('charge')) {
                topics.add('battery');
            }
            if (text.includes('camera') || text.includes('photo') || text.includes('picture') || text.includes('video')) {
                topics.add('camera');
            }
            if (text.includes('support') || text.includes('customer service') || text.includes('warranty') || text.includes('help')) {
                topics.add('support');
            }
            if (text.includes('recommend') || text.includes('alternative') || text.includes('better') || text.includes('compare')) {
                topics.add('recommendations');
            }
        });

        return Array.from(topics).slice(0, 8); // Limit to 8 topics
    };

    const toggleTopic = (topic: string) => {
        setSelectedTopics(prev =>
            prev.includes(topic)
                ? prev.filter(t => t !== topic)
                : [...prev, topic]
        );
    };

    const getFilteredReviews = () => {
        if (!product?.redditReviews) return [];
        if (selectedTopics.length === 0) return product.redditReviews;

        return product.redditReviews.filter(review => {
            const text = review.comment.toLowerCase();

            return selectedTopics.some(topic => {
                switch (topic) {
                    case 'price/value':
                        return text.includes('price') || text.includes('cheap') || text.includes('expensive') ||
                            text.includes('worth') || text.includes('value') || text.includes('cost') || text.includes('$');
                    case 'quality':
                        return text.includes('quality') || text.includes('build') || text.includes('durable') ||
                            text.includes('sturdy') || text.includes('solid') || text.includes('premium');
                    case 'performance':
                        return text.includes('performance') || text.includes('fast') || text.includes('slow') ||
                            text.includes('speed') || text.includes('efficient') || text.includes('powerful');
                    case 'ease of use':
                        return text.includes('easy') || text.includes('difficult') || text.includes('simple') ||
                            text.includes('complicated') || text.includes('use') || text.includes('intuitive') || text.includes('user-friendly');
                    case 'features':
                        return text.includes('feature') || text.includes('function') || text.includes('capability') ||
                            text.includes('capabilities') || text.includes('option');
                    case 'design':
                        return text.includes('design') || text.includes('look') || text.includes('aesthetic') ||
                            text.includes('style') || text.includes('appearance');
                    case 'battery':
                        return text.includes('battery') || text.includes('power') || text.includes('charge') ||
                            text.includes('charging') || text.includes('battery life');
                    case 'camera':
                        return text.includes('camera') || text.includes('photo') || text.includes('picture') ||
                            text.includes('video') || text.includes('image') || text.includes('lens');
                    case 'support':
                        return text.includes('support') || text.includes('customer service') || text.includes('warranty') ||
                            text.includes('help') || text.includes('service');
                    case 'recommendations':
                        return text.includes('recommend') || text.includes('alternative') || text.includes('better') ||
                            text.includes('compare') || text.includes('instead') || text.includes('prefer');
                    default:
                        return false;
                }
            });
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <div className="max-w-7xl mx-auto p-6">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                        <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="w-full h-96 bg-gray-200 rounded-xl animate-pulse"></div>
                            <div className="flex gap-2">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse"></div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="w-3/4 h-8 bg-gray-200 rounded animate-pulse"></div>
                            <div className="w-1/4 h-6 bg-gray-200 rounded animate-pulse"></div>
                            <div className="space-y-2">
                                <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                                <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                                <div className="w-2/3 h-4 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">😞</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
                    <p className="text-gray-600 mb-6">{error || 'The product you\'re looking for doesn\'t exist.'}</p>
                    <button
                        onClick={() => router.push('/products')}
                        className="bg-[#FF5F1F] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#E54E0F] transition-colors cursor-pointer"
                    >
                        Back to Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto p-6">
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex cursor-pointer items-center gap-2 text-gray-500 hover:text-[#FF5F1F] transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-sm">All Posts</span>
                    </button>
                </div>

                {/* --- PRODUCT INFO SECTION --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4">
                        <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                            {product.productPhotos && product.productPhotos.length > 0 ? (
                                <Image
                                    src={product.productPhotos[currentImageIndex] || product.productPhotos[0]}
                                    alt={product.productTitle}
                                    width={400}
                                    height={300}
                                    className="w-full h-full object-contain p-4"
                                />
                            ) : (
                                <div className="text-gray-400 text-4xl">📦</div>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-8 space-y-4">
                        <div className="text-sm text-gray-500">
                            #{productRank || 1} in <Link href={`/categories/${product.category.replace(/\s+/g, '-').replace(/\(|\)/g, '')}`}><span className="underline cursor-pointer hover:text-[#FF5F1F]">{product.category}</span></Link>
                        </div>

                        <div className="text-sm font-medium text-gray-700">
                            {product.productTitle.split(' ')[0]}
                        </div>

                        <h1 className="text-3xl font-bold text-gray-900">
                            {product.productTitle}
                        </h1>

                        <div className="space-y-3 max-w-md">
                            <a
                                href={product.affiliateLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between border-2 border-[#FF5F1F] rounded-lg p-3 hover:bg-[#FF5F1F] hover:text-white transition-colors cursor-pointer group"
                            >
                                <span className="font-medium text-gray-900 group-hover:text-white">{product.affiliateLinkText}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500 group-hover:text-white">USD</span>
                                    <span className="font-bold text-gray-900 group-hover:text-white">{product.productPrice}</span>
                                </div>
                            </a>

                        </div>

                        <p className="text-xs text-gray-400 max-w-2xl leading-relaxed">{product.productDescription}</p>
                    </div>
                </div>
                {/* --- END PRODUCT INFO SECTION --- */}

                {/* --- LIKES AND DISLIKES SECTION (NEW) --- */}
                {/* Ensure your IProduct type includes `likesAndDislikes: LikesDislikesData` */}
                {(product as IProduct & { likesAndDislikes?: LikesDislikesData }).likesAndDislikes && (
                    <ProductLikesDislikes likesAndDislikes={(product as IProduct & { likesAndDislikes: LikesDislikesData }).likesAndDislikes} />
                )}
                {/* --- END LIKES AND DISLIKES SECTION --- */}


                {product.redditReviews && product.redditReviews.length > 0 && (
                    <div className="mt-12 space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900">Reddit Reviews:</h2>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            <div className="lg:col-span-3">
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-gray-900">Filter by Topics:</h3>
                                    {getTopics().length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {getTopics().map((topic) => (
                                                <button
                                                    key={topic}
                                                    onClick={() => toggleTopic(topic)}
                                                    className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-colors cursor-pointer ${selectedTopics.includes(topic)
                                                        ? 'border-[#FF5F1F] bg-[#FF5F1F] text-white'
                                                        : 'border-gray-300 bg-white text-gray-700 hover:border-[#FF5F1F] hover:text-[#FF5F1F]'
                                                        }`}
                                                >
                                                    {topic}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500">No topics available</p>
                                    )}
                                    {selectedTopics.length > 0 && (
                                        <button
                                            onClick={() => setSelectedTopics([])}
                                            className="text-sm text-[#FF5F1F] hover:text-[#E54E0F] font-medium cursor-pointer"
                                        >
                                            Clear all filters
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="lg:col-span-9 space-y-6">
                                <ReviewProgressBars reviews={getFilteredReviews()} />

                                <div className="space-y-4">
                                    {getFilteredReviews().length > 0 ? (
                                        getFilteredReviews().map((reviewObj, index) => (
                                            <RedditReviewCard key={index} review={reviewObj} />
                                        ))
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="text-4xl mb-4">🔍</div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No reviews found</h3>
                                            <p className="text-gray-600">Try selecting different topics or clear your filters.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetailPage;