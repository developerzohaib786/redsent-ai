import React from 'react';
import { Comment } from '../types/comment';

interface CommentCardProps {
  comment: Comment;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment }) => {
  return (
    <div className="comment-card">
      <p>{comment.text}</p>
      <span className={`sentiment-tag ${comment.sentiment}`}>{comment.sentiment}</span>
      <a href={comment.link} target="_blank" rel="noopener noreferrer">View on Reddit</a>
    </div>
  );
};

export default CommentCard;