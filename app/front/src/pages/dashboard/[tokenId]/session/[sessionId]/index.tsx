import {useRouter} from "next/router";
import useSessionData from "@/hooks/profiler/useSessionData";
import SessionUsageChart from "@/components/dashboard/SessionUsageChart";
import React, {useEffect, useState} from "react";
import ExecutionDiagram from "@/components/dashboard/diagram/ExecutionDiagram";
import Link from "next/link";
import {useTokenController} from "@/hooks/useTokenController";
import FuncCalls from "@/components/dashboard/step/FuncCalls";
import Loading from "@/components/Loading";

const Session: React.FC = () => {
    const router = useRouter();
    const {tokenId, sessionId} = router.query;
    const [tokenName, setTokenName] = useState<string | null>(null);
    const {fetchTokenNameFromId} = useTokenController();
    const {session, functions, loading, error, fetchData} = useSessionData(tokenId as string, sessionId as string);
    const [currentTab, setCurrentTab] = useState<string>(() => {
        if (router.asPath.includes('#diagram')) return 'diagram';
        if (router.asPath.includes('#func-calls')) return 'func-calls';
        return 'overview';
    });

    useEffect(() => {
        if (router.asPath.includes('#diagram')) {
            setCurrentTab('diagram');
        } else if (router.asPath.includes('#func-calls')) {
            setCurrentTab('func-calls');
        } else {
            setCurrentTab('overview');
        }
    }, [router.asPath]);

    useEffect(() => {
        if (tokenId && sessionId) {
            fetchData().then();
            fetchTokenNameFromId(tokenId as string).then((response) => {
                setTokenName(response);
            });
        }
    }, [tokenId, sessionId]);

    if (loading) return <Loading/>;
    if (error) return <p>Error: {error}</p>;
    if (!session) return <p>No data available</p>;

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
                        <li>{session && session.sessiontag}</li>
                    </ul>
                </div>
            </div>
            <div role="tablist" className="tabs tabs-bordered">
                <Link href={`/dashboard/${tokenId}/session/${sessionId}#overview`} role="tab" className={`tab ${currentTab === 'overview' ? 'tab-active' : ''}`}
                      onClick={() => setCurrentTab('overview')}>
                    <p>Overview</p>
                </Link>
                <Link href={`/dashboard/${tokenId}/session/${sessionId}#diagram`} role="tab" className={`tab ${currentTab === 'diagram' ? 'tab-active' : ''}`}
                      onClick={() => setCurrentTab('diagram')}>
                    <p>Call Diagram</p>
                </Link>
                <Link href={`/dashboard/${tokenId}/session/${sessionId}#func-calls`} role="tab" className={`tab ${currentTab === 'func-calls' ? 'tab-active' : ''}`}
                      onClick={() => setCurrentTab('func-calls')}>
                    <p>Func Calls</p>
                </Link>
            </div>
            {
                functions && <>
                    <div className={`min-w-full ${currentTab !== 'overview' && 'hidden'}`}>
                        <SessionUsageChart session={session} functions={functions} hideTrackAnnotations={false}/>
                    </div>
                    <div className={`h-[730px] ${currentTab !== 'diagram' && 'hidden'}`}>
                        <ExecutionDiagram profilerData={functions}/>
                    </div>
                    <div className={`min-w-full ${currentTab !== 'func-calls' && 'hidden'}`}>
                        <FuncCalls profilerData={functions} session={session}/>
                    </div>
                </>
            }
        </>
    );
};

export default Session;