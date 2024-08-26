import React, {useContext, useState} from 'react';
import {useRouter} from 'next/router';
import {UserContext, UserContextType} from "@/context/UserContext";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('/api/account/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error);
            }

            const data = await res.json();
            localStorage.setItem('token', data.token);
            await router.push('/').then(
                () => window.location.reload(),
            );
        } catch (err: any) {
            setError(err.message);
        }
    };

    const goRegisterPage = () => {
        router.push("/register").then();
    }

    return (
        <div className="w-full max-w-md p-8 space-y-3 rounded-xl bg-base-100 shadow-md">
            <h1 className="text-2xl font-bold text-center">Login</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm">Email</label>
                    <input
                        type="email"
                        className="bg-base-200 w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm">Password</label>
                    <input
                        type="password"
                        className="bg-base-200 w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button type="submit" className="btn btn-secondary w-full">
                    Login
                </button>
            </form>
            <button className="btn btn-link mt-6 text-secondary w-full text-center" onClick={goRegisterPage}>Not registered yet? Register now</button>
        </div>
    );
};

export default Login;