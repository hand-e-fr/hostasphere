import { useRouter } from 'next/router';
import CompareSessionsChart from "@/components/dashboard/CompareSessionsChart";
import SessionInfo from "@/components/dashboard/session/SessionInfo";
import useCompareSessions from "@/hooks/session/useCompareSessions";
import {SessionData} from "@/types/SessionData";
import React, {useEffect, useState} from "react";

const CompareSessionsPage = () => {
    const router = useRouter();
    const { tokenId, session1, session2 } = router.query;
    const [sessionData1, setSessionData1] = useState<SessionData | null>(null);
    const [sessionData2, setSessionData2] = useState<SessionData | null>(null);

    const { data, loading, error } = useCompareSessions(tokenId as string, session1 as string, session2 as string);

    useEffect(() => {
        if (!data) return
        setSessionData1(data.session1.sessions[0]);
        setSessionData2(data.session2.sessions[0]);
    }, [data]);

    if (loading) return <p>Loading...</p>;

    if (error) return <p>Error: {error}</p>;

    if (!data) {
        return <p>No data available for comparison</p>;
    }

    return (
        <>
            <h1 className="text-2xl font-bold mb-6">Session Comparison</h1>

            {
                !loading && !error && sessionData1 && sessionData2 && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <SessionInfo session={sessionData1} comparedSession={sessionData2} sessionTitle="Session 1 Information" color="blue"/>
                            <SessionInfo session={sessionData2} comparedSession={sessionData1   } sessionTitle="Session 2 Information" color="red"/>
                        </div>

                        <div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <CompareSessionsChart
                                title="CPU Usage"
                                session1Data={sessionData1.cpuusage}
                                session2Data={sessionData2.cpuusage}
                            />

                            <CompareSessionsChart
                                title="Memory Usage"
                                session1Data={sessionData1.memoryusage}
                                session2Data={sessionData2.memoryusage}
                            />

                            {
                                sessionData1.tokensusage && sessionData2.tokensusage && (
                                    <CompareSessionsChart
                                        title="Tokens Usage"
                                        session1Data={sessionData1.tokensusage}
                                        session2Data={sessionData2.tokensusage}
                                    />
                                )
                            }

                            <CompareSessionsChart
                                title="Network Usage"
                                session1Data={sessionData1.networkusage}
                                session2Data={sessionData2.networkusage}
                            />
                        </div>
                    </>
                )
            }
        </>
    );
}

export default CompareSessionsPage;
