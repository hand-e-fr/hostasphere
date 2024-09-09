import {ProfilerData} from '@/types/ProfilerData';
import {useEffect, useState} from 'react';

export interface UseProfilerDataResult {
    data: ProfilerData[] | null;
    loading: boolean;
    error: string | null;
}

const useProfilerData = (tokenId: string, sortFields: string[] = []): UseProfilerDataResult => {
    const [data, setData] = useState<ProfilerData[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const url = process.env.HS_REST_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No token found');
                setLoading(false);
                return false;
            }

            try {
                const queryParams = new URLSearchParams();
                queryParams.append('tokenid', tokenId);
                if (sortFields.length > 0) {
                    queryParams.append('sort', sortFields.join(','));
                }

                const response = await fetch(`${url}/api/profiler?${queryParams.toString()}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch profiler data');
                }

                const result: ProfilerData[] = await response.json();
                setData(result);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData().then();
    }, [tokenId, sortFields]);

    return {data, loading, error};
};

export default useProfilerData;
