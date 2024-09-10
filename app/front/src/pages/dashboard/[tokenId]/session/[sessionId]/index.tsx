import {useRouter} from "next/router";
import useSessionData from "@/hooks/profiler/useSessionData";
import SessionUsageChart from "@/components/dashboard/SessionUsageChart";
import React, {useEffect, useState} from "react";
import ExecutionDiagram from "@/components/dashboard/diagram/ExecutionDiagram";
import Link from "next/link";
import {useTokenController} from "@/hooks/useTokenController";

const Session: React.FC = () => {
    const router = useRouter();
    const {tokenId, sessionId} = router.query;
    const [tokenName, setTokenName] = useState<string | null>(null);
    const {fetchTokenNameFromId} = useTokenController();
    const {session, functions, loading, error, fetchData} = useSessionData(tokenId as string, sessionId as string);

    useEffect(() => {
        if (tokenId && sessionId) {
            fetchData().then();
            fetchTokenNameFromId(tokenId as string).then((response) => {
                setTokenName(response);
            });
        }
    }, [tokenId, sessionId]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!session || !functions) return <p>No data available</p>;

    return (
        <>
            <div className="mb-4">
                <h1 className="text-2xl font-bold">
                    Dashboard
                </h1>
                <div className="breadcrumbs text-sm">
                    <ul>
                        <li><Link href={`/dashboard`}>Dashboard</Link></li>
                        <li><Link href={`/dashboard/${tokenId}`}>{tokenName && tokenName}</Link></li>
                        <li><Link href={`/dashboard/${tokenId}/sessions`}>sessions</Link></li>
                        <li>{session && session.sessiontag}</li>
                    </ul>
                </div>
            </div>
            <div className="divider"></div>
            <div role="tablist" className="tabs tabs-bordered tabs-xl">
                <input type="radio" name="my_tabs_1" role="tab"
                       className="tab overflow-hidden min-w-[12em] whitespace-nowrap" aria-label="Usage"
                       defaultChecked/>
                <div role="tabpanel" className="tab-content mt-4 w-full">
                    <div className="min-w-full">
                        <SessionUsageChart session={session} functions={functions} hideTrackAnnotations={false}/>
                    </div>
                </div>
                <input type="radio" name="my_tabs_1" role="tab"
                       className="tab overflow-hidden min-w-[12em] whitespace-nowrap" aria-label="Call Graph"/>
                <div role="tabpanel" className="tab-content mt-4 w-full">
                    <div className="min-w-full h-[1000px]">
                        <ExecutionDiagram profilerData={functions}/>
                    </div>
                </div>
            </div>
            <div>
            </div>
        </>
    );
};

export default Session;