import SearchBanner from '@/components/ui/searchBanner';
import React from 'react'

const createPost = () => {
  return (
    <>
        <SearchBanner/>
        <div style={{ padding: "20px", paddingLeft: '200px', paddingTop: '125px' }}>
      <form style={{ display: "flex", flexDirection: "column", width: "300px" }}>
        <label htmlFor="title" style={{ marginTop: "10px" }}>Title:</label>
        <input type="text" id="title" name="title"/>

        <label htmlFor="description" style={{ marginTop: "10px" }}>Description:</label>
        <input type="text" id="description" name="description" />

        <label htmlFor="picture" style={{ marginTop: "10px" }}>Picture:</label>
        <input type="file" id="picture" name="picture"/>

        <label htmlFor="location" style={{ marginTop: "10px" }}>Location:</label>
        <input type="text" id="location" name="location" />

        <label htmlFor="permission" style={{ marginTop: "10px" }}>File Grab Permission:</label>
        <p style={{marginTop: '-1px'}}>Do you consent to allow Fotophal to access your photo's file data to be able to include things such as camera brand on your post?</p>
        <input type="checkbox" id="permission" name="permission" />

        <button type="submit" style={{ marginTop: "20px" }}>Submit</button>
      </form>
    </div>
    </>
  )
}

export default createPost;