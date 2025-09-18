import { useState, useEffect } from 'react';
import { fetchRedditComments } from '../services/redditApi';
import { analyzeSentiment } from '../services/sentimentApi';
import { Comment } from '../types/comment';

const useRedditComments = (productTitle: string) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchComments = async () => {
            setLoading(true);
            setError(null);
            try {
                const redditComments = await fetchRedditComments(productTitle);
                const analyzedComments = await Promise.all(
                    redditComments.map(async (comment) => {
                        const sentiment = await analyzeSentiment(comment.body);
                        return {
                            text: comment.body,
                            sentiment: sentiment,
                            link: `https://www.reddit.com${comment.permalink}`,
                        };
                    })
                );
                setComments(analyzedComments);
            } catch (err) {
                setError('Failed to fetch comments');
            } finally {
                setLoading(false);
            }
        };

        if (productTitle) {
            fetchComments();
        }
    }, [productTitle]);

    return { comments, loading, error };
};

export default useRedditComments;