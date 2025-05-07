'use client';

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SearchBanner from "@/components/ui/searchBanner";
import Image from "next/image";
import exifr from "exifr";
import { useSession } from "next-auth/react";
import DeletePostBtn from "@/components/ui/deletePostBtn";
import { ChevronLeft, ChevronRight } from "lucide-react";

const IndividualPostPage: React.FC = () => {
  const { id } = useParams(); // Extract the post ID from the URL
  const router = useRouter(); // Initialize the router
  const [post, setPost] = useState<any>(null);
  const [exifData, setExifData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${id}`);
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched post:", data); // Verify the data format
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
        setLoading(false); // Ensure loading state is turned off
      }
    };

    fetchExifData();
  }, [post, currentImageIndex]);

  // Check if post data exists, if not display loading
  if (!post) {
    return <p>Loading post...</p>;
  }

  // Second Layer, if post data is not found
  if (!post) {
    return <p>Post not found</p>;
  }

  // Handle the camera data if it exists
  const handleCameraData = () => {
    if (!exifData) return null;
    const data = [];

    if (exifData.Make && exifData.Model) {
      data.push(`Camera: ${exifData.Make} ${exifData.Model}`);
    }
    if (exifData.LensModel) {
      data.push(`Lens: ${exifData.LensModel}`);
    }
    if (exifData.FocalLength) {
      data.push(`Focal Length: ${exifData.FocalLength}mm`);
    }
    if (exifData.FNumber) {
      data.push(`Aperture: f/${exifData.FNumber}`);
    }
    if (exifData.ISO) {
      data.push(`ISO: ${exifData.ISO}`);
    }
    if (exifData.ExposureTime) {
      data.push(`Exposure Time: ${exifData.ExposureTime} sec`);
    }

    if (data.length === 0) {
      return null;
    }

    return data;
  };

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
        <p>Location: {post.mapData.location}</p>
        <p style={{ fontSize: "16px", lineHeight: "1.5" }}>{post.description}</p>
  
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
              const queryParams = new URLSearchParams({
                id: post.id,
                title: post.title,
                description: post.description,
                image: post.image,
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
