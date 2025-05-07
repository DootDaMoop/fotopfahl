'use client';

import React from 'react';
import { useRouter } from 'next/navigation'; 
import { signOut } from 'next-auth/react';

interface DeleteUserBtnProps {
  userId: string;
}

const DeleteUserBtn: React.FC<DeleteUserBtnProps> = ({ userId }) => {
  const router = useRouter(); 

    function signout(arg0: { callbackUrl: string; }) {
        throw new Error('Function not implemented.');
    }

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
        const response = await fetch(`/api/users/${userId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('User deleted successfully!');
            await signOut({ callbackUrl: '/' });
        } else {
          alert('Failed to delete user.');
        }
      }}>
      Delete User
    </button>
  );
};

export default DeleteUserBtn;
