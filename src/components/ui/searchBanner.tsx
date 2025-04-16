import React from 'react';
import Logo from './logo';
import { FaHome, FaPlusCircle, FaMapMarkerAlt, FaGlobe } from 'react-icons/fa';

const SearchBanner = () => {
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
                { icon: <FaPlusCircle size={40} />, label: "Post", link: "/createPage" },
                { icon: <FaMapMarkerAlt size={40} />, label: "Map", link: "/mapPage" },
                { icon: <FaGlobe size={40} />, label: "Explore", link: "/explorePage" },
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
          zIndex: 2,
          height: "100px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          boxSizing: "border-box",
          fontFamily: "'Sansita', sans-serif",
        }}>
        <div style={{ width: "50px" }}></div>

        {/* Search Bar */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            zIndex: 3,
          }}>

          <input
            type="text" placeholder="Search..." style={{
              padding: "10px",
              fontSize: "16px",
              border: "2px solid #064789",
              borderRadius: "5px",
              width: "300px",
              fontFamily: "'Sansita', sans-serif",
            }}/>

          <button 
            style={{ 
              padding: "10px 20px", 
              fontSize: "16px", 
              backgroundColor: "#064789", 
              color: "white", 
              border: "none", 
              borderRadius: "5px",
              cursor: "pointer",
              fontFamily: "'Sansita', sans-serif",
            }}>
            Search
          </button>
        </div>

        {/* Profile Picture on Right */}
        <div 
          style={{ 
            width: "50px", 
            height: "50px", 
            borderRadius: "50%", 
            overflow: "hidden", 
            border: "2px solid #064789",}}>
          <img src="/path/to/profile-picture.jpg" alt="Profile" 
            style={{ 
              width: "100%", 
              height: "100%", 
              objectFit: "cover",
            }}/>
        </div>
      </div>
    </>
  );
};

export default SearchBanner;
