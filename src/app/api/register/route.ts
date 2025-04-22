import { NextResponse } from 'next/server';
//import { hash } from 'bcrypt';

// temporary db
let users: Array<{
    id: string;
    username: string;
    email: string;
    password: string;
}> = [
    {
        id: '1',
        username: 'jkhots',
        email: 'jkhots@gmail.com',
        password: '123'
    },
];

export async function POST(req: Request) {
    try {
        const { username, email, password } = await req.json();

        if (!username || !email || !password) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        };
        // TODO: Refactor to include docker postgresdb
        const existingUser = users.find(
            (user) => user.username === username || user.email === email
        );

        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 409 });
        }

        //const hashedPassword = await hash(password, 10);

        const newUser = {
            id: Math.random().toString(36).substring(2, 15),
            username,
            email,
            password: password//hashedPassword,
        };
        users.push(newUser);

        return NextResponse.json({ message: 'User registered successfully',
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
            } }, { status: 201 });
    } catch (error) {
        console.error('Error registering user:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
};

// export temp db
export { users };
