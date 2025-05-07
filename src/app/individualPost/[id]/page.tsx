'use client';

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SearchBanner from "@/components/ui/searchBanner";
import Image from "next/image";
import exifr from "exifr";
import { useSession } from "next-auth/react";
import DeletePostBtn from "@/components/ui/deletePostBtn";
import DeleteCommentBtn from "@/components/ui/deleteCommentBtn";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
      console.log(response)

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
        console.log()
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

  const getImages = () => {
    if (!post) return [];
    if (!post.images) return [];

    try {
      return typeof post.images === 'string' ? JSON.parse(post.images) : post.images;
    } catch (error) {
      console.error("Error parsing images:", error);
      return [];
    }
  };

  const goToNextImage = () => {
    setCurrentImageIndex((currentImageIndex + 1) % images.length);
  }

  const goToPreviousImage = () => {
    setCurrentImageIndex(currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1);
  }

  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
  }

  // Fetch EXIF data for the post image
  useEffect(() => {
    const images = getImages();
    if (!images || images.length === 0) return;

    const fetchExifData = async () => {
      try {
        setLoading(true);
        const data = await exifr.parse(images[currentImageIndex]);
        setExifData(data);
      } catch (error) {
        console.error("Error fetching EXIF data:", error);
        setExifData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchExifData();
  }, [post, currentImageIndex]);

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

  const isOwnProfile = +(session?.user?.id ?? 0) === +(post?.userId ?? 0);
  const images = getImages();

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

        {/* Post Images */}
        {images && images.length > 0 ? (
          <div>
            {/* Main image with improved styling and camera data overlay */}
            <div 
              style={{ 
                position: "relative",
                width: "100%", 
                height: "500px", 
                backgroundColor: "#f0f0f0",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                overflow: "hidden"
              }}>
              <Image
                src={images[currentImageIndex]}
                alt={`${post.title} - image ${currentImageIndex + 1}`}
                fill
                sizes="(max-width: 800px) 100vw, 800px"
                style={{
                  objectFit: "contain",
                  backgroundColor: "#f0f0f0"
                }}
                priority
              />
              
              {/* Camera data overlay box */}
              {post.dataPermission && exifData && (
                <div
                  style={{
                    position: "absolute",
                    left: "15px",
                    bottom: "15px",
                    backgroundColor: "rgba(0,0,0,0.7)",
                    color: "white",
                    padding: "10px",
                    borderRadius: "5px",
                    fontSize: "14px",
                    zIndex: 5,
                    maxWidth: "250px",
                    lineHeight: "1.4",
                    display: (
                      exifData.Model || 
                      exifData.FNumber || 
                      exifData.ExposureTime || 
                      exifData.ISO || 
                      exifData.FocalLength
                    ) ? "block" : "none"
                  }}
                >
                  {exifData.Model && (
                    <div style={{ marginBottom: "3px" }}>
                      {exifData.Model}
                    </div>
                  )}
                  {exifData.FNumber && exifData.ExposureTime && exifData.ISO && (
                    <div style={{ marginBottom: "3px" }}>
                      f/{exifData.FNumber.toFixed(1)} 1/{Math.round(1/exifData.ExposureTime)} ISO {exifData.ISO}
                    </div>
                  )}
                  {exifData.FocalLength && (
                    <div>
                      {Math.round(exifData.FocalLength)}mm
                    </div>
                  )}
                </div>
              )}
              
              {/* Image counter at bottom right */}
              {images.length > 1 && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    right: "10px",
                    backgroundColor: "rgba(0,0,0,0.6)",
                    color: "white",
                    padding: "5px 10px",
                    borderRadius: "15px",
                    fontSize: "14px",
                    zIndex: 5
                  }}
                >
                  {currentImageIndex + 1} / {images.length}
                </div>
              )}
              
              {/* Navigation arrows */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goToPreviousImage}
                    style={{
                      position: "absolute",
                      left: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      backgroundColor: "rgba(0,0,0,0.6)",
                      color: "white",
                      borderRadius: "50%",
                      width: "40px",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "none",
                      cursor: "pointer",
                      zIndex: 5,
                    }}
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={24}/>
                  </button>
                  <button
                    onClick={goToNextImage}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      backgroundColor: "rgba(0,0,0,0.6)",
                      color: "white",
                      borderRadius: "50%",
                      width: "40px",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "none",
                      cursor: "pointer",
                      zIndex: 5,
                    }}
                    aria-label="Next image"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>
            
            {/* Thumbnail gallery */}
            {images.length > 1 && (
              <div style={{ 
                display: "flex", 
                gap: "10px", 
                marginTop: "10px", 
                overflowX: "auto",
                padding: "5px 0"
              }}>
                {images.map((img: string, idx: number) => (
                  <div
                    key={idx}
                    onClick={() => selectImage(idx)}
                    style={{
                      width: "60px",
                      height: "60px",
                      position: "relative",
                      cursor: "pointer",
                      opacity: currentImageIndex === idx ? 1 : 0.6,
                      border: currentImageIndex === idx ? "2px solid #064789" : "2px solid transparent",
                      borderRadius: "5px",
                      overflow: "hidden",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      sizes="60px"
                      style={{
                        objectFit: "cover",
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div style={{ 
            width: "100%", 
            height: "300px", 
            backgroundColor: "#f0f0f0", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            borderRadius: "10px" 
          }}>
            <p>No image available</p>
          </div>
        )}
        
        {/* Post Title & Description */}
        <h1 style={{ marginBottom: "10px" }}>{post.title}</h1>
        <p style={{ fontSize: "16px", lineHeight: "1.5" }}>{post.description}</p>

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
  
        {/* Likes */}
        <div style={{ marginTop: "20px", fontSize: "16px", color: "#444" }}>
          ❤️ {post.likes} likes
        </div>
        {isOwnProfile && (
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginBottom: "20px" }}>
          <button
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "14px",
            }}
            onClick={() => {
              const images = post.images ? (typeof post.images === 'string' ? JSON.parse(post.images) : post.images) : [];

              const queryParams = new URLSearchParams({
                id: post.id,
                title: post.title,
                description: post.description,
                images: JSON.stringify(images),
                location: post.mapData?.location || '',
                dataPermission: post.dataPermission ? 'true' : 'false',
              }).toString();

              router.push(`/createPost?${queryParams}`);
            }}
          >
            Edit Post
          </button>
                  <DeletePostBtn postId={post.id} />
                </div>
              )}
            </div>
          </>
  );
};

export default IndividualPostPage;
