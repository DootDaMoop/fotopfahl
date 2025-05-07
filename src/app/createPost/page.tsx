'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import SearchBanner from '@/components/ui/searchBanner';

const CreatePost = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); // Access query parameters
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    location: '',
    dataPermission: false,
  });
  const [albumFormData, setAlbumFormData] = useState({
    id: '',
    albumName: '',
    description: '',
    
  })

  // Pre-fill form data if query parameters are present
  useEffect(() => {
    const id = searchParams.get('id');
    const title = searchParams.get('title');
    const description = searchParams.get('description');
    const images = searchParams.get('images');
    const location = searchParams.get('location');
    const dataPermission = searchParams.get('dataPermission') === 'true';

    setFormData({
      id: id || '',
      title: title || '',
      description: description || '',
      location: location || '',
      dataPermission: dataPermission,
    });

    /*if (image) {
      setImageUrl(image);
    }*/
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      return;
    }
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const formData = new FormData();
        formData.append("file", file);
  
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
      
  
      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image');
      }
  
      const uploadData = await uploadResponse.json();
      console.log(uploadData);
  
      setImageUrls((prev) => [...prev, uploadData.secure_url]);
      } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload one or more images');
    }
  }
};

  const removeImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
  
    try {
      if (!formData.title) {
        setError('Please enter a title');
        setIsSubmitting(false);
        return;
      }
  
      const postData = {
        ...formData,
        images: imageUrls.length > 0 ? imageUrls : null,
        mapData: {
          lat: 0,
          lng: 0,
          location: formData.location || 'Unknown',
        },
      };
      console.log('Submitting post data:', postData);
  
      const apiUrl = formData.id ? `/api/posts/${formData.id}` : '/api/posts'; // Use the correct API route
      const method = formData.id ? 'PUT' : 'POST'; // Use PUT for editing, POST for creating
  
      const response = await fetch(apiUrl, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
  
      const responseData = await response.json();
      console.log('API response: ', responseData);
  
      if (!response.ok) {
        throw new Error(
          typeof responseData === 'string' ? responseData : 'Failed to create or update post'
        );
      }
  
      router.push('/homePage'); // Redirect to the homepage after success
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SearchBanner />
      <div style={{ padding: '20px', paddingLeft: '200px', paddingTop: '125px' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>
          {formData.id ? 'Edit Post' : 'Create a New Post'}
        </h1>
        {error && (
          <div style={{ color: 'red', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', maxWidth: '500px' }}
        >
          <div style={{ marginBottom: '20px' }}>
            <label>Upload Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              multiple
              style={{ marginTop: "5px" }}
            />
            <div>Click to upload</div>
            <div>Upload one or more photos for your post (OPTIONAL)</div>
            
            {imageUrls.length > 0 && (
              <div style={{ marginTop: "10px", display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {imageUrls.map((url, index) => (
                  <div key={index} style={{ position: "relative", width: "100px", height: "100px" }}>
                    <Image 
                      src={url} 
                      alt={`Preview ${index + 1}`} 
                      width={100}
                      height={100}
                      style={{ 
                        borderRadius: "5px",
                        objectFit: "cover"
                      }} 
                    />
                    <button 
                      type="button"
                      onClick={() => removeImage(index)}
                      style={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        background: "rgba(255, 0, 0, 0.7)",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "20px",
                        height: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer"
                      }}
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <label htmlFor="title" style={{ marginTop: '10px' }}>Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            style={{
              padding: '8px',
              marginTop: '5px',
              borderRadius: '5px',
              border: '1px solid #ccc',
            }}
          />

          <label htmlFor="description" style={{ marginTop: '15px' }}>Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            style={{
              padding: '8px',
              marginTop: '5px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              minHeight: '100px',
            }}
          />

          <label htmlFor="location" style={{ marginTop: '15px' }}>Location:</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            style={{
              padding: '8px',
              marginTop: '5px',
              borderRadius: '5px',
              border: '1px solid #ccc',
            }}
          />

          <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              id="dataPermission"
              name="dataPermission"
              checked={formData.dataPermission}
              onChange={handleChange}
              style={{ marginRight: '10px' }}
            />
            <label htmlFor="dataPermission">
              Allow Fotophal to access your photo&apos;s metadata (camera details, etc.)
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              marginTop: '20px',
              padding: '10px 15px',
              backgroundColor: isSubmitting ? '#cccccc' : '#064789',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontFamily: "'Sansita', sans-serif",
            }}
          >
            {isSubmitting ? (formData.id ? 'Updating Post...' : 'Creating Post...') : (formData.id ? 'Update Post' : 'Create Post')}
          </button>
        </form>
      </div>
{/* THIS IS FOR ALBUMS */}
      <div style={{ padding: '20px', paddingLeft: '200px', paddingTop: '125px' }}>
      <h1>Albums:</h1>
      <p>This is for if you want to post a high volume of images.</p>
        <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>
          {formData.id ? 'Edit Album' : 'Create a New Album'}
        </h1>
        {error && (
          <div style={{ color: 'red', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', maxWidth: '500px' }}
        >
          <div style={{ marginBottom: '20px' }}>
            <label>Upload Photos</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              multiple
              style={{ marginTop: "5px" }}
            />
            <div>Click to upload</div>
            <div>Upload one or more photos for your post (OPTIONAL)</div>
            
            {imageUrls.length > 0 && (
              <div style={{ marginTop: "10px", display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {imageUrls.map((url, index) => (
                  <div key={index} style={{ position: "relative", width: "100px", height: "100px" }}>
                    <Image 
                      src={url} 
                      alt={`Preview ${index + 1}`} 
                      width={100}
                      height={100}
                      style={{ 
                        borderRadius: "5px",
                        objectFit: "cover"
                      }} 
                    />
                    <button 
                      type="button"
                      onClick={() => removeImage(index)}
                      style={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        background: "rgba(255, 0, 0, 0.7)",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "20px",
                        height: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer"
                      }}
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <label htmlFor="title" style={{ marginTop: '10px' }}>Album Name:</label>
          <input
            type="text"
            id="albumName"
            name="albumName"
            value={formData.albumName}
            onChange={handleChange}
            style={{
              padding: '8px',
              marginTop: '5px',
              borderRadius: '5px',
              border: '1px solid #ccc',
            }}
          />

          <label htmlFor="description" style={{ marginTop: '15px' }}>Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            style={{
              padding: '8px',
              marginTop: '5px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              minHeight: '100px',
            }}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              marginTop: '20px',
              padding: '10px 15px',
              backgroundColor: isSubmitting ? '#cccccc' : '#064789',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontFamily: "'Sansita', sans-serif",
            }}
          >
            {isSubmitting ? (formData.id ? 'Updating Album...' : 'Creating Album...') : (formData.id ? 'Update Album' : 'Create Album')}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreatePost;