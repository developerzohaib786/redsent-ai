import { useEffect, useState } from 'react';
import { analyzeSentiment } from '../services/sentimentApi';
import { Comment } from '../types/comment';

const useSentimentAnalysis = (comments: string[]) => {
    const [sentimentResults, setSentimentResults] = useState<Comment[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSentiment = async () => {
            setLoading(true);
            setError(null);
            try {
                const results = await Promise.all(comments.map(comment => analyzeSentiment(comment)));
                setSentimentResults(results);
            } catch (err) {
                setError('Error analyzing sentiment');
            } finally {
                setLoading(false);
            }
        };

        if (comments.length > 0) {
            fetchSentiment();
        }
    }, [comments]);

    return { sentimentResults, loading, error };
};

export default useSentimentAnalysis;