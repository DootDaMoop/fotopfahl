'use client';

import React from 'react';

interface EditCommentBtnProps {
  commentId: number;
  onEdit: (commentId: number) => void; // Callback to notify the parent component
}

const EditCommentBtn: React.FC<EditCommentBtnProps> = ({ commentId, onEdit }) => {
  return (
    <button
      type="button"
      style={{
        backgroundColor: "blue",
        color: "white",
        padding: "5px 10px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontWeight: "bold",
      }}
      onClick={() => onEdit(commentId)} // Notify the parent component
    >
      Edit
    </button>
  );
};

export default EditCommentBtn;