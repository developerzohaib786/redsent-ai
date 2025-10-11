'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Use App Router's navigation hook in client components

export default function UpdatePostForm({ postId }: { postId: string }) {
    const router = useRouter();
    const [postData, setPostData] = useState({ title: '', content: '' });
    const [loading, setLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState('');

    // 1. Fetch the existing post data when the component mounts
    useEffect(() => {
        async function fetchPost() {
            // In a real application, you would make an API call here:
            // const response = await fetch(`/api/posts/${postId}`);
            // const data = await response.json();

            // --- Mock Fetching Logic ---
            setLoading(true);
            setTimeout(() => {
                // Simulate finding the post
                if (postId === '1' || postId === '2') {
                    setPostData({
                        title: `Existing Title for Post ${postId}`,
                        content: `Existing Content for Post ${postId}. Ready to edit.`,
                    });
                    setStatusMessage('');
                } else {
                    setStatusMessage('Error: Post not found.');
                }
                setLoading(false);
            }, 500);
            // --- End Mock Logic ---
        }

        if (postId) {
            fetchPost();
        }
    }, [postId]);

    interface PostData {
        title: string;
        content: string;
    }

    interface UpdatePostFormProps {
        postId: string;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPostData(prev => ({ ...prev, [name]: value }));
    };

    // 2. Handle the submission of the updated post
    // Removed unnecessary empty interface; use React.FormEvent<HTMLFormElement> directly

    interface UpdateError {
        message?: string;
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatusMessage('Updating post...');

        try {
            // In a real application, you would make an API call here:
            // const response = await fetch(`/api/posts/${postId}`, {
            //   method: 'PUT',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(postData),
            // });

            // if (!response.ok) throw new Error('Failed to update post');

            // --- Mock Update Success ---
            await new Promise<void>(resolve => setTimeout(resolve, 800));
            // --- End Mock Update Success ---

            setStatusMessage(`Successfully updated Post ID: ${postId}! Redirecting...`);

            // Redirect back to the all posts view after successful update
            setTimeout(() => {
                router.push('/dashboard/allposts');
            }, 1500);

        } catch (error) {
            const err = error as UpdateError;
            console.error('Update error:', error);
            setStatusMessage(`Update failed: ${err.message || 'An unknown error occurred'}`);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-48">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                <p className="ml-4 text-indigo-600">Loading post data...</p>
            </div>
        );
    }

    if (!postId || statusMessage.includes('Error')) {
        return <div className="text-center p-8 bg-red-100 text-red-700 rounded-lg">{statusMessage}</div>;
    }

    return (
        <div className="bg-white p-6 md:p-10 shadow-2xl rounded-xl max-w-2xl mx-auto">
            <h1 className="text-3xl font-extrabold mb-6 text-gray-900">
                Update Post <span className="text-indigo-600">#{postId}</span>
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Post Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={postData.title}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-sm"
                    />
                </div>

                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                        Content
                    </label>
                    <textarea
                        id="content"
                        name="content"
                        rows={8}
                        value={postData.content}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-sm"
                    ></textarea>
                </div>

                <button
                    type="submit"
                    disabled={statusMessage.includes('Updating')}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 disabled:bg-indigo-400"
                >
                    {statusMessage.includes('Updating') ? (
                        <span className="flex items-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Updating...
                        </span>
                    ) : (
                        'Save Changes'
                    )}
                </button>

                {statusMessage && (
                    <p className={`mt-4 text-center text-sm font-semibold ${statusMessage.includes('Success') ? 'text-green-600' : statusMessage.includes('Error') ? 'text-red-600' : 'text-gray-500'}`}>
                        {statusMessage}
                    </p>
                )}
            </form>
        </div>
    );
}
