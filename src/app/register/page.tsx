'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import SignInBanner from '@/components/ui/sign-in-banner';

export default function RegisterPage() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const username = formData.get('username')?.toString() || '';
        const email = formData.get('email')?.toString() || '';
        const password = formData.get('password')?.toString() || '';

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Could not register user');
            }

            const result = await signIn('credentials', {
                username,
                email,
                password,
                redirect: true,
                callbackUrl: '/homePage',
            });

            if (result?.error) {
                setError('Registration successful, but sign-in failed. Please try again.');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <SignInBanner/>
        <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', marginTop: '135px',}}>
            <h2 style={{textAlign: 'center'}}>Register</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form
                onSubmit={handleSubmit}
                style={{
                    padding: '20px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    outline: '2px solid rgba(0, 0, 0, 0.1)',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                    boxSizing: 'border-box',
                }}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="username" style={{ display: 'block', fontSize: '16px', marginBottom: '5px', textAlign: 'left' }}>
                        Username
                    </label>
                    <input type="text" name="username" required style={{ width: '100%', padding: '8px', fontSize: '14px', display: 'block', boxSizing: 'border-box' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="email" style={{ display: 'block', fontSize: '16px', marginBottom: '5px', textAlign: 'left' }}>
                        Email
                    </label>
                    <input type="email" name="email" required style={{ width: '100%', padding: '8px', fontSize: '14px', display: 'block', boxSizing: 'border-box' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="password" style={{ display: 'block', fontSize: '16px', marginBottom: '5px', textAlign: 'left' }}>
                        Password
                    </label>
                    <input type="password" name="password" required style={{ width: '100%', padding: '8px', fontSize: '14px', display: 'block', boxSizing: 'border-box' }} />
                </div>
                <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', fontSize: '16px', backgroundColor: '#064789', color: 'white', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '10px', borderRadius: '4px' }}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
        </>
    );
}