import React, { useState } from 'react';
import ProductTitleInput from '../components/ProductTitleInput';
import CommentsList from '../components/CommentsList';
import CopyButton from '../components/CopyButton';
import { useRedditComments } from '../hooks/useRedditComments';

const RedditReviewsPage: React.FC = () => {
    const [productTitle, setProductTitle] = useState<string>('');
    const { comments, fetchComments } = useRedditComments();

    const handleTitleChange = (title: string) => {
        setProductTitle(title);
    };

    const handleFetchComments = () => {
        fetchComments(productTitle);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ width: '60%' }}>
                <CommentsList comments={comments} />
            </div>
            <div style={{ width: '35%' }}>
                <ProductTitleInput onTitleChange={handleTitleChange} onFetchComments={handleFetchComments} />
                <CopyButton comments={comments} />
            </div>
        </div>
    );
};

export default RedditReviewsPage;