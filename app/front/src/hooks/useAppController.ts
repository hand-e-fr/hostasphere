import axios from 'axios';
import {useContext, useState} from 'react';
import { AppContext, AppContextType } from '@/context/AppContext';

export interface RegisterAppRequest {
    name: string;
    license: {
        id: string;
        secret: string;
    };
    admin_user: {
        email: string;
        first_name: string;
        last_name: string;
        password: string;
    };
}

export interface App {
    id: string;
    name: string;
    license: {
        id: string;
        secret: string;
    };
}

export interface RegisterAppResponse {
    ok: boolean;
    error: string | null;
}

export const useAppController = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const {restUrl} = useContext<AppContextType>(AppContext);

    const getApp = async (): Promise<App | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get<App>(`${restUrl}/api/app`);
            return response.data;
        } catch (err: any) {
            setError(err.response?.data?.error || 'An error occurred');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const updateApp = async (appData: Partial<RegisterAppRequest>): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            await axios.put(`${restUrl}/api/app`, appData);
            return true;
        } catch (err: any) {
            setError(err.response?.data?.error || 'An error occurred');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const registerApp = async (appData: Partial<RegisterAppRequest>): Promise<RegisterAppResponse> => {
        setLoading(true);
        setError(null);
        try {
            await axios.request({
                url: `${restUrl}/api/register/app`,
                method: 'POST',
                data: appData,
            });
            return {ok: true, error: null};
        } catch (err: any) {
            setError(err.response?.data?.message || err.response?.data?.error || 'An error occurred');
            return {ok: false, error: err.response?.data?.message || 'An error occurred'};
        } finally {
            setLoading(false);
        }
    }

    const fetchIsAppInitialized = async (): Promise<boolean> => {
        setLoading(true);
        setError(null);
        let isInit = false;

        try {
            await axios.get(`${restUrl}/api/app/isInitialized`).then(
                response => {
                    isInit = response.data.initialized;
                }
            );
            setError(null);
            return isInit.valueOf();
        } catch (err: any) {
            setError(err.response?.data?.error || 'An error occurred');
            return false;
        } finally {
            setLoading(false);
        }
    }

    return {getApp, updateApp, registerApp, fetchIsAppInitialized, loading, error};
};