'use client';
import React, { useEffect, useState } from 'react';
import '@fontsource/sansita';
import SearchBanner from '@/components/ui/searchBanner';
import LikeButton from '@/components/ui/likeButton';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface Post {
  id: number;
  userId: number;
  locationName?: string;
  image: string;
  title: string;
  description?: string;
  likes: number;
}

interface User {
  profilePicture: string | null;
  name: string | null;
}

const HomePage = () => {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [users, setUsers] = useState<Record<number, User>>({});

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        if (response.ok) {
          const data: Post[] = await response.json();
          setPosts(data);

          // Fetch users for each post
          const uniqueUserIds = Array.from(new Set(data.map(post => post.userId)));
          const usersMap: Record<number, User> = {};

          await Promise.all(
            uniqueUserIds.map(async userId => {
              const userRes = await fetch(`/api/users/${userId}`);
              if (userRes.ok) {
                const userData = await userRes.json();
                usersMap[userId] = userData;
              }
            })
          );

          setUsers(usersMap);
        } else {
          console.error('Failed to fetch posts');
        }
      } catch (error) {
        console.error('An error occurred while fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

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
      <div style={{ marginLeft: '200px', paddingTop: '100px', padding: '20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '100px' }}>
          {posts.map(post => {
            const user = users[post.userId];
            return (
              <div
                key={post.id}
                style={{
                  backgroundColor: '#f9f9f9',
                  border: '1px solid #ccc',
                  borderRadius: '10px',
                  marginBottom: '30px',
                  padding: '20px',
                  fontFamily: "'Sansita', sans-serif",
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                }}
              >
                {/* User Info */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                  <img
                    src={user?.profilePicture || '/default-profile.png'}
                    alt={user?.name || 'User'}
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      marginRight: '15px',
                      objectFit: 'cover',
                    }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Link
                      href={`/profilePage/${post.userId}`}
                      style={{
                        color: 'black',
                        textDecoration: 'none',
                        outline: 'none',
                      }}
                    >
                      <strong
                        style={{
                          display: 'inline-block',
                          padding: '2px',
                          transition: 'outline 0.2s ease',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.outline = '2px solid black')}
                        onMouseLeave={e => (e.currentTarget.style.outline = 'none')}
                      >
                        {user?.name || 'Unknown User'}
                      </strong>
                    </Link>
                    <div style={{ fontSize: '12px', color: '#666' }}>{post.locationName}</div>
                  </div>
                </div>

                {/* Post Image */}
                <img
                  src={post.image}
                  alt={post.title}
                  style={{
                    width: '100%',
                    maxHeight: '400px',
                    objectFit: 'cover',
                    borderRadius: '10px',
                    marginBottom: '10px',
                  }}
                />

                {/* Post Content */}
                <h2 style={{ margin: '10px 0 5px' }}>{post.title}</h2>
                {post.description && <p>{post.description}</p>}

                {/* Likes + Like Button */}
                <LikeButton
                  post={post}
                  handleLike={handleLike}
                  liked={likedPosts.includes(post.id)}
                />

                {/* Read More Button */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Link href={`/individualPost/${post.id}`}>
                    <button
                      style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        backgroundColor: '#064789',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontFamily: "'Sansita', sans-serif",
                      }}
                    >
                      Read More
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default HomePage;
