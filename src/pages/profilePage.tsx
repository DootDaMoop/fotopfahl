import React, { useState } from "react";
import { AuthButton } from "@/components/ui/navigation-menu";
import '@fontsource/sansita';
import SearchBanner from "@/components/ui/searchBanner";
import LikeButton from "@/components/ui/likeButton";
import { BiBorderRadius } from "react-icons/bi";

// Static user data
const currentUser =
  {
    id: 1,
    profilePicture: "https://randomuser.me/api/portraits/men/1.jpg",
    userName: "FCOhGoodHeavens",
    password: "abc",
    name: "Connor Ayscue"
  };

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

const ProfilePage = () => {
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
      <SearchBanner />
      <div style={{ marginLeft: "200px", paddingTop: "100px", padding: "20px" }}>
        {/* Profile Information */}
        {currentUser && (
            <>
  <div style={{ display: "flex", alignItems: "center", marginBottom: "40px", paddingTop: "100px" }}>
    <img
      src={currentUser.profilePicture}
      alt={currentUser.name}
      style={{
        width: "80px",
        height: "80px",
        borderRadius: "50%",
        objectFit: "cover",
        marginRight: "20px"
      }}
    />
    <div>
      <h1 style={{ margin: 0 }}>{currentUser.name}</h1>
      <p style={{ color: "#666", margin: 0 }}>@{currentUser.userName}</p>
    </div>
  </div>

  <div style={{ padding: "20px" }}>
      <form style={{ display: "flex", flexDirection: "column", width: "300px" }}>
        <label htmlFor="name" style={{ marginTop: "10px" }}>Name:</label>
        <input type="text" id="name" name="name" value={currentUser.name}/>

        <label htmlFor="username" style={{ marginTop: "10px" }}>Username:</label>
        <input type="text" id="username" name="username" value={currentUser.userName}/>

        <label htmlFor="password" style={{ marginTop: "10px" }}>Password:</label>
        <input type="password" id="password" name="password" value={currentUser.password}/>

        <label htmlFor="profilePicture" style={{ marginTop: "10px" }}>Profile Picture:</label>
        <input type="file" id="profilePicture" name="profilePicture"/>

        <button type="submit" style={{ marginTop: "20px" }}>Submit</button>
      </form>
    </div>

  </>)}


        {/* Feed Container */}
        <div style={{ maxWidth: "800px", margin: "0 auto", paddingTop: "75px" }}>
            <h1 style={{paddingBottom: '10px'}}>Your Posts:</h1>
          {posts.filter(post => post.userId === 1).map((post) => {

            {/* THESE ARE THE INDIVIDUAL POSTS */}
            return (
              <div
                key={post.id}
                style={{
                  backgroundColor: "#f9f9f9",
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  marginBottom: "30px",
                  padding: "20px",
                  fontFamily: "'Sansita', sans-serif",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                }}
              >
                {/* User Info */}
                <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
                  <img
                    src={currentUser?.profilePicture}
                    alt={currentUser?.name || "User"}
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      marginRight: "15px",
                      objectFit: "cover",
                    }}
                  />
                  <div>
                    <strong>{currentUser?.name || currentUser?.userName}</strong>
                    <div style={{ fontSize: "12px", color: "#666" }}>{post.mapData.locationName}</div>
                  </div>
                </div>

                {/* Post Image */}
                <img
                  src={post.image}
                  alt={post.title}
                  style={{
                    width: "100%",
                    maxHeight: "400px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    marginBottom: "10px"
                  }}
                />

                {/* Post Content */}
                <h2 style={{ margin: "10px 0 5px" }}>{post.title}</h2>
                {post.description && <p>{post.description}</p>}

                {/* Likes + Like Button */}
                <LikeButton
                  post={post}
                  handleLike={handleLike}
                  liked={likedPosts.includes(post.id)}/>

              </div>
            );
          })}

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
export default ProfilePage;