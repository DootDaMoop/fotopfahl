import React from 'react'

interface Post {
  id: number;
  likes: number;
}

interface LikeButtonProps {
  post: Post;
  handleLike: (id: number) => void;
  liked: boolean;
}

const LikeButton: React.FC<LikeButtonProps> = ({ post, handleLike, liked }) => (
    <div 
        style={{ 
            marginTop: "10px", 
            fontSize: "14px", 
            color: "#444" }}>
        ❤️ {post.likes} likes
        <button 
            onClick={() => handleLike(post.id)} disabled={liked} 
            style={{ 
                marginLeft: "10px", 
                padding: "5px 10px", 
                cursor: liked ? "not-allowed" : "pointer",
                borderRadius: "5px", 
                border: "none", 
                backgroundColor: liked ? "#ccc" : "#ef476f", 
                color: "white", 
                fontWeight: "bold"}}>
            {liked ? "Liked" : "Like"}
        </button>
    </div>
);  
export default LikeButton;  