'use client';
import React, { useEffect, useState } from 'react';
import Logo from './logo';
import { FaHome, FaPlusCircle, FaMapMarkerAlt, FaGlobe } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

const SearchBanner: React.FC = () => {
  const { data: session, status } = useSession();
  const [userId, setUserId] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      setUserId(session.user.id);
      if (session.user.image) {
        setProfilePicture(session.user.image);
      } else {
        const fetchUserProfile = async () => {
          try {
            const response = await fetch(`/api/user/${session.user.id}`);
            const data = await response.json();
            if (data && data.profilePicture) {
              setProfilePicture(data.profilePicture);
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
          }
        }
        fetchUserProfile();
      }
    }
  }, [session, status]);

  return (
    <>
      {/* Left Navigation Bar */}
      <div 
        style={{ 
          position: "fixed", 
          top: 0, 
          left: 0,
          width: "100px",
          height: "100vh",
          backgroundColor: "#D2E3F6",
          color: "#064789",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "20px 10px",
          zIndex: 3,
          fontFamily: "'Sansita', sans-serif",
        }}>
        <Logo/>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "100%",
          }}>
          <nav style={{ width: "100%" }}>
            <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
              {/* Nav Item Template */}
              {[
                { icon: <FaHome size={40} />, label: "Home", link: "/homePage" },
                { icon: <FaPlusCircle size={40} />, label: "Post", link: "/createPost" },
                { icon: <FaPlusCircle size={40} />, label: "Album", link: "/createAlbum" },
              ].map(({ icon, label, link }) => (
                <li key={label} style={{ marginBottom: "30px", textAlign: "center" }}>
                  <a
                    href={link}
                    style={{
                      color: "#064789",
                      textDecoration: "none",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      fontSize: "14px",
                    }}>
                    {icon}
                    <span style={{ marginTop: "5px" }}>{label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Top Search Banner */}
      <div
        style={{
          backgroundColor: "#D2E3F6",
          width: "calc(100% - 100px)",
          position: "fixed",
          top: 0,
          left: "100px",
          zIndex: 1000,
          height: "100px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          boxSizing: "border-box",
          fontFamily: "'Sansita', sans-serif",
        }}>
        <div style={{ width: "50px" }}></div>

        {/* Profile Picture on Right */}
        <div 
  style={{ 
    width: "50px", 
    height: "50px", 
    borderRadius: "50%", 
    overflow: "hidden", 
    border: "2px solid #064789",
  }}
>
  <Link href={`/profilePage/${userId}`}>
    <Image
      src={profilePicture || "/defaultProfile.png"}
      width={50}
      height={50}
      alt="Profile"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        cursor: "pointer",
      }}
    />
  </Link>
</div>

      </div>
    </>
  );
};

export default SearchBanner;
