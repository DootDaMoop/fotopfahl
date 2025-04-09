import React from 'react'

const Logo = () => {
  return (
    <>
        <img
          src="/favicon.ico" 
          alt="Favicon"
          style={{
            width: "120px", 
            height: "120px", 
            opacity: 0.8, 
            backgroundColor: "#D2E3F6", 
            borderRadius: "50%", 
            boxShadow: "0 0 10px rgba(210, 227, 246, 0.5)", 
          }}
        />
    </>
  )
}

export default Logo