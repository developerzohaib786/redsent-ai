import axios from 'axios';

const API_URL = 'https://api.example.com/sentiment'; // Replace with the actual sentiment analysis API URL

export interface SentimentResponse {
    sentiment: 'positive' | 'negative' | 'neutral';
}

export const analyzeSentiment = async (comments: string[]): Promise<{ text: string; sentiment: 'positive' | 'negative' | 'neutral' }[]> => {
    const results: { text: string; sentiment: 'positive' | 'negative' | 'neutral' }[] = [];

    for (const comment of comments) {
        try {
            const response = await axios.post<SentimentResponse>(API_URL, { text: comment });
            results.push({ text: comment, sentiment: response.data.sentiment });
        } catch (error) {
            console.error('Error analyzing sentiment:', error);
            results.push({ text: comment, sentiment: 'neutral' }); // Fallback to neutral on error
        }
    }

    return results;
};