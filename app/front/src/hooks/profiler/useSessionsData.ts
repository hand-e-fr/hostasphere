import { useEffect, useState } from 'react';
import {SessionData} from "@/types/SessionData";

interface UseSessionsResult {
    sessions: SessionData[] | null;
    loading: boolean;
    error: string | null;
}

const useSessions = (sortBy: string = '', limit: number = 10, page: number = 0): UseSessionsResult => {
    const [sessions, setSessions] = useState<SessionData[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const url = process.env.HS_REST_API_URL;

    useEffect(() => {
        const fetchSessions = async () => {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No token found');
                setLoading(false);
                return;
            }

            try {
                const queryParams = new URLSearchParams();
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

        fetchSessions();
    }, [sortBy, limit, page]);

    return { sessions, loading, error };
};

export default useSessions;
