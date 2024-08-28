import axios from 'axios';
import { useState } from 'react';

interface LoginResponse {
    token: string;
}

export const useAuthController = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const url = "http://localhost:8080";

    const login = async (email: string, password: string): Promise<LoginResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post<LoginResponse>(url + '/api/login', { email, password });
            return response.data;
        } catch (err: any) {
            setError(err.response?.data?.error || 'An error occurred');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const checkToken = async (): Promise<{ ok: boolean, email?: string, is_admin?: boolean, error?: string }> => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found');
            return { ok: false, error: 'No token found' };
        }

        try {
            const response = await axios.get<{ ok: boolean, email?: string, is_admin?: boolean, error?: string }>(url + '/api/login/test', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (err: any) {
            setError(err.response?.data?.error || 'An error occurred');
            return { ok: false, error: err.response?.data?.error || 'An error occurred' };
        } finally {
            setLoading(false);
        }
    }

    return { login, checkToken, loading, error };
};
