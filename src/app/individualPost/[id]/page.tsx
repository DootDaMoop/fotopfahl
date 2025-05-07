'use client';

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SearchBanner from "@/components/ui/searchBanner";
import Image from "next/image";
import exifr from "exifr";
import { useSession } from "next-auth/react";
import DeletePostBtn from "@/components/ui/deletePostBtn";

const IndividualPostPage: React.FC = () => {
  const { id } = useParams(); // Extract the post ID from the URL
  const router = useRouter(); // Initialize the router
  const [post, setPost] = useState<any>(null);
  const [exifData, setExifData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();

  // Fetch the post data based on the ID
  const isOwnProfile = +(session?.user?.id ?? 0) === +(post?.userId ?? 0);
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

    return data;
  };

  const cameraData = handleCameraData();

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
  
        {post.dataPermission && (
          <div style={{ marginTop: "20px", fontSize: "16px", color: "#444" }}>
            <h2 style={{ marginBottom: "10px" }}>Camera Data</h2>
            {loading ? (
              <p>Loading camera data...</p>
            ) : (
              <ul style={{ listStyleType: "none", padding: 0 }}>
                {cameraData?.map((data: string, index: number) => (
                  <li key={index} style={{ marginBottom: "5px" }}>
                    {data}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
  
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
