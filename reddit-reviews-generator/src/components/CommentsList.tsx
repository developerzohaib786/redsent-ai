import React from 'react';
import CommentCard from './CommentCard';
import { Comment } from '../types/comment';

interface CommentsListProps {
  comments: Comment[];
}

const CommentsList: React.FC<CommentsListProps> = ({ comments }) => {
  return (
    <div className="comments-list">
      {comments.map((comment, index) => (
        <CommentCard key={index} comment={comment} />
      ))}
    </div>
  );
};

export default CommentsList;