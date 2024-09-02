import axios from 'axios';
import { useState } from 'react';

interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    password?: string;
    is_admin: boolean;
    created_at: number;
    needs_password_change: boolean;
}

interface Users {
    users: User[];
    total: number;
}

interface CreateUserRequest {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
}

export const useUserController = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const url = "http://localhost:8080";

    const updateUser = async (id: string, userData: Partial<User>): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            await axios.put(`${url}/api/user/${id}`, userData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
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
            await axios.delete(`${url}/api/user/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
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
            const response = await axios.get<User>(`${url}/api/user`, {
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

    const getUserById = async (id: string): Promise<User | null> => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found');
            return null;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await axios.get<User>(`${url}/api/user/${id}`, {
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
    };

    const getUsers = async (page: number, limit: number): Promise<Users | null> => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found');
            return null;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await axios.request({
                method: 'GET',
                url: `${url}/api/users`,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    page: page,
                    limit: limit
                }
            });
            return response.data as Users;
        } catch (err: any) {
            setError(err.response?.data?.error || 'An error occurred');
            return null;
        } finally {
            setLoading(false);
        }
    }

    const createUser = async (userData: CreateUserRequest): Promise<boolean> => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found');
            return false;
        }

        setLoading(true);
        setError(null);
        try {
            await axios.post(`${url}/api/register/user`, userData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            return true;
        } catch (err: any) {
            setError(err.response?.data?.error || 'An error occurred');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { updateUser, deleteUser, getUser, getUserById, getUsers, createUser, loading, error };
};

export default useUserController;
export type { User };
export type { Users };
export type { CreateUserRequest };
