export const formatComments = (comments) => {
    return comments.map(comment => ({
        text: comment.body,
        sentiment: comment.sentiment,
        link: `https://www.reddit.com${comment.permalink}`
    }));
};

export const formatTitle = (title) => {
    return title.trim().replace(/\s+/g, ' ');
};