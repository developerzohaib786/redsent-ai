import React, { useState } from 'react';
import { useRedditComments } from '../hooks/useRedditComments';
import { validateProductTitle } from '../utils/validation';

const ProductTitleInput: React.FC = () => {
    const [title, setTitle] = useState('');
    const { fetchComments } = useRedditComments();

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (validateProductTitle(title)) {
            fetchComments(title);
        } else {
            alert('Please enter a valid product title (up to three words).');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={title}
                onChange={handleInputChange}
                placeholder="Enter product title (max 3 words)"
            />
            <button type="submit">Get Comments</button>
        </form>
    );
};

export default ProductTitleInput;