import { NextResponse } from 'next/server';
import * as userRepo from '@/db/repositories/users.ts';

export async function POST(req: Request) {
    try {
        const { username, email, password } = await req.json();

        if (!username || !email || !password) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        };

        const existingUserUsername = await userRepo.findUserByUsername(username);
        const existingUserEmail = await userRepo.findUserByEmail(email);


        if (existingUserUsername || existingUserEmail) {
            return NextResponse.json({ error: 'User already exists' }, { status: 409 });
        }


        const newUser = {
            userName: username,
            email: email,
            password: password, 
            name: null,
            profilePicture: null,
            provider: 'credentials'
        };

        const createdUser = await userRepo.createUser(newUser);

        return NextResponse.json({
            message: 'User registered successfully',
            user: createdUser
        }, { status: 201 });
    } catch (error) {
        console.error('Error registering user:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
};