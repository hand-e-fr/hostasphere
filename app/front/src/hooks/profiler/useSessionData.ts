import { useEffect, useState } from 'react';
import {SessionData} from "@/types/SessionData";
import {ProfilerData} from "@/types/ProfilerData";

export interface UseSessionDataResult {
    session: SessionData | null;
    functions: ProfilerData[] | null;
    loading: boolean;
    error: string | null;
}

const useSessionData = (sessionUUID: string, sessionTag: string = ''): UseSessionDataResult => {
    const [session, setSession] = useState<SessionData | null>(null);
    const [functions, setFunctions] = useState<ProfilerData[] | null>(null);
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
                return;
            }

            try {
                const queryParams = new URLSearchParams();
                if (sessionUUID) {
                    queryParams.append('sessionuuid', sessionUUID);
                } else if (sessionTag) {
                    queryParams.append('sessiontag', sessionTag);
                } else {
                    setError('Either sessionUUID or sessionTag must be provided');
                    setLoading(false);
                    return;
                }

                const response = await fetch(`${url}/session?${queryParams.toString()}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch session data');
                }

                const result = await response.json();
                setSession(result.session);
                setFunctions(result.functions);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [sessionUUID, sessionTag]);

    return { session, functions, loading, error };
};

export default useSessionData;
