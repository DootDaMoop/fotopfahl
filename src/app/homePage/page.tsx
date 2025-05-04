"use client";
import React, { useState } from "react";
import { AuthButton } from "@/components/ui/navigation-menu";
import '@fontsource/sansita';
import SearchBanner from "@/components/ui/searchBanner";
import LikeButton from "@/components/ui/likeButton";
import Link from "next/link";
import { useSession } from "next-auth/react";

// Static user data
const users = [
  {
    id: 1,
    profilePicture: "https://randomuser.me/api/portraits/men/1.jpg",
    userName: "FCOhGoodHeavens",
    password: "abc",
    name: "Connor Ayscue"
  },
  {
    id: 2,
    profilePicture: "https://randomuser.me/api/portraits/women/2.jpg",
    userName: "User1",
    password: "123",
    name: "Another User"
  }
];

// Static post data
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
      locationName: "Rocky Mountains"
    },
    dataPermission: true,
    likes: 45
  },
  {
    id: 2,
    userId: 2,
    title: "Downtown Vibes",
    description: null,
    image: "https://source.unsplash.com/600x400/?city,night",
    mapData: {
      lat: 34.0522,
      lng: -118.2437,
      locationName: "Los Angeles"
    },
    dataPermission: false,
    likes: 12
  }
];


  const HomePage = () => {
    const { data: session } = useSession();
    const [posts, setPosts] = useState(initialPosts);
    const [likedPosts, setLikedPosts] = useState<number[]>([]);

    const handleLike = (postId: number) => {
      if (likedPosts.includes(postId)) return;
    
      setPosts(prev =>
        prev.map(post =>
          post.id === postId ? { ...post, likes: post.likes + 1 } : post
        )
      );
    
      setLikedPosts(prev => [...prev, postId]);
    };

    return (
    <>
    {console.log("Session:", session?.user)}
      <SearchBanner/>

      <div style={{ marginLeft: "200px", paddingTop: "100px", padding: "20px" }}>
        {/* Feed Container */}
        <div style={{ maxWidth: "800px", margin: "0 auto", paddingTop: "100px" }}>
          {posts.map((post) => {
            const user = users.find((user) => user.id === post.userId);
            {/* THESE ARE THE INDIVIDUAL POSTS */}
            return (
              <div key={post.id}
                style={{
                  backgroundColor: "#f9f9f9",
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  marginBottom: "30px",
                  padding: "20px",
                  fontFamily: "'Sansita', sans-serif",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",}}>
                {/* User Info */}
                <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
                  <img
                    src={user?.profilePicture}
                    alt={user?.name || "User"}
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      marginRight: "15px",
                      objectFit: "cover",}}/>
                {/* Username is a link to /profilePage/:id */}
                  <div>
                    <Link href={`/profilePage/${user?.id}`} 
                      style={{ 
                        color: "black", 
                        textDecoration: "none", 
                        outline: "none",}}>
                      <strong style= {{ display: "inline-block", padding: "2px", transition: "outline 0.2s ease",}}
                        onMouseEnter={(e) => e.currentTarget.style.outline = "2px solid black"}
                        onMouseLeave={(e) => e.currentTarget.style.outline = "none"}>
                          {user?.name || user?.userName}
                      </strong>
                    </Link>
                    <div style={{ fontSize: "12px", color: "#666" }}>{post.mapData.locationName}</div>
                  </div>
                </div>

                {/* Post Image */}
                <img src={post.image} alt={post.title}
                  style={{
                    width: "100%",
                    maxHeight: "400px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    marginBottom: "10px"
                  }}/>

                {/* Post Content */}
                <h2 style={{ margin: "10px 0 5px" }}>{post.title}</h2>
                {post.description && <p>{post.description}</p>}

                {/* Likes + Like Button */}
                <LikeButton
                  post={post}
                  handleLike={handleLike}
                  liked={likedPosts.includes(post.id)}/>

                {/*  Read More Button  */}
<div style={{ display: "flex", justifyContent: "flex-end" }}>
<Link href={`/individualPost/${post.id}`}>

    <button
      style={{
        padding: "10px 20px",
        fontSize: "16px",
        backgroundColor: "#064789",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontFamily: "'Sansita', sans-serif",}}>
      Read More
    </button>
  </Link>
</div>
</div>);})}

          {/* Go Back Button */}
          <div style={{ textAlign: "center", marginTop: "30px" }}>
            <a href="/">
              <button style={{ padding: "10px 20px", fontSize: "16px" }}>
                Go Back to Initial Page
              </button>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
export default HomePage;