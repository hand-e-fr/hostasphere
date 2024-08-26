import {useState} from 'react';
import {useRouter} from 'next/router';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
    };

    return (
        <div className="w-full max-w-md p-8 space-y-3 rounded-xl bg-base-100 shadow-md">
            <h1 className="text-2xl font-bold text-center">Register</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm">Username</label>
                    <input
                        type="text"
                        className="bg-base-200 w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
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
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;