export interface RedditComment {
    id: string;
    body: string;
    permalink: string;
    created_utc: number;
}

export interface RedditResponse {
    data: {
        children: {
            data: RedditComment;
        }[];
    };
}