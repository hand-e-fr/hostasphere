import axios from 'axios';
import { useState } from 'react';

interface App {
    id: string;
    name: string;
    license: {
        id: string;
        secretId: string;
    };
}

export const useAppController = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getApp = async (id: string): Promise<App | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get<App>(`/api/app/${id}`);
            return response.data;
        } catch (err: any) {
            setError(err.response?.data?.error || 'An error occurred');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const updateApp = async (id: string, appData: Partial<App>): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            await axios.put(`/api/app/${id}`, appData);
            return true;
        } catch (err: any) {
            setError(err.response?.data?.error || 'An error occurred');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { getApp, updateApp, loading, error };
};