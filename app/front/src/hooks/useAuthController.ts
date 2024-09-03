import axios from 'axios';
import { useState } from 'react';

interface LoginResponse {
    token: string;
    needs_password_change: boolean;
}

interface CheckTokenResponse {
    ok: boolean;
    email?: string;
    is_admin?: boolean;
    error?: string;
}

export const useAuthController = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const url = "http://localhost:8080";

    const login = async (email: string, password: string): Promise<LoginResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post<LoginResponse>(`${url}/api/login`, { email, password });
            return response.data;
        } catch (err: any) {
            setError(err.response?.data?.error || 'An error occurred');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const firstConnect = async (new_password: string): Promise<LoginResponse | null> => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Need to login first');
            setLoading(false);
            return null;
        }

        try {
            const response = await axios.post<LoginResponse>(`${url}/api/login/first-connect`, { new_password },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
                );
            return response.data;
        } catch (err: any) {
            setError(err.response?.data?.error || 'An error occurred');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const checkToken = async (): Promise<CheckTokenResponse> => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found');
            setLoading(false);
            return { ok: false, error: 'No token found' };
        }

        try {
            const response = await axios.get<CheckTokenResponse>(`${url}/api/login/test`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data as CheckTokenResponse;
        } catch (err: any) {
            setError(err.response?.data?.error || 'An error occurred');
            return { ok: false, error: err.response?.data?.error || 'An error occurred' };
        } finally {
            setLoading(false);
        }
    }

    return { login, checkToken, loading, firstConnect, error };
};

export type { CheckTokenResponse };