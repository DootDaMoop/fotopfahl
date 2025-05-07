'use client';

import React from 'react';

export default function ProfileForm({ userId, defaultName, defaultUsername }: {
  userId: string;
  defaultName?: string;
  defaultUsername?: string;
}) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const updatedData = {
      name: formData.get("name"),
      username: formData.get("username"),
      password: formData.get("password"),
      profilePicture: formData.get("profilePicture"),
    };

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const result = await response.json();
        alert("User updated successfully!");
        console.log(result);
      } else {
        alert("Failed to update user.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("An error occurred while updating the user.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", width: "300px" }}>
      <label htmlFor="name" style={{ marginTop: "15px" }}>Name:</label>
      <input type="text" id="name" name="name" defaultValue={defaultName || ""} />

      <label htmlFor="username" style={{ marginTop: "15px" }}>Username:</label>
      <input type="text" id="username" name="username" defaultValue={defaultUsername || ""} />

      <label htmlFor="password" style={{ marginTop: "15px" }}>Password:</label>
      <input type="password" id="password" name="password" />

      <label htmlFor="profilePicture" style={{ marginTop: "15px" }}>Profile Picture:</label>
      <input type="file" id="profilePicture" name="profilePicture" />

      <button type="submit" style={{
        marginTop: "20px",
        padding: "10px 15px",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}>
        Submit
      </button>
    </form>
  );
}
