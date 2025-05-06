import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
    try {
        const data = await req.formData();
        const file = data.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        console.log("File received:", {
            name: file.name,
            type: file.type,
            size: file.size,
        });
        
        const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({ error: "File size exceeds 10 MB" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileStr = buffer.toString("base64");
        const fileUri = `data:${file.type};base64,${fileStr}`;

        try {
            const uploadResponse = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload(
                fileUri,
                {
                    folder: 'fotopfhal',
                    resource_type: 'auto',
                },
                (error, result) => {
                    if (error) {
                        console.error("Cloudinary upload error:", error);
                        reject(error);
                    } else {
                        resolve(result);
                    }
                })
            });
            console.log("Upload Successful:", uploadResponse);
            return NextResponse.json(uploadResponse);
        } catch (error) {
            console.error("Error uploading file:", error);
            return NextResponse.json({ error: "Server error processing upload" }, { status: 500 });
        }
    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}