"use client"

import React, { useState, useEffect } from 'react';
import { Plus, X, Star, MessageSquare, AlertCircle } from 'lucide-react';
import axios from 'axios';
import FileUpload from "@/app/components/FileUpload";

interface RedditReview {
    comment: string;
    tag: 'positive' | 'negative' | 'neutral';
    link: string;
    author: string;
    subreddit: string;
}

interface ProductFormData {
    productTitle: string;
    productDescription: string;
    productPhotos: string[]; // URLs from uploaded images
    productPrice: string;
    affiliateLink: string;
    affiliateLinkText: string;
    pros: string[];
    cons: string[];
    redditReviews: RedditReview[];
    productScore: number;
    category: string;
    productRank?: number;
}

interface Category {
    _id: string;
    name: string;
    image: UploadResponse;
    createdAt: string;
    updatedAt: string;
}

interface ValidationErrors {
    productTitle?: string;
    productDescription?: string;
    productPhotos?: string;
    productPrice?: string;
    affiliateLink?: string;
    affiliateLinkText?: string;
    pros?: string;
    cons?: string;
    redditReviews?: string;
    productScore?: string;
    category?: string;
}

interface UploadResponse {
    url: string;
    fileId: string;
    name: string;
}

const ProductPostForm: React.FC = () => {
    const [formData, setFormData] = useState<ProductFormData>({
        productTitle: '',
        productDescription: '',
        productPhotos: [],
        productPrice: '',
        affiliateLink: '',
        affiliateLinkText: '',
        pros: [''],
        cons: [''],
        redditReviews: [],
        productScore: 50,
        category: '',
        productRank: undefined,
    });

    // For the textarea input
    const [redditReviewsInput, setRedditReviewsInput] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<{ [key: number]: number }>({});
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    // Review percentages
    const [reviewPercentages, setReviewPercentages] = useState({
        positive: 0,
        negative: 0,
        neutral: 0
    });



    const handleInputChange = <K extends keyof ProductFormData>(field: K, value: ProductFormData[K]) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        const eKey = field as unknown as keyof ValidationErrors;
        if (errors[eKey]) {
            setErrors(prev => ({ ...prev, [eKey]: undefined }));
        }
    };

    // Fetch categories
    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/categories');
            const result = await response.json();
            console.log('Fetched categories:', result.data);

            if (result.success) {
                setCategories(result.data);
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

    const handleImageUploadSuccess = (index: number, response: UploadResponse) => {
        setFormData(prev => {
            const newPhotos = [...prev.productPhotos];
            newPhotos[index] = response.url;
            return { ...prev, productPhotos: newPhotos };
        });
        setUploadProgress(prev => ({ ...prev, [index]: 0 }));
    };

    const handleImageUploadProgress = (index: number, progress: number) => {
        setUploadProgress(prev => ({ ...prev, [index]: progress }));
    };

    const removePhoto = (index: number) => {
        setFormData(prev => {
            const newPhotos = [...prev.productPhotos];
            newPhotos[index] = '';
            return { ...prev, productPhotos: newPhotos };
        });
    };

    const addPro = () => {
        setFormData(prev => ({
            ...prev,
            pros: [...prev.pros, '']
        }));
    };

    const removePro = (index: number) => {
        if (formData.pros.length > 1) {
            setFormData(prev => ({
                ...prev,
                pros: prev.pros.filter((_, i) => i !== index)
            }));
        }
    };

    const updatePro = (index: number, value: string) => {
        setFormData(prev => ({
            ...prev,
            pros: prev.pros.map((pro, i) => i === index ? value : pro)
        }));
    };

    const addCon = () => {
        setFormData(prev => ({
            ...prev,
            cons: [...prev.cons, '']
        }));
    };

    const removeCon = (index: number) => {
        if (formData.cons.length > 1) {
            setFormData(prev => ({
                ...prev,
                cons: prev.cons.filter((_, i) => i !== index)
            }));
        }
    };

    const updateCon = (index: number, value: string) => {
        setFormData(prev => ({
            ...prev,
            cons: prev.cons.map((con, i) => i === index ? value : con)
        }));
    };

    // Calculate review percentages from redditReviewsInput
    useEffect(() => {
        let reviews: RedditReview[] = [];
        try {
            if (redditReviewsInput.trim()) {
                reviews = JSON.parse(redditReviewsInput);
            }
        } catch {
            // ignore parse error
        }
        const total = reviews.length;
        const positive = reviews.filter(r => r.tag === 'positive').length;
        const negative = reviews.filter(r => r.tag === 'negative').length;
        const neutral = reviews.filter(r => r.tag === 'neutral').length;
        setReviewPercentages({
            positive: total > 0 ? Math.round((positive / total) * 100) : 0,
            negative: total > 0 ? Math.round((negative / total) * 100) : 0,
            neutral: total > 0 ? Math.round((neutral / total) * 100) : 0
        });
    }, [redditReviewsInput]);

    const validateData = (): boolean => {
        const newErrors: ValidationErrors = {};

        // Product Title validation
        if (!formData.category) {
            newErrors.category = 'Category is required';
        }
        if (!formData.productTitle.trim()) {
            newErrors.productTitle = 'Product title is required';
        } else if (formData.productTitle.length < 3) {
            newErrors.productTitle = 'Product title must be at least 3 characters';
        } else if (formData.productTitle.length > 100) {
            newErrors.productTitle = 'Product title must be less than 100 characters';
        }

        // Product Description validation
        if (!formData.productDescription.trim()) {
            newErrors.productDescription = 'Product description is required';
        } else if (formData.productDescription.length < 10) {
            newErrors.productDescription = 'Product description must be at least 10 characters';
        } else if (formData.productDescription.length > 2000) {
            newErrors.productDescription = 'Product description must be less than 2000 characters';
        }

        // Product Price validation
        if (!formData.productPrice.trim()) {
            newErrors.productPrice = 'Product price is required';
        } else if (!/^\$?\d+(\.\d{2})?$/.test(formData.productPrice.trim())) {
            newErrors.productPrice = 'Please enter a valid price (e.g., $99.99 or 99.99)';
        }

        // Affiliate Link validation
        if (!formData.affiliateLink.trim()) {
            newErrors.affiliateLink = 'Affiliate link is required';
        } else {
            try {
                new URL(formData.affiliateLink);
            } catch {
                newErrors.affiliateLink = 'Please enter a valid URL';
            }
        }

        // Affiliate Link Text validation
        if (!formData.affiliateLinkText.trim()) {
            newErrors.affiliateLinkText = 'Affiliate link text is required';
        } else if (formData.affiliateLinkText.length > 50) {
            newErrors.affiliateLinkText = 'Affiliate link text must be less than 50 characters';
        }

        // Pros validation
        const validPros = formData.pros.filter(pro => pro.trim().length > 0);
        if (validPros.length === 0) {
            newErrors.pros = 'At least one pro is required';
        }

        // Cons validation
        const validCons = formData.cons.filter(con => con.trim().length > 0);
        if (validCons.length === 0) {
            newErrors.cons = 'At least one con is required';
        }

        // Reddit Reviews validation
        if (redditReviewsInput.trim()) {
            try {
                const parsed = JSON.parse(redditReviewsInput);
                if (!Array.isArray(parsed)) {
                    newErrors.redditReviews = 'Reddit reviews must be a JSON array.';
                } else if (parsed.length > 50) {
                    newErrors.redditReviews = 'Maximum 50 Reddit reviews allowed.';
                } else {
                    for (const review of parsed) {
                        if (!review.comment || !review.tag || !review.link) {
                            newErrors.redditReviews = 'Each review must have comment, tag, and link.';
                            break;
                        }
                        if (!['positive', 'negative', 'neutral'].includes(review.tag)) {
                            newErrors.redditReviews = 'Tag must be positive, negative, or neutral.';
                            break;
                        }
                        try {
                            new URL(review.link);
                        } catch {
                            newErrors.redditReviews = 'All review links must be valid URLs.';
                            break;
                        }
                    }
                }
            } catch {
                newErrors.redditReviews = 'Reddit reviews must be valid JSON.';
            }
        }

        // Product Score validation
        if (formData.productScore < 0 || formData.productScore > 100) {
            newErrors.productScore = 'Product score must be between 0 and 100';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateData()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Filter out empty values
            let redditReviews: RedditReview[] = [];
            if (redditReviewsInput.trim()) {
                redditReviews = JSON.parse(redditReviewsInput);
            }
            const cleanedData = {
                ...formData,
                productPhotos: formData.productPhotos.filter(photo => photo.trim() !== ''),
                pros: formData.pros.filter(pro => pro.trim() !== ''),
                cons: formData.cons.filter(con => con.trim() !== ''),
                redditReviews
            };

            const response = await axios.post('/api/auth/post', cleanedData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200 || response.status === 201) {
                alert('Product post created successfully!');
                // Reset form or redirect
                setFormData({
                    productTitle: '',
                    productDescription: '',
                    productPhotos: [],
                    productPrice: '',
                    affiliateLink: '',
                    affiliateLinkText: '',
                    pros: [''],
                    cons: [''],
                    redditReviews: [],
                    category: '',
                    productScore: 50,
                    productRank: undefined,
                });
                setRedditReviewsInput('');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            if (axios.isAxiosError(error)) {
                alert(`Error: ${error.response?.data?.message || 'Failed to create post'}`);
            } else {
                alert('An unexpected error occurred');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const calculateProductRank = () => {
        let redditReviews: RedditReview[] = [];
        try {
            if (redditReviewsInput.trim()) {
                redditReviews = JSON.parse(redditReviewsInput);
            }
        } catch {
            // ignore parse error, handled by validation
        }
        const total = redditReviews.length;
        const positive = redditReviews.filter(r => r.tag === 'positive').length;
        const neutral = redditReviews.filter(r => r.tag === 'neutral').length;
        const positivePct = total > 0 ? (positive / total) * 100 : 0;
        const neutralPct = total > 0 ? (neutral / total) * 100 : 0;
        // 30% productScore, 50% positive, 20% neutral
        const rank = Math.round((formData.productScore * 0.3) + (positivePct * 0.5) + (neutralPct * 0.2));
        setFormData(prev => ({ ...prev, productRank: rank }));
        return rank;
    };

    const getTagColor = (tag: string) => {
        switch (tag) {
            case 'positive': return 'text-green-600 bg-green-100';
            case 'negative': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const ErrorMessage: React.FC<{ error?: string }> = ({ error }) => {
        if (!error) return null;
        return (
            <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Create Product Post</h1>

            {/* Review Percentages Display */}
            <div className="flex gap-6 justify-center mb-8">
                <div className="flex flex-col items-center">
                    <span className="font-semibold text-green-600">Positive</span>
                    <span className="text-lg">{reviewPercentages.positive}%</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="font-semibold text-red-600">Negative</span>
                    <span className="text-lg">{reviewPercentages.negative}%</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="font-semibold text-gray-600">Neutral</span>
                    <span className="text-lg">{reviewPercentages.neutral}%</span>
                </div>
            </div>

            <div className="space-y-8">
                {/* Category */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Category *
                    </label>
                    <select
                        value={formData.category}
                        onChange={e => handleInputChange('category', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#f59772] focus:border-transparent transition-all ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
                    >
                        <option value="">Select a category</option>
                        {categories.map(cat => (
                            <option key={cat._id} value={cat.name}>{cat.name}</option>
                        ))}
                    </select>
                    <ErrorMessage error={errors.category} />
                </div>
                {/* Product Title */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Product Title *
                    </label>
                    <input
                        type="text"
                        value={formData.productTitle}
                        onChange={(e) => handleInputChange('productTitle', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#f59772] focus:border-transparent transition-all ${errors.productTitle ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="Enter product title"
                    />
                    <ErrorMessage error={errors.productTitle} />
                </div>

                {/* Product Description */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Product Description *
                    </label>
                    <textarea
                        rows={4}
                        value={formData.productDescription}
                        onChange={(e) => handleInputChange('productDescription', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#f59772] focus:border-transparent transition-all ${errors.productDescription ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="Describe the product in detail"
                    />
                    <ErrorMessage error={errors.productDescription} />
                </div>

                {/* Product Photos */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-4">
                        Product Photos (Max 5)
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({ length: 5 }, (_, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Image {index + 1}</h4>
                                {formData.productPhotos[index] ? (
                                    <div className="relative">
                                        <img
                                            src={formData.productPhotos[index]}
                                            alt={`Product ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removePhoto(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <FileUpload
                                            onSuccess={(response) => handleImageUploadSuccess(index, response)}
                                            onProgress={(progress) => handleImageUploadProgress(index, progress)}
                                            FileType="image"
                                        />
                                        {uploadProgress[index] > 0 && uploadProgress[index] < 100 && (
                                            <div className="mt-2">
                                                <div className="bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-[#FF5F1F] h-2 rounded-full transition-all"
                                                        style={{ width: `${uploadProgress[index]}%` }}
                                                    ></div>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">{uploadProgress[index]}% uploaded</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <ErrorMessage error={errors.productPhotos} />
                </div>

                {/* Product Price */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Product Price *
                    </label>
                    <input
                        type="text"
                        value={formData.productPrice}
                        onChange={(e) => handleInputChange('productPrice', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#f59772] focus:border-transparent transition-all ${errors.productPrice ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="$99.99"
                    />
                    <ErrorMessage error={errors.productPrice} />
                </div>

                {/* Affiliate Link */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Affiliate Link *
                        </label>
                        <input
                            type="url"
                            value={formData.affiliateLink}
                            onChange={(e) => handleInputChange('affiliateLink', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#f59772] focus:border-transparent transition-all ${errors.affiliateLink ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="https://example.com/affiliate-link"
                        />
                        <ErrorMessage error={errors.affiliateLink} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Affiliate Link Text *
                        </label>
                        <input
                            type="text"
                            value={formData.affiliateLinkText}
                            onChange={(e) => handleInputChange('affiliateLinkText', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#f59772] focus:border-transparent transition-all ${errors.affiliateLinkText ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Buy on Amazon"
                        />
                        <ErrorMessage error={errors.affiliateLinkText} />
                    </div>
                </div>

                {/* Pros */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Pros *
                    </label>
                    {formData.pros.map((pro, index) => (
                        <div key={index} className="flex items-center gap-2 mb-2">
                            <input
                                type="text"
                                value={pro}
                                onChange={(e) => updatePro(index, e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f59772] focus:border-transparent transition-all"
                                placeholder={`Pro ${index + 1}`}
                            />
                            <button
                                type="button"
                                onClick={() => removePro(index)}
                                disabled={formData.pros.length === 1}
                                className="text-red-500 hover:text-red-700 transition-colors p-2 disabled:text-gray-400 disabled:cursor-not-allowed"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addPro}
                        className="flex items-center gap-2 text-lime-600 hover:text-lime-800 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add Pro
                    </button>
                    <ErrorMessage error={errors.pros} />
                </div>

                {/* Cons */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Cons *
                    </label>
                    {formData.cons.map((con, index) => (
                        <div key={index} className="flex items-center gap-2 mb-2">
                            <input
                                type="text"
                                value={con}
                                onChange={(e) => updateCon(index, e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f59772] focus:border-transparent transition-all"
                                placeholder={`Con ${index + 1}`}
                            />
                            <button
                                type="button"
                                onClick={() => removeCon(index)}
                                disabled={formData.cons.length === 1}
                                className="text-red-500 hover:text-red-700 transition-colors p-2 disabled:text-gray-400 disabled:cursor-not-allowed"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addCon}
                        className="flex items-center gap-2 text-lime-600 hover:text-lime-800 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add Con
                    </button>
                    <ErrorMessage error={errors.cons} />
                </div>

                {/* Reddit Reviews */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-4">
                        <MessageSquare className="inline w-5 h-5 mr-2" />
                        Reddit Reviews (JSON array, max 50)
                    </label>
                    <textarea
                        value={redditReviewsInput}
                        onChange={e => setRedditReviewsInput(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f59772] focus:border-transparent transition-all"
                        placeholder={`Paste JSON array of reviews here.\nExample:\n[\n  {\n    \"comment\": \"Great product!\",\n    \"tag\": \"positive\",\n    \"link\": \"https://reddit.com/...\",\n    \"author\": \"user123\",\n    \"subreddit\": \"subredditname\"\n  }\n]`}
                        rows={8}
                    />
                    <ErrorMessage error={errors.redditReviews} />
                </div>

                {/* Product Score */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Star className="inline w-5 h-5 mr-2" />
                        Product Score (0-100) *
                    </label>
                    <div className="flex items-center gap-4">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={formData.productScore}
                            onChange={(e) => handleInputChange('productScore', Number(e.target.value))}
                            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            style={{
                                background: `linear-gradient(to right, #a3e635 0%, #a3e635 ${formData.productScore}%, #e5e7eb ${formData.productScore}%, #e5e7eb 100%)`
                            }}
                        />
                        <span className="text-2xl font-bold text-lime-600 min-w-[3rem]">
                            {formData.productScore}
                        </span>
                    </div>
                    <ErrorMessage error={errors.productScore} />
                </div>

                {/* Product Rank */}
                <div className="pt-4 flex flex-col items-start">
                    <button
                        type="button"
                        onClick={() => {
                            calculateProductRank();
                        }}
                        className="bg-blue-500 cursor-pointer text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all mb-2"
                    >
                        Generate Product Rank{typeof formData.productRank === 'number' ? `: ${formData.productRank}%` : ''}
                    </button>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full bg-[#FF5F1F] text-white py-4 cursor-pointer px-6 rounded-lg font-semibold hover:bg-[#f59772] focus:ring-2 focus:ring-[#f59772] focus:ring-offset-2 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {isSubmitting ? 'Creating Post...' : 'Create Product Post'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductPostForm;
