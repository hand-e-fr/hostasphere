import { useEffect, useState } from 'react';
import {SessionData} from "@/types/SessionData";

export interface GroupedSessionResponse {
    _id: string | { week: number; year: number };
    sessions: SessionData[];
}

interface UseGroupedSessionsResult {
    groupedSessions: GroupedSessionResponse[] | null;
    loading: boolean;
    error: string | null;
}

const useGroupedSessions = (groupBy: string, limit: number = 10, page: number = 0): UseGroupedSessionsResult => {
    const [groupedSessions, setGroupedSessions] = useState<GroupedSessionResponse[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const url = process.env.HS_REST_API_URL;

    useEffect(() => {
        const fetchGroupedSessions = async () => {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No token found');
                setLoading(false);
                return;
            }

            try {
                const queryParams = new URLSearchParams();
                queryParams.append('groupby', groupBy);
                queryParams.append('limit', limit.toString());
                queryParams.append('page', page.toString());

                const response = await fetch(`${url}/api/profiler/group-sessions?${queryParams.toString()}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch grouped sessions');
                }

                const result: GroupedSessionResponse[] = await response.json();
                setGroupedSessions(result);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGroupedSessions();
    }, [groupBy, limit, page]);

    return { groupedSessions, loading, error };
};

export default useGroupedSessions;