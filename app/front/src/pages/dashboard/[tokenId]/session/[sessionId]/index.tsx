import {useRouter} from "next/router";
import useSessionData from "@/hooks/profiler/useSessionData";
import SessionUsageChart from "@/components/dashboard/SessionUsageChart";
import React, {useEffect, useState} from "react";
import ExecutionDiagram from "@/components/dashboard/diagram/ExecutionDiagram";
import Link from "next/link";
import {useTokenController} from "@/hooks/useTokenController";
import FuncCalls from "@/components/dashboard/step/FuncCalls";
import Loading from "@/components/Loading";
import {useAppContext} from "@/context/AppContext";
import ScienceIcon from '@mui/icons-material/Science';

const Session: React.FC = () => {
    const {authInfo} = useAppContext();
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

    if (!authInfo || !authInfo.ok || loading) return <Loading/>;
    if (error) return <p>Error: {error}</p>;
    if (!session) return <p>No data available</p>;

    return (
        <>
            <div className="mb-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <button className="btn btn-info text-white" onClick={() => router.push(`/dashboard/${tokenId}/session/${sessionId}/experiments`)}>
                        <ScienceIcon className="mr-2"/>
                        Experiments
                    </button>
                </div>
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
            <div className="pt-5">
                {
                    functions && <>
                        <div className={`min-w-full ${currentTab !== 'overview' && 'hidden'}`}>
                            <div className="mr-2 grid grid-cols-1 gap-4 xl:grid-cols-2">
                                <div className="bg-white shadow rounded-lg mt-3">
                                    <div className="overflow-auto mt-3">
                                        <table className="table table-xs">
                                            <tbody>
                                            <tr><td>Session ID</td><td>{session.sessionuuid}</td></tr>
                                            <tr><td>Session Tag</td><td>{session.sessiontag}</td></tr>
                                            <tr><td>Start Date</td><td>{new Date(session.startdate).toLocaleDateString()}</td></tr>
                                            <tr><td>End Date</td><td>{new Date(session.enddate).toLocaleDateString()}</td></tr>
                                            <tr><td>Execution Time</td><td>{session.executiontime} seconds</td></tr>
                                            <tr><td>Hostname</td><td>{session.hostname}</td></tr>
                                            <tr><td>OS</td><td>{session.os}</td></tr>
                                            <tr><td>OS Version</td><td>{session.osversion}</td></tr>
                                            <tr><td>Processor</td><td>{session.processor}</td></tr>
                                            <tr><td>Kernel Version</td><td>{session.kernelversion}</td></tr>
                                            <tr><td>Python Version</td><td>{session.pythonversion}</td></tr>
                                            <tr><td>Boot Time</td><td>{session.boottime}</td></tr>
                                            <tr><td>CPU Count</td><td>{session.cpucount}</td></tr>
                                            <tr><td>Current User</td><td>{session.currentuser}</td></tr>
                                            <tr><td>PID</td><td>{session.pid}</td></tr>
                                            <tr><td>Architecture</td><td>{session.architecture}</td></tr>
                                            {
                                                session.totaltokens && (
                                                    <tr>
                                                        <td>Total Used Tokens</td>
                                                        <td className="flex gap-3 items-center">
                                                            {session.totaltokens}
                                                            <div className="badge badge-accent badge-outline">openhosta</div>
                                                        </td>
                                                    </tr>
                                                )
                                            }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="p-4 bg-white shadow rounded-lg mt-3">
                                    <h3 className="mb-4">Chart showing the usage of CPU, Disk, Memory and Network over
                                        time:</h3>
                                    <SessionUsageChart session={session} functions={functions}
                                                       hideTrackAnnotations={false}
                                                       targetUsages={['cpu', 'disk', 'memory']}/>
                                </div>
                                <div className="p-4 bg-white shadow rounded-lg mt-3">
                                    <h3 className="mb-4">Chart showing the usage of Network over time (in KB):</h3>
                                    <SessionUsageChart session={session} functions={functions}
                                                       hideTrackAnnotations={false}
                                                       targetUsages={['network']}/>
                                </div>
                                {
                                    session.tokensusage && (
                                        <div className="p-4 bg-white shadow rounded-lg mt-3">
                                            <h3 className="mb-4">Token usage over time:</h3>
                                            <SessionUsageChart session={session} functions={functions}
                                                               hideTrackAnnotations={false}
                                                               targetUsages={['tokens']}/>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                        <div className={`h-[730px] ${currentTab !== 'diagram' && 'hidden'}`}>
                            <ExecutionDiagram profilerData={functions}/>
                        </div>
                        <div className={`min-w-full ${currentTab !== 'func-calls' && 'hidden'}`}>
                            <FuncCalls profilerData={functions} session={session}/>
                        </div>
                    </>
                }
            </div>
        </>
    );
};

export default Session;