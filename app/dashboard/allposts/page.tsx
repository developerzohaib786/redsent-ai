"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface IRedditReview {
    comment: string;
    tag: 'positive' | 'negative' | 'neutral';
    link: string;
    author?: string;
    subreddit?: string;
}

interface IProduct {
    _id?: string;
    productTitle: string;
    productDescription: string;
    productPrice: string;
    affiliateLink: string;
    affiliateLinkText: string;
    productScore: number;
    productPhotos: string[];
    redditReviews?: IRedditReview[];
    createdAt?: string;
}

const AllPosts: React.FC = () => {
    const router = useRouter();
    const [posts, setPosts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

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

            console.log('Attempting to delete post with ID:', postId);

            const response = await fetch(`/api/auth/post?id=${postId}`, {
                method: 'DELETE',
            });

            console.log('Delete response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Delete error response:', errorData);
                throw new Error(errorData.error || 'Failed to delete post');
            }

            const result = await response.json();
            console.log('Delete success result:', result);

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
            console.error('Delete error:', err);
            alert(err instanceof Error ? err.message : 'Failed to delete post');
        } finally {
            setDeleteLoading(null);
        }
    };

    // Handle update - redirect to update page
    const handleUpdate = (postId: string) => {
        router.push(`/dashboard/allposts/update/${postId}`);
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
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
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
                            className="bg-[#FF5F1F] text-white px-6 py-2 rounded-lg hover:bg-[#f59772] transition-colors cursor-pointer"
                        >
                            Create Your First Post
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
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
                                            onClick={() => handleUpdate(post._id?.toString() || '')}
                                            className="bg-[#FF5F1F] cursor-pointer text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#f59772] transition-colors min-w-[80px]"
                                        >
                                            Update
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
                                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white cursor-pointer"
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
                                            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${isCurrentPage
                                                ? 'bg-[#FF5F1F] text-white border border-[#FF5F1F]'
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
                                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white cursor-pointer"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllPosts;