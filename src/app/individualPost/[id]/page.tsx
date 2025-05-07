'use client';

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SearchBanner from "@/components/ui/searchBanner";
import Image from "next/image";
import exifr from "exifr";
import { useSession } from "next-auth/react";
import DeletePostBtn from "@/components/ui/deletePostBtn";
import DeleteCommentBtn from "@/components/ui/deleteCommentBtn";

const IndividualPostPage: React.FC = () => {
  const { id } = useParams(); // Extract the post ID from the URL
  const router = useRouter(); // Initialize the router
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]); // State for comments
  const [newComment, setNewComment] = useState(""); // State for the new comment
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null); // Track the comment being edited
  const [editingContent, setEditingContent] = useState<string>(""); // Track the content of the comment being edited
  const [exifData, setExifData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();

  // Fetch the post data based on the ID
  const isOwnPost = +(session?.user?.id ?? 0) === +(post?.userId ?? 0);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${id}`);
        if (response.ok) {
          const data = await response.json();
          setPost(data); // Assuming data contains the post
        } else {
          console.error("Failed to fetch post:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [id]);

  // Fetch comments for the post
  useEffect(() => {
    if (!id) return;

    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comments?postId=${id}`);
        if (response.ok) {
          const data = await response.json();

          // Fetch user details for each comment
          const commentsWithUserDetails = await Promise.all(
            data.map(async (comment: any) => {
              const userResponse = await fetch(`/api/users/${comment.userId}`);
              if (userResponse.ok) {
                const userData = await userResponse.json();
                return { ...comment, user: userData };
              }
              return comment; // Fallback to the original comment if user fetch fails
            })
          );

          setComments(commentsWithUserDetails); // Set comments with user details
        } else {
          console.error("Failed to fetch comments:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [id]);

  // Handle submitting a new comment
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    try {
      const response = await fetch(`/api/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newComment, postId: id }),
      });

      if (response.ok) {
        const comment = await response.json();

        // Fetch user details for the new comment
        const userResponse = await fetch(`/api/users/${comment.userId}`);
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setComments((prev) => [...prev, { ...comment, user: userData }]); // Add the new comment with user details
        } else {
          setComments((prev) => [...prev, comment]); // Fallback to the original comment
        }

        setNewComment(""); // Clear the textbox
      } else {
        console.error("Failed to submit comment:", response.statusText);
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  // Handle opening the edit text box
  const handleEditComment = (comment: any) => {
    setEditingCommentId(comment.id); // Set the comment being edited
    setEditingContent(comment.content); // Populate the text box with the comment content
  };

  // Handle saving the edited comment
  const handleSaveComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCommentId) return;

    try {
      const response = await fetch(`/api/comments/${editingCommentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editingContent }),
      });
      console.log(response)
      if (response.ok) {
        const updatedComment = await response.json();
        console.log(updatedComment)
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === editingCommentId ? { ...comment, content: updatedComment.content } : comment
          )
        );
        setEditingCommentId(null); // Clear editing state
        setEditingContent(""); // Clear the text box
      } else {
        console.log(response.json())
        console.error("Failed to update comment:", response.statusText);
      }

      return response.json();
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  // Handle canceling the edit
  const handleCancelEdit = () => {
    setEditingCommentId(null); // Clear editing state
    setEditingContent(""); // Clear the text box
  };

  // Fetch EXIF data for the post image
  useEffect(() => {
    if (!post?.image) return;

    const fetchExifData = async () => {
      try {
        const data = await exifr.parse(post.image);
        setExifData(data);
      } catch (error) {
        console.error("Error fetching EXIF data:", error);
      } finally {
        setLoading(false); // Ensure loading state is turned off
      }
    };

    fetchExifData();
  }, [post?.image]);

  // Check if post data exists, if not display loading
  if (!post) {
    return <p>Loading post...</p>;
  }

  return (
    <>
      <SearchBanner />
      <div
        style={{
          padding: "40px",
          fontFamily: "'Sansita', sans-serif",
          maxWidth: "800px",
          margin: "0 auto",
          paddingTop: "125px",
          position: "relative",
        }}
      >
        {/* Post Image */}
        <Image
          src={post.image}
          alt={post.title}
          width={800}
          height={600}
          style={{
            width: "100%",
            height: "auto",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        />

        {/* Post Title & Description */}
        <h1 style={{ marginBottom: "10px" }}>{post.title}</h1>
        <p>Location: {post.mapData.location}</p>
        <p style={{ fontSize: "16px", lineHeight: "1.5" }}>{post.description}</p>
        {isOwnPost && <DeletePostBtn postId={post.id} />}

        {/* Comments Section */}
        <div style={{ marginTop: "30px" }}>
          <h2>Comments</h2>
          <form onSubmit={handleCommentSubmit} style={{ marginBottom: "20px" }}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Leave a comment..."
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                marginBottom: "10px",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Submit
            </button>
          </form>

          {/* Display Comments */}
          {comments.length > 0 ? (
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {comments.map((comment, index) => (
                <li
                  key={index}
                  style={{
                    marginBottom: "10px",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    position: "relative", // Make the comment container relative
                  }}
                >
                  {/* Buttons at the Top-Right */}
                  {(() => {
                    const isOwnComment = +(session?.user?.id ?? 0) === +(comment.userId ?? 0);
                    if (isOwnComment) {
                      return (
                        <div style={{ position: "absolute", top: "10px", right: "10px", display: "flex", gap: "5px" }}>
                          <button
                            style={{
                              padding: "5px 10px",
                              backgroundColor: "#007bff",
                              color: "white",
                              border: "none",
                              borderRadius: "5px",
                              cursor: "pointer",
                            }}
                            onClick={() => handleEditComment(comment)}
                          >
                            Edit
                          </button>
                          <DeleteCommentBtn commentId={comment.id} />
                        </div>
                      );
                    }
                    return null;
                  })()}

                  {/* Comment Content */}
                  {editingCommentId === comment.id ? (
                    <div>
                      <textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "5px",
                          border: "1px solid #ccc",
                          marginBottom: "10px",
                        }}
                      />
                      <div style={{ display: "flex", gap: "10px" }}>
                        <button
                          onClick={handleSaveComment}
                          style={{
                            padding: "5px 10px",
                            backgroundColor: "green",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          style={{
                            padding: "5px 10px",
                            backgroundColor: "gray",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                        <img
                          src={comment.user?.profilePicture || "/default-profile.png"}
                          alt={comment.user?.name || "User"}
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            marginRight: "10px",
                            objectFit: "cover",
                          }}
                        />
                        <strong>{comment.user?.name || "Unknown User"}</strong>
                      </div>
                      <p style={{ margin: 0 }}>{comment.content}</p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No comments yet. Be the first to comment!</p>
          )}
        </div>

        {/* Likes */}
        <div style={{ marginTop: "20px", fontSize: "16px", color: "#444" }}>
          ❤️ {post.likes} likes
        </div>
      </div>
    </>
  );
};

export default IndividualPostPage;