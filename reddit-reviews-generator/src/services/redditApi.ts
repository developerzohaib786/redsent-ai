import axios from 'axios';
import { Comment } from '../types/comment';

const REDDIT_API_URL = 'https://www.reddit.com/r/all/comments.json';

export const fetchRedditComments = async (title: string): Promise<Comment[]> => {
    try {
        const response = await axios.get(REDDIT_API_URL, {
            params: {
                q: title,
                limit: 50,
            },
        });

        const comments = response.data.data.children.map((child: any) => ({
            text: child.data.body,
            sentiment: '', // This will be filled later by sentiment analysis
            link: `https://www.reddit.com${child.data.permalink}`,
        }));

        return comments;
    } catch (error) {
        console.error('Error fetching Reddit comments:', error);
        return [];
    }
};