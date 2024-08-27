import axios from 'axios';
import { useState } from 'react';

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    password?: string;
    isAdmin: boolean;
    createdAt: number;
}

export const useUserController = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const url = "http://localhost:8080";

    const updateUser = async (id: string, userData: Partial<User>): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            await axios.put(`/api/user/${id}`, userData);
            return true;
        } catch (err: any) {
            setError(err.response?.data?.error || 'An error occurred');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (id: string): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            await axios.delete(`/api/user/${id}`);
            return true;
        } catch (err: any) {
            setError(err.response?.data?.error || 'An error occurred');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const getUser = async (): Promise<User | null> => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found');
            return null;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await axios.get<User>(url + '/api/user', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (err: any) {
            setError(err.response?.data?.error || 'An error occurred');
            return null;
        } finally {
            setLoading(false);
        }
    }

    return { updateUser, deleteUser, getUser, loading, error };
};

export default useUserController;
export type { User };
