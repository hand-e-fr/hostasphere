import {useEffect, useState} from 'react';
import {SessionData} from "@/types/SessionData";
import {getRestApiUrl} from "@/utils/apiUrl";

interface UseSessionsResult {
    sessions: SessionData[] | null;
    loading: boolean;
    error: string | null;
}

const useSessions = (tokenid: string, sortBy: string = '', limit: number = 10, page: number = 0): UseSessionsResult => {
    const [sessions, setSessions] = useState<SessionData[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSessions = async () => {
            const url = await getRestApiUrl();

            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No token found');
                setLoading(false);
                return;
            }

            try {
                const queryParams = new URLSearchParams();
                queryParams.append('tokenid', tokenid);
                if (sortBy) {
                    queryParams.append('sortby', sortBy);
                }
                queryParams.append('limit', limit.toString());
                queryParams.append('page', page.toString());

                const response = await fetch(`${url}/api/profiler/sessions?${queryParams.toString()}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch sessions');
                }

                const result = await response.json();
                setSessions(result);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSessions().then();
    }, [sortBy, limit, page]);

    return {sessions, loading, error};
};

export default useSessions;
