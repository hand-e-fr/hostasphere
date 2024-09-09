import {useRouter} from "next/router";
import useSessionData from "@/hooks/profiler/useSessionData";
import SessionUsageChart from "@/components/dashboard/SessionUsageChart";
import {useEffect} from "react";
import ExecutionDiagram from "@/components/dashboard/diagram/ExecutionDiagram";

const Session: React.FC = () => {
    const router = useRouter();
    const {tokenId, sessionId} = router.query;
    const {session, functions, loading, error, fetchData} = useSessionData(tokenId as string, sessionId as string);

    useEffect(() => {
        if (tokenId && sessionId) {
            fetchData().then();
        }
    }, [tokenId, sessionId]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!session || !functions) return <p>No data available</p>;

    return (
        <>
            <div className="mb-4">
                <h1 className="text-2xl font-bold">
                    Session - {sessionId}
                </h1>
            </div>
            <div className="divider"></div>
            <div role="tablist" className="tabs tabs-bordered tabs-xl">
                <input type="radio" name="my_tabs_1" role="tab"
                       className="tab overflow-hidden min-w-[12em] whitespace-nowrap" aria-label="Usage"
                       defaultChecked/>
                <div role="tabpanel" className="tab-content mt-4 w-full">
                    <div className="min-w-full">
                        <SessionUsageChart session={session} functions={functions}/>
                    </div>
                </div>
                <input type="radio" name="my_tabs_1" role="tab"
                       className="tab overflow-hidden min-w-[12em] whitespace-nowrap" aria-label="Call Graph"/>
                <div role="tabpanel" className="tab-content mt-4 w-full">
                    <div className="min-w-full h-[500px]">
                        <ExecutionDiagram functionCallers={["main", "test"]}/>
                    </div>
                </div>
            </div>
            <div>
            </div>
        </>
    );
};

export default Session;