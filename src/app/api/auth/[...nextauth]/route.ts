import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { JWT } from 'next-auth/jwt';
import type { User, Session } from 'next-auth';
import * as userRepo from '@/db/repositories/users';


declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
        }
    }
    
    interface User {
        id: string;
        name?: string | null;
        email?: string | null;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id?: string;
    }
}

export const authOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID ?? '',
            clientSecret: process.env.GITHUB_SECRET ?? '',
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID ?? '',
            clientSecret: process.env.GOOGLE_SECRET ?? '',
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text', placeholder: 'jkhots' },
                email: { label: 'Email', type: 'text', placeholder: 'jkhots@gmail.com'},
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials)  {
                if ((!credentials?.username && !credentials?.email) || !credentials.password) {
                    return null;
                }

                const user = await userRepo.findUserByUsername(credentials.username ?? '') ||
                    await userRepo.findUserByEmail(credentials.email ?? '');

                if (!user) {
                    return null;
                }

                if (credentials.password !== user.password) {
                    return null;
                }

                return {
                    id: String(user.id),
                    name: user.userName,
                    email: user.email ?? null,
                }
            }
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === 'google') {
                const existingUser = await userRepo.findUserByUsername(user.name ?? '');
                if (!existingUser) {
                    const newUser = {
                        userName: user.name,
                        email: user.email,
                        password: null,
                        name: null,
                        profilePicture: profile.picture,
                        provider: account.provider
                    };
                    await userRepo.createUser(newUser);
                }
            }
            return true;
        },
        async jwt({ token, user }: { token: JWT; user: User }) {
            if (user) {
                return {
                    ...token,
                    id: user.id,
                    name: user.name,
                    email: user.email,
                };
            }
            return token;
        },
        async session({ session, token }: { session: Session; token: JWT }) {
            session.user = {
                ...session.user,
                id: token.id as string,
                name: token.name as string,
                email: token.email as string,
            };
            return session;
        },
        async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
            // Redirect to /homePage only after a successful sign-in
            if (url.startsWith(baseUrl)) {
                return '/homePage';
            }
            return url;
        }
    },
    session: {
        strategy: 'jwt' as const,
    }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };