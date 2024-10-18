import {ProfilerData} from '@/types/ProfilerData';
import {useEffect, useState} from 'react';
import {useAppContext} from '@/context/AppContext';

export interface UseProfilerDataResult {
    data: ProfilerData[] | null;
    loading: boolean;
    error: string | null;
}

const useProfilerData = (tokenId: string, sortFields: string[] = [], limit: number = 0, id: string = "", functionName: string = ""): UseProfilerDataResult => {
    const [data, setData] = useState<ProfilerData[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const {restUrl} = useAppContext();

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
                if (limit > 0) {
                    queryParams.append('limit', limit.toString());
                }
                if (id) {
                    queryParams.append('id', id);
                }
                if (functionName) {
                    queryParams.append('functionName', functionName);
                }

                const response = await fetch(`${restUrl}/api/profiler?${queryParams.toString()}`, {
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
    }, []);

    return {data, loading, error};
};

export default useProfilerData;
