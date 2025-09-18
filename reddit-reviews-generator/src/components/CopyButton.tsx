import React from 'react';

interface CopyButtonProps {
    comments: { text: string; sentiment: string; link: string }[];
}

const CopyButton: React.FC<CopyButtonProps> = ({ comments }) => {
    const handleCopy = () => {
        const commentsString = JSON.stringify(comments, null, 2);
        navigator.clipboard.writeText(commentsString)
            .then(() => {
                alert('Comments copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    };

    return (
        <button onClick={handleCopy}>
            Copy Comments
        </button>
    );
};

export default CopyButton;