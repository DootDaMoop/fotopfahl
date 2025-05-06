import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { error } from "console";

export async function POST(req: Request) {
    try {
        const data = await req.formData();
        const file = data.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileStr = buffer.toString("base64");
        const fileUri = `data:${file.type};base64,${fileStr}`;

        const uploadResponse = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload(
                fileUri,
                {
                    folder: 'fotopfhal',
                    resource_type: 'auto',
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );
        });
        return NextResponse.json(uploadResponse);
    } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}