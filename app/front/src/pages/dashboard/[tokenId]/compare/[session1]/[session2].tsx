import { useRouter } from 'next/router';
import CompareSessionsChart from "@/components/dashboard/CompareSessionsChart";
import SessionInfo from "@/components/dashboard/session/SessionInfo";
import useCompareSessions from "@/hooks/session/useCompareSessions";

const CompareSessionsPage = () => {
    const router = useRouter();
    const { tokenId, session1, session2 } = router.query;

    const { data, loading, error } = useCompareSessions(tokenId as string, session1 as string, session2 as string);

    if (loading) return <p>Loading...</p>;

    if (error) return <p>Error: {error}</p>;

    if (!data) return <p>No data available for comparison</p>;

    return (
        <>
            <h1 className="text-2xl font-bold mb-6">Session Comparison</h1>

            {
                !loading && !error && data && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <SessionInfo session={data.session1} sessionTitle="Session 1 Information"/>
                        <SessionInfo session={data.session2} sessionTitle="Session 2 Information"/>
                    </div>
                )
            }

            <CompareSessionsChart
                session1Data={data.session1.sessions[0].memoryusage}
                session2Data={data.session2.sessions[0].memoryusage}
            />
        </>
    );
}

export default CompareSessionsPage;
