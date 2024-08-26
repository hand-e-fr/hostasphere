import axios from 'axios';
import { useState } from 'react';

interface LoginResponse {
    token: string;
}

export const useAuthController = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = async (email: string, password: string): Promise<LoginResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post<LoginResponse>('/api/login', { email, password });
            return response.data;
        } catch (err: any) {
            setError(err.response?.data?.error || 'An error occurred');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { login, loading, error };
};
