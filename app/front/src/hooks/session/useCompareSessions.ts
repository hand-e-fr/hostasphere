import { useState, useEffect } from 'react';
import {useAppContext} from "@/context/AppContext";
import {SessionData} from "@/types/SessionData";

export interface CompareSessionsData {
  session1: SessionData,
  session2: SessionData
}

const useCompareSessions = (
    tokenID: string,
    sessionUUID1: string,
    sessionUUID2: string
) => {
  const [data, setData] = useState<CompareSessionsData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { restUrl } = useAppContext();

  useEffect(() => {
    const fetchComparedSessions = async () => {
      if (!tokenID || !sessionUUID1 || !sessionUUID2) {
        setError('Missing required fields');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found');
        return;
      }

      setLoading(true);
      setError(null);

      const API_URL = `${restUrl}/api/profiler/compare-sessions?tokenid=${tokenID}&sessionuuid1=${sessionUUID1}&sessionuuid2=${sessionUUID2}`;

      try {
        const response = await fetch(API_URL, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'An unexpected error occurred.');
        }

        const result = await response.json();

        setData(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComparedSessions().then();
  }, [tokenID, sessionUUID1, sessionUUID2, restUrl]);

  return { data, loading, error };
};

export default useCompareSessions;
