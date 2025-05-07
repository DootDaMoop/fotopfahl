import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(req: Request) {
    try {
        const { paramsToSign } = await req.json();

        const signature = cloudinary.utils.api_sign_request(
            paramsToSign,
            process.env.CLOUDINARY_API_SECRET as string
        );
        return NextResponse.json({ signature });
    } catch (error) {
        console.error('Error generating signature:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}