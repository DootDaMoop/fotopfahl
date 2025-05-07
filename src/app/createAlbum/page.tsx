'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import SearchBanner from '@/components/ui/searchBanner';

const CreateAlbum = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        id: '',
        albumName: '',
        description: '',
    });

  // Pre-fill form data if query parameters are present
    useEffect(() => {
    const id = searchParams.get('id');
    const albumName = searchParams.get('albumName');
    const description = searchParams.get('description');
    const images = searchParams.get('images');

    setFormData({
        id: id || '',
        albumName: albumName || '',
        description: description || '',
    });

    if (images) {
        try {
        const parsedImages = JSON.parse(images);
        setImageUrls(Array.isArray(parsedImages) ? parsedImages : []);
        } catch (error) {
        console.error('Error parsing images:', error);
        }
    }
    }, [searchParams]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
        ...prev,
        [name]: value,
    }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
        return;
    }
    
    setIsSubmitting(true);
    
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
        console.log('Upload successful:', uploadData);

        setImageUrls((prev) => [...prev, uploadData.secure_url]);
        } catch (error) {
        console.error('Error uploading image:', error);
        setError('Failed to upload one or more images');
        }
    }
    
    setIsSubmitting(false);
    };

    const removeImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
        if (!formData.albumName) {
        setError('Please enter an album name');
        setIsSubmitting(false);
        return;
        }

        if (imageUrls.length === 0) {
        setError('Please upload at least one image');
        setIsSubmitting(false);
        return;
        }

        const albumData = {
        ...formData,
        images: imageUrls,
        };

        console.log('Submitting album data:', albumData);
  
        const apiUrl = formData.id ? `/api/albums/${formData.id}` : '/api/albums';
        const method = formData.id ? 'PUT' : 'POST';
  
        const response = await fetch(apiUrl, {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(albumData),
        });
  
        if (!response.ok) {
        const errorData = await response.json();
        console.error('API error:', errorData);
        throw new Error(
            typeof errorData.error === 'string' ? errorData.error : 'Failed to create or update album'
        );
        }

        const responseData = await response.json();
        console.log('API response:', responseData);

      // Redirect to album page after creation or update
        if (formData.id) {
            router.push(`/album/${formData.id}`);
        } else {
            router.push(`/album/${responseData.newAlbum.id}`);
        }
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
        <h1 style={{ fontSize: '24px', marginBottom: '20px', fontFamily: "'Sansita', sans-serif" }}>
          {formData.id ? 'Edit Album' : 'Create a New Album'}
        </h1>
        
        {error && (
          <div style={{ 
            color: 'white', 
            backgroundColor: '#d9534f', 
            padding: '10px', 
            borderRadius: '5px',
            marginBottom: '20px' 
          }}>
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            maxWidth: '600px',
            fontFamily: "'Sansita', sans-serif"
          }}
        >
          <div style={{ marginBottom: '25px' }}>
            <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>Album Images</h2>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              multiple
              style={{ 
                marginTop: "5px",
                padding: '8px',
                border: '1px dashed #ccc',
                borderRadius: '5px',
                width: '100%'
              }}
            />
            <div style={{ 
              marginTop: '10px', 
              fontSize: '14px', 
              color: '#666' 
            }}>
              Upload multiple photos for your album (at least one required)
            </div>
            
            {imageUrls.length > 0 && (
              <div style={{ 
                marginTop: "15px", 
                display: "flex", 
                flexWrap: "wrap", 
                gap: "15px" 
              }}>
                {imageUrls.map((url, index) => (
                  <div key={index} style={{ position: "relative", width: "120px", height: "120px" }}>
                    <Image 
                      src={url} 
                      alt={`Preview ${index + 1}`} 
                      width={120}
                      height={120}
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
                        width: "24px",
                        height: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        fontSize: "12px"
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="albumName" style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontWeight: 'bold'
            }}>
              Album Name:
            </label>
            <input
              type="text"
              id="albumName"
              name="albumName"
              value={formData.albumName}
              onChange={handleChange}
              placeholder="Enter album name"
              style={{
                padding: '12px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                width: '100%',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label htmlFor="description" style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontWeight: 'bold'
            }}>
              Description:
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your album (optional)"
              style={{
                padding: '12px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                width: '100%',
                minHeight: '120px',
                fontSize: '16px',
                resize: 'vertical'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: '14px 20px',
              backgroundColor: isSubmitting ? '#cccccc' : '#064789',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontFamily: "'Sansita', sans-serif",
              fontSize: '16px',
              fontWeight: 'bold',
              transition: 'background-color 0.3s'
            }}
          >
            {isSubmitting ? 
              (formData.id ? 'Updating Album...' : 'Creating Album...') : 
              (formData.id ? 'Update Album' : 'Create Album')}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateAlbum;