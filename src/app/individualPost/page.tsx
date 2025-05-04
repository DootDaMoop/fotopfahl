import React from "react";
import SearchBanner from "@/components/ui/searchBanner";
import Link from "next/link";

// Static user & post data (temporary — ideally from props or backend)
const users = [
  {
    id: 1,
    profilePicture: "https://randomuser.me/api/portraits/men/1.jpg",
    userName: "FCOhGoodHeavens",
    password: "abc",
    name: "Connor Ayscue",
  },
];

const initialPosts = [
  {
    id: 1,
    userId: 1,
    title: "Sunset in the Rockies",
    description: "Caught this view during a hike in Colorado.",
    image: "https://source.unsplash.com/600x400/?mountains,sunset",
    mapData: {
      lat: 39.7392,
      lng: -104.9903,
      locationName: "Rocky Mountains",
    },
    dataPermission: true,
    likes: 45,
  },
];

const IndividualPostPage: React.FC = () => {
  const post = initialPosts[0];
  const user = users.find((u) => u.id === post.userId);

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
          position: "relative", // enables absolute positioning inside
        }}
      >
  <div style={{ position: "relative" }}>
    {/* ✏️ Edit Button */}
    <Link href={`/createPost`}
  style={{
    position: "absolute",
    top: "0px",
    right: "0px", // 👈 move it to the right
    padding: "8px 14px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    zIndex: 1,
  }}>
  Edit
</Link>

    {/* The rest of your post content... */}
    {/* User Info, Image, Description, Likes, etc. */}
  </div>

        {/* User Info */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
          <img
            src={user?.profilePicture}
            alt={user?.name}
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
            <div style={{ fontSize: "13px", color: "#777" }}>{post.mapData.locationName}</div>
          </div>
        </div>

        {/* Post Image */}
        <img
          src={post.image}
          alt={post.title}
          style={{
            width: "100%",
            borderRadius: "10px",
            marginBottom: "20px",
            maxHeight: "500px",
            objectFit: "cover",
          }}
        />

        {/* Post Title & Description */}
        <h1 style={{ marginBottom: "10px" }}>{post.title}</h1>
        <p style={{ fontSize: "16px", lineHeight: "1.5" }}>{post.description}</p>

        {/* Likes */}
        <div style={{ marginTop: "20px", fontSize: "16px", color: "#444" }}>
          ❤️ {post.likes} likes
        </div>
      </div>
    </>
  );
};

export default IndividualPostPage;
