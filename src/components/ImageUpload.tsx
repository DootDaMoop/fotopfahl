'use client';
import { useCallback, useState } from "react";
import Image from "next/image";

interface ImageUploadProps {
    value: string;
    onChange: (value: string) => void;
    label: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, label }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) {
            return;
        }

        try {
            setIsUploading(true);
            setUploadError(null);

            const file = files[0];
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error || "Failed to upload image");
            }

            const data = await response.json();
            onChange(data.secure_url);
        } catch (error) {
            console.error("Upload error:", error);
            setUploadError("Failed to upload image. Please try again.");
        }
        setIsUploading(false);
    }, [onChange]);
    return (
        <div className="space-y-4 w-full">
            <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">{label}</label>
                <div className="relative cursor-pointer hover:opacity-70 transition border-2 border-dashed p-6 border-gray-300 flex flex-col justify-center items-center gap-4 text-gray-600">
                    <input type="file" accept="image/" onChange={handleUpload} className="hidden" id="image-upload"></input>
                    <label htmlFor="image-upload" className="cursor-pointer w-full h-full flex flex-col items-center">
                        {value ? (
                            <div className="relative w-full h-40">
                            <Image
                                fill
                                style={{ objectFit: 'cover' }}
                                src={value}
                                alt="Upload"
                            />
                            </div>
                            ) : (
                            <div className="flex flex-col items-center justify-center gap-2">
                            <div className="text-lg font-semibold">
                                {isUploading ? 'Uploading...' : 'Click to upload'}
                            </div>
                            <div className="text-sm text-gray-500">
                                Upload a photo for your post
                            </div>
                        </div>
                    )}
                    </label>
                </div>
                {uploadError && (
                    <div className="text-red-500 text-sm">
                        {uploadError}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ImageUpload;