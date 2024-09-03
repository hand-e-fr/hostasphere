import { useState, useEffect } from 'react';

interface FuncParam {
    arg: string;
    argname: string;
    type: string;
}

interface ReturnedValue {
    type: string;
    value: string;
}

interface ProfilerData {
    _id: string;
    cpuusage: number;
    endtime: number;
    executiontime: number;
    funcparams: FuncParam[];
    functioncaller: string;
    functionid: string;
    functionname: string;
    memoryusage: number;
    returnedvalue: ReturnedValue;
    starttime: number;
    tokenid: string;
}

interface UseProfilerDataResult {
    data: ProfilerData[] | null;
    loading: boolean;
    error: string | null;
}

const useProfilerData = (tokenId: string, sortFields: string[] = []): UseProfilerDataResult => {
    const [data, setData] = useState<ProfilerData[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const url = "http://localhost:8080";

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

        fetchData();
    }, [tokenId, sortFields]);

    return { data, loading, error };
};

export default useProfilerData;