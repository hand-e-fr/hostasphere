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
            <div className="min-w-full">
                <SessionUsageChart session={session} functions={functions} hideTrackAnnotations={false}/>
            </div>
            <div className="h-[640px]">
                <ExecutionDiagram profilerData={functions}/>
            </div>
        </>
    );
};

export default Session;