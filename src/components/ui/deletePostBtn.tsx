'use client';

import React from 'react';
import { useRouter } from 'next/navigation'; 

interface DeletePostBtnProps {
  postId: string;
}

const DeletePostBtn: React.FC<DeletePostBtnProps> = ({ postId }) => {
  const router = useRouter(); 

  return (
    <button
      type="button"
      style={{
        backgroundColor: "red",
        color: "white",
        padding: "10px 15px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontWeight: "bold",
      }}
      onClick={async () => {
        const response = await fetch(`/api/posts/${postId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('User deleted successfully!');
          router.push('/homePage');
        } else {
          alert('Failed to delete user.');
        }
      }}>
      Delete User
    </button>
  );
};

export default DeletePostBtn;