import axios from 'axios';
import { useState } from 'react';

interface User {
    id: string;
    email: string;
    fullName: string;
    lastName: string;
    password?: string;
    isAdmin: boolean;
}

export const useUserController = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

    return { updateUser, deleteUser, loading, error };
};