import React from 'react'
import Logo from './logo'

const SignInBanner = () => {
  return (
    <>
    {/* Top Banner */}
  <div
  style={{
  backgroundColor: "#D2E3F6",
  padding: "20px", 
  width: "100%",
  position: "fixed", 
  top: 0,
  left: 0, 
  zIndex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between", 
  height: "100px", 
  }}>

{/* Favicon and Title */}
<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
  <Logo/> {/*  Made Favicon into a separate component  */}
  <div style={{ display: "flex", flexDirection: "column" }}>
    <span
      className="title"
      style={{
        fontSize: "48px",
        fontWeight: "bold",
        color: "#064789",
        fontFamily: "'Sansita', sans-serif", 
      }}>
      Fotophal
    </span>
    <p
      className="subtitle"
      style={{
        fontSize: "20px",
        fontWeight: "bold",
        color: "#064789",
        margin: 0,
        fontFamily: "'Sansita', sans-serif",
      }}>
      A photo sharing application for photographers
    </p>
  </div>
</div>
</div>
</>
  )
}

export default SignInBanner