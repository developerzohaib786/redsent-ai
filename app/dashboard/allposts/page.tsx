"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FileUpload from '@/app/components/FileUpload';
import { IProduct } from '@/models/post';
import { Plus, X, MessageSquare } from 'lucide-react';

interface PostListProps { }

const AllPosts: React.FC<PostListProps> = () => {
    // ... existing AllPosts code remains the same ...
    const router = useRouter();
    const [posts, setPosts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
    const [updateLoading, setUpdateLoading] = useState<string | null>(null);
    const [editingPost, setEditingPost] = useState<IProduct | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    
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

    // Delete post - with better error handling
    const handleDelete = async (postId: string) => {
        if (!confirm('Are you sure you want to delete this post?')) {
            return;
        }

        try {
            setDeleteLoading(postId);

            console.log('Attempting to delete post with ID:', postId); // Debug log

            const response = await fetch(`/api/auth/post?id=${postId}`, {
                method: 'DELETE',
            });

            console.log('Delete response status:', response.status); // Debug log

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Delete error response:', errorData); // Debug log
                throw new Error(errorData.error || 'Failed to delete post');
            }

            const result = await response.json();
            console.log('Delete success result:', result); // Debug log

            // Remove post from state
            setPosts(prevPosts => {
                const newPosts = prevPosts.filter(post => post._id?.toString() !== postId);
                
                // Reset to first page if current page would be empty
                const newTotalPages = Math.ceil(newPosts.length / postsPerPage);
                if (currentPage > newTotalPages && newTotalPages > 0) {
                    setCurrentPage(1);
                }
                
                return newPosts;
            });
            alert('Post deleted successfully!');
        } catch (err) {
            console.error('Delete error:', err); // Debug log
            alert(err instanceof Error ? err.message : 'Failed to delete post');
        } finally {
            setDeleteLoading(null);
        }
    };

    // Handle update - open edit modal
    const handleUpdate = (post: IProduct) => {
        console.log('Opening edit modal for post:', post); // Debug log
        console.log('Reddit Reviews:', post.redditReviews); // Debug log
        setEditingPost(post);
        setShowEditModal(true);
    };

    // Update post using PUT request
    const handleUpdateSubmit = async (updatedData: Partial<IProduct>) => {
        if (!editingPost?._id) return;

        try {
            setUpdateLoading(editingPost._id.toString());
            const response = await fetch('/api/auth/post', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: editingPost._id,
                    ...updatedData
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update post');
            }

            const updatedPost = await response.json();

            // Update post in state
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post._id?.toString() === editingPost._id?.toString() ? updatedPost : post
                )
            );

            setShowEditModal(false);
            setEditingPost(null);
            alert('Post updated successfully!');
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to update post');
        } finally {
            setUpdateLoading(null);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    // Pagination calculations
    const totalPages = Math.ceil(posts.length / postsPerPage);
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const currentPosts = posts.slice(startIndex, endIndex);

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

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">All Posts</h1>
                <div className="space-y-4">
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                            <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">All Posts</h1>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <p className="text-red-600 mb-4">Error: {error}</p>
                    <button
                        onClick={fetchPosts}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 w-full flex justify-center">
            <div className="max-w-4xl w-full p-6 flex flex-col items-center">
                <div className="flex justify-between items-center mb-8 w-full">
                <h1 className="text-3xl font-bold text-gray-800">All Posts</h1>
                <div className="text-sm text-gray-500">
                    {posts.length > 0 && (
                        <>
                            Page {currentPage} of {totalPages} | 
                            Total: {posts.length} post{posts.length !== 1 ? 's' : ''}
                        </>
                    )}
                    {posts.length === 0 && 'No posts found'}
                </div>
            </div>

            {posts.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
                    <p className="text-gray-600 text-lg mb-4">No posts found</p>
                    <button
                        onClick={() => window.location.href = '/dashboard/addpost'}
                        className="bg-lime-400 text-white px-6 py-2 rounded-lg hover:bg-lime-500 transition-colors"
                    >
                        Create Your First Post
                    </button>
                </div>
            ) : (
                <div className="space-y-4 ">
                    {currentPosts.map((post) => (
                        <div
                            key={post._id?.toString()}
                            className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1 pr-4">
                                    {/* Post Title */}
                                    <h2 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">
                                        {post.productTitle}
                                    </h2>

                                    {/* Post Description */}
                                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 overflow-hidden w-[700px] overflow-clip">
                                        {post.productDescription}
                                    </p>

                                    {/* Post Meta Info */}
                                    <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                                        <button
                                            type="button"
                                            className="bg-blue-500 cursor-pointer text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors text-xs font-semibold"
                                            onClick={() => router.push(`/dashboard/allposts/view/${post._id}`)}
                                        >
                                            View Project
                                        </button>
                                        <span>
                                            {post.productPrice}
                                        </span>
                                        <span>
                                            {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Unknown date'}
                                        </span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col gap-2 ml-4">
                                    <button
                                        onClick={() => handleUpdate(post)}
                                        disabled={updateLoading === post._id?.toString()}
                                        className="bg-lime-400 cursor-pointer text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-lime-500 transition-colors min-w-[80px] disabled:opacity-50"
                                    >
                                        {updateLoading === post._id?.toString() ? 'Updating...' : 'Update'}
                                    </button>

                                    <button
                                        onClick={() => handleDelete(post._id?.toString() || '')}
                                        disabled={deleteLoading === post._id?.toString()}
                                        className="bg-red-600 text-white cursor-pointer px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[80px]"
                                    >
                                        {deleteLoading === post._id?.toString() ? 'Deleting...' : 'Delete'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination Component */}
            {posts.length > postsPerPage && (
                <div className="mt-8 flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center text-sm text-gray-600">
                        <span>
                            Showing {startIndex + 1} to {Math.min(endIndex, posts.length)} of {posts.length} posts
                        </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        {/* Previous Button */}
                        <button
                            onClick={goToPreviousPage}
                            disabled={currentPage === 1}
                            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                        >
                            Previous
                        </button>

                        {/* Page Numbers */}
                        <div className="flex space-x-1">
                            {Array.from({ length: totalPages }, (_, index) => {
                                const page = index + 1;
                                const isCurrentPage = page === currentPage;
                                
                                // Show first page, last page, current page, and pages around current
                                const shouldShow = 
                                    page === 1 || 
                                    page === totalPages || 
                                    (page >= currentPage - 1 && page <= currentPage + 1);

                                if (!shouldShow) {
                                    // Show ellipsis for gaps
                                    if (page === currentPage - 2 && currentPage > 3) {
                                        return <span key={page} className="px-2 py-1 text-gray-500">...</span>;
                                    }
                                    if (page === currentPage + 2 && currentPage < totalPages - 2) {
                                        return <span key={page} className="px-2 py-1 text-gray-500">...</span>;
                                    }
                                    return null;
                                }

                                return (
                                    <button
                                        key={page}
                                        onClick={() => goToPage(page)}
                                        className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                            isCurrentPage
                                                ? 'bg-lime-400 text-white border border-lime-400'
                                                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Next Button */}
                        <button
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages}
                            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && editingPost && (
                <EditPostModal
                    post={editingPost}
                    onClose={() => {
                        setShowEditModal(false);
                        setEditingPost(null);
                    }}
                    onSubmit={handleUpdateSubmit}
                    isLoading={updateLoading === editingPost._id?.toString()}
                />
            )}
            </div>
        </div>
    );
};

// Enhanced Edit Modal Component with Complete Form
const EditPostModal: React.FC<{
    post: IProduct;
    onClose: () => void;
    onSubmit: (data: Partial<IProduct>) => void;
    isLoading: boolean;
}> = ({ post, onClose, onSubmit, isLoading }) => {
    // Add state for redditReviews as a JSON string
    const [redditReviewsInput, setRedditReviewsInput] = useState(
        JSON.stringify(post.redditReviews || [], null, 2)
    );
    const [formData, setFormData] = useState({
        productTitle: post.productTitle || '',
        productDescription: post.productDescription || '',
        productPrice: post.productPrice || '',
        affiliateLink: post.affiliateLink || '',
        affiliateLinkText: post.affiliateLinkText || '',
        productScore: post.productScore || 50,
        pros: Array.isArray(post.pros) && post.pros.length > 0 ? post.pros : [''],
        cons: Array.isArray(post.cons) && post.cons.length > 0 ? post.cons : [''],
        productPhotos: post.productPhotos || [],
    });

    // Debug effect to check initial form data
    useEffect(() => {
        console.log('Form data initialized:', formData);
        console.log('Reddit reviews in form data:', formData.redditReviews);
    }, [formData]);

    // Pros functions
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

    // Cons functions
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let redditReviews: any[] = [];
        try {
            redditReviews = JSON.parse(redditReviewsInput);
        } catch {
            alert('Reddit reviews must be a valid JSON array.');
            return;
        }
        const cleanedData = {
            ...formData,
            pros: formData.pros.filter(pro => pro.trim() !== ''),
            cons: formData.cons.filter(con => con.trim() !== ''),
            redditReviews,
        };
        onSubmit(cleanedData);
    };


    // Remove image handler
    const handleRemoveImage = (idx: number) => {
        setFormData(prev => ({
            ...prev,
            productPhotos: prev.productPhotos.filter((_, i) => i !== idx)
        }));
    };

    // Add image handler
    const handleAddImage = (res: { url: string }) => {
        setFormData(prev => ({
            ...prev,
            productPhotos: [...prev.productPhotos, res.url]
        }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6">Edit Post</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Product Images */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Product Images</label>
                        <div className="flex gap-2 flex-wrap mb-2">
                            {formData.productPhotos && formData.productPhotos.length > 0 && (
                                formData.productPhotos.map((url, idx) => (
                                    <div key={idx} className="relative group">
                                        <img
                                            src={url}
                                            alt={`Product ${idx + 1}`}
                                            className="w-24 h-24 object-cover rounded border"
                                        />
                                        <button
                                            type="button"
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs opacity-80 hover:opacity-100"
                                            onClick={() => handleRemoveImage(idx)}
                                            title="Remove image"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                        <FileUpload
                            onSuccess={handleAddImage}
                            FileType="image"
                        />
                    </div>

                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Product Title *</label>
                            <input
                                type="text"
                                value={formData.productTitle}
                                onChange={(e) => setFormData(prev => ({ ...prev, productTitle: e.target.value }))}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Product Price *</label>
                            <input
                                type="text"
                                value={formData.productPrice}
                                onChange={(e) => setFormData(prev => ({ ...prev, productPrice: e.target.value }))}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500"
                                placeholder="$99.99"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Product Description *</label>
                        <textarea
                            value={formData.productDescription}
                            onChange={(e) => setFormData(prev => ({ ...prev, productDescription: e.target.value }))}
                            className="w-full p-3 border border-gray-300 rounded-lg h-24 focus:ring-2 focus:ring-lime-500"
                            required
                        />
                    </div>

                    {/* Affiliate Link Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Affiliate Link *</label>
                            <input
                                type="url"
                                value={formData.affiliateLink}
                                onChange={(e) => setFormData(prev => ({ ...prev, affiliateLink: e.target.value }))}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Affiliate Link Text *</label>
                            <input
                                type="text"
                                value={formData.affiliateLinkText}
                                onChange={(e) => setFormData(prev => ({ ...prev, affiliateLinkText: e.target.value }))}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500"
                                placeholder="Buy on Amazon"
                                required
                            />
                        </div>
                    </div>

                    {/* Product Score */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Product Score: <span className="text-lime-600 font-bold">{formData.productScore}/100</span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={formData.productScore}
                            onChange={(e) => setFormData(prev => ({ ...prev, productScore: parseInt(e.target.value) }))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            style={{
                                background: `linear-gradient(to right, #a3e635 0%, #a3e635 ${formData.productScore}%, #e5e7eb ${formData.productScore}%, #e5e7eb 100%)`
                            }}
                        />
                    </div>

                    {/* Pros Section */}
                    <div>
                        <label className="block text-sm font-medium mb-3">Pros *</label>
                        <div className="space-y-2">
                            {formData.pros.map((pro, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={pro}
                                        onChange={(e) => updatePro(index, e.target.value)}
                                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500"
                                        placeholder={`Pro ${index + 1}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removePro(index)}
                                        disabled={formData.pros.length === 1}
                                        className="text-red-500 hover:text-red-700 p-2 disabled:text-gray-400 disabled:cursor-not-allowed"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addPro}
                                className="flex items-center gap-2 text-lime-600 hover:text-lime-800 text-sm"
                            >
                                <Plus className="w-4 h-4" />
                                Add Pro
                            </button>
                        </div>
                    </div>

                    {/* Cons Section */}
                    <div>
                        <label className="block text-sm font-medium mb-3">Cons *</label>
                        <div className="space-y-2">
                            {formData.cons.map((con, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={con}
                                        onChange={(e) => updateCon(index, e.target.value)}
                                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500"
                                        placeholder={`Con ${index + 1}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeCon(index)}
                                        disabled={formData.cons.length === 1}
                                        className="text-red-500 hover:text-red-700 p-2 disabled:text-gray-400 disabled:cursor-not-allowed"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addCon}
                                className="flex items-center gap-2 text-lime-600 hover:text-lime-800 text-sm"
                            >
                                <Plus className="w-4 h-4" />
                                Add Con
                            </button>
                        </div>
                    </div>

                    {/* Reddit Reviews as JSON Array */}
                    <div>
                        <label className="block text-sm font-medium mb-3">
                            Reddit Reviews (JSON Array)
                        </label>
                        <textarea
                            value={redditReviewsInput}
                            onChange={e => setRedditReviewsInput(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 font-mono"
                            rows={8}
                            placeholder={`[
  {
    "comment": "Great product!",
    "tag": "positive",
    "link": "https://reddit.com/...",
    "author": "user123",
    "subreddit": "subredditName"
  }
]`}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Enter a JSON array of reviews. Each review should have <code>comment</code>, <code>tag</code>, <code>link</code>, <code>author</code>, and <code>subreddit</code>.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-6 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-lime-400 text-white rounded-lg hover:bg-lime-500 disabled:opacity-50 font-medium"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Updating...' : 'Update Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AllPosts;
