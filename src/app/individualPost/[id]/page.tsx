'use client';

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SearchBanner from "@/components/ui/searchBanner";
import Link from "next/link";
import Image from "next/image";
import exifr from "exifr";

const IndividualPostPage: React.FC = () => {
  const { id } = useParams(); // Extract the post ID from the URL
  const [post, setPost] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [exifData, setExifData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch the post data based on the ID
  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${id}`);
        const text = await response.text();
        console.log("Raw response text:", text);
        const data = JSON.parse(text);
        console.log("Parsed data:", data);
                
        if (response.ok) {
          const data = await response.json();
          setPost(data.post); 
        } else {
          console.log(id)
          console.log(response)
          console.error("Failed to fetch post");
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
        setLoading(false);
      }
    };

    fetchExifData();
  }, [post?.image]);

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
        {/* User Info */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
          <img
            src={user?.profilePicture || "/default-profile.png"}
            alt={user?.name || "User"}
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              marginRight: "15px",
              objectFit: "cover",
            }}
          />
          <div>
            <strong style={{ fontSize: "18px" }}>{user?.name || user?.userName}</strong>
            <div style={{ fontSize: "13px", color: "#777" }}>{post.mapData?.locationName}</div>
          </div>
        </div>

        {/* Post Image */}
        <Image
          src={post.image}
          alt={post.title}
          width="100"
          height="100"
          style={{
            width: "100%",
            height: "auto",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        />

        {/* Post Title & Description */}
        <h1 style={{ marginBottom: "10px" }}>{post.title}</h1>
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
      </div>
    </>
  );
};

export default IndividualPostPage;