import axios from 'axios';
import {useState} from 'react';

interface License {
    id: string;
    secretId: string;
}

export const useLicenseController = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateLicense = async (appId: string, licenseData: Partial<License>): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            await axios.put(`/api/app/${appId}/license`, licenseData);
            return true;
        } catch (err: any) {
            setError(err.response?.data?.error || 'An error occurred');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {updateLicense, loading, error};
};