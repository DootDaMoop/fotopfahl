'use client';

import React from 'react';

interface DeleteCommentBtnProps {
    // Existing properties
    commentId: any; // Add the commentId property
  }

const DeleteCommentBtn: React.FC<DeleteCommentBtnProps> = ({ commentId }) => {

  return (
    <button
      type="button"
      style={{
        backgroundColor: "red",
        color: "white",
        padding: "5px 10px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontWeight: "bold",
      }}
      onClick={async () => {
        const response = await fetch(`/api/comments/${commentId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('User deleted successfully!');
        } else {
          alert('Failed to delete user.');
        }
      }}>
      Delete
    </button>
  );
};

export default DeleteCommentBtn;