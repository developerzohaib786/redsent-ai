export interface Comment {
    text: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    link: string;
}