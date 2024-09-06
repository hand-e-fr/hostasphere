import { useEffect, useState } from 'react';
import {SessionData} from "@/types/SessionData";
import {ProfilerData} from "@/types/ProfilerData";

export interface UseSessionDataResult {
    session: SessionData | null;
    functions: ProfilerData[] | null;
    loading: boolean;
    error: string | null;
}

const useSessionData = (tokenid: string | string[] | undefined, sessionuuid: string | string[] | undefined, sessionTag: string = ''): {
    fetchData: () => Promise<void>;
    functions: ProfilerData[] | null;
    session: SessionData | null;
    loading: boolean;
    error: string | null
} => {
    const [session, setSession] = useState<SessionData | null>(null);
    const [functions, setFunctions] = useState<ProfilerData[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const url = process.env.HS_REST_API_URL;

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
            if (typeof tokenid === "string") {
                queryParams.append('tokenid', tokenid);
            }
            if (sessionuuid && typeof sessionuuid === "string") {
                queryParams.append('sessionuuid', sessionuuid);
            } else if (sessionTag) {
                queryParams.append('sessiontag', sessionTag);
            } else {
                setError('Either sessionuuid or sessionTag must be provided');
                setLoading(false);
                return;
            }

            const response = await fetch(`${url}/api/profiler/session?${queryParams.toString()}`, {
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

    useEffect(() => {
        if (tokenid && (sessionuuid || sessionTag)) {
            fetchData().then();
        }
    }, [sessionuuid, sessionTag]);

    return { session, functions, loading, error, fetchData };
};

export default useSessionData;
