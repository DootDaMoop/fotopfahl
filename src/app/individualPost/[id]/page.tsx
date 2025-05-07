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
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState<string>("");
  const [exifData, setExifData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [locationCoordinates, setLocationCoordinates] = useState<{ lat: string; lon: string } | null>(null);
  const { data: session, status } = useSession();

  const isOwnPost = +(session?.user?.id ?? 0) === +(post?.userId ?? 0);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${id}`);
        if (response.ok) {
          const data = await response.json();
          setPost(data);
        } else {
          console.error("Failed to fetch post:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comments?postId=${id}`);
        if (response.ok) {
          const data = await response.json();
          const commentsWithUserDetails = await Promise.all(
            data.map(async (comment: any) => {
              const userResponse = await fetch(`/api/users/${comment.userId}`);
              if (userResponse.ok) {
                const userData = await userResponse.json();
                return { ...comment, user: userData };
              }
              return comment;
            })
          );
          setComments(commentsWithUserDetails);
        } else {
          console.error("Failed to fetch comments:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`/api/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment, postId: id }),
      });

      if (response.ok) {
        const comment = await response.json();
        const userResponse = await fetch(`/api/users/${comment.userId}`);
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setComments((prev) => [...prev, { ...comment, user: userData }]);
        } else {
          setComments((prev) => [...prev, comment]);
        }
        setNewComment("");
      } else {
        console.error("Failed to submit comment:", response.statusText);
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const handleEditComment = (comment: any) => {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
  };

  const handleSaveComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCommentId) return;

    try {
      const response = await fetch(`/api/comments/${editingCommentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editingContent }),
      });

      if (response.ok) {
        const updatedComment = await response.json();
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === editingCommentId ? { ...comment, content: updatedComment.content } : comment
          )
        );
        setEditingCommentId(null);
        setEditingContent("");
      } else {
        console.error("Failed to update comment:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingContent("");
  };

  useEffect(() => {
    if (!post?.image) return;

    const fetchExifData = async () => {
      try {
        const data = await exifr.parse(post.image);
        setExifData(data);
      } catch (error) {
        console.error("Error fetching EXIF data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExifData();
  }, [post?.image]);

  useEffect(() => {
    const fetchCoordinates = async () => {
      const location = post?.mapData?.location;
      if (!location?.trim()) return;

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`,
          {
            headers: {
              "User-Agent": "Fotopfhal (cayscue@uncc.edu)",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setLocationCoordinates({ lat: data[0].lat, lon: data[0].lon });
          }
        }
      } catch (error) {
        console.error("Failed to fetch coordinates:", error);
      }
    };

    fetchCoordinates();
  }, [post?.mapData?.location]);

  if (!post) return <p>Loading post...</p>;

  return (
    <>
      <SearchBanner />
      <div style={{ padding: "40px", fontFamily: "'Sansita', sans-serif", maxWidth: "800px", margin: "0 auto", paddingTop: "125px", position: "relative" }}>
        <Image
          src={post.image}
          alt={post.title}
          width={800}
          height={600}
          style={{ width: "100%", height: "auto", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
        />

        <h1 style={{ marginBottom: "10px" }}>{post.title}</h1>
        <p style={{ fontSize: "16px", lineHeight: "1.5" }}>{post.description}</p>
        {isOwnPost && <DeletePostBtn postId={post.id} />}

        {/* OpenStreetMap Embed */}
        {locationCoordinates ? (
          <div style={{ marginTop: "20px" }}>
            <h3>Location</h3>
            <iframe
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(locationCoordinates.lon) - 0.01}%2C${parseFloat(locationCoordinates.lat) - 0.01}%2C${parseFloat(locationCoordinates.lon) + 0.01}%2C${parseFloat(locationCoordinates.lat) + 0.01}&amp;layer=mapnik`}
              width="100%"
              height="400px"
              frameBorder="0"
              style={{ border: "none" }}
            />
            <br />
          </div>
        ) : (
          <p>No location available.</p>
        )}

        <div style={{ marginTop: "30px" }}>
          <h2>Comments</h2>
          <form onSubmit={handleCommentSubmit} style={{ marginBottom: "20px" }}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Leave a comment..."
              style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc", marginBottom: "10px" }}
            />
            <button type="submit" style={{ padding: "10px 20px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
              Submit
            </button>
          </form>

          {comments.length > 0 ? (
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {comments.map((comment, index) => (
                <li key={index} style={{ marginBottom: "10px", padding: "10px", border: "1px solid #ccc", borderRadius: "5px", position: "relative" }}>
                  {(() => {
                    const isOwnComment = +(session?.user?.id ?? 0) === +(comment.userId ?? 0);
                    if (isOwnComment) {
                      return (
                        <div style={{ position: "absolute", top: "10px", right: "10px", display: "flex", gap: "5px" }}>
                          <button style={{ padding: "5px 10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }} onClick={() => handleEditComment(comment)}>
                            Edit
                          </button>
                          <DeleteCommentBtn commentId={comment.id} />
                        </div>
                      );
                    }
                    return null;
                  })()}

                  {editingCommentId === comment.id ? (
                    <div>
                      <textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc", marginBottom: "10px" }}
                      />
                      <div style={{ display: "flex", gap: "10px" }}>
                        <button onClick={handleSaveComment} style={{ padding: "5px 10px", backgroundColor: "green", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
                          Save
                        </button>
                        <button onClick={handleCancelEdit} style={{ padding: "5px 10px", backgroundColor: "gray", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
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
                          style={{ width: "40px", height: "40px", borderRadius: "50%", marginRight: "10px", objectFit: "cover" }}
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

        <div style={{ marginTop: "20px", fontSize: "16px", color: "#444" }}>
          ❤️ {post.likes} likes
        </div>
      </div>
    </>
  );
};

export default IndividualPostPage;
