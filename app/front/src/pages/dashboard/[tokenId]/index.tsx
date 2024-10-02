import React, {useEffect, useState} from 'react';
import Loading from "@/components/Loading";
import {useRouter} from "next/router";
import Link from "next/link";
import {useTokenController} from "@/hooks/useTokenController";
import useGroupedSessions, {GroupedSessionResponse} from "@/hooks/profiler/useGroupedSessionsData";
import FolderIcon from "@mui/icons-material/Folder";
import {SessionData} from "@/types/SessionData";
import CodeIcon from '@mui/icons-material/Code';
import ExecutionTimeline from '@/components/dashboard/timeline/ExecutionTimeline';
import {useAppContext} from "@/context/AppContext";

const TokenDashboard: React.FC = () => {
    const {authInfo} = useAppContext();
    const router = useRouter();
    const {tokenId} = router.query;
    const [tokenName, setTokenName] = useState<string | null>(null);
    const {fetchTokenNameFromId} = useTokenController();
    const [pageLoading, setPageLoading] = useState(true);
    const [grouping, setGrouping] = React.useState<string>(localStorage.getItem('grouping') || 'all');
    const [tagFilter, setTagFilter] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>(localStorage.getItem('sortBy') || 'startDateAscend');
    const {
        groupedSessions,
        loading
    } = useGroupedSessions(tokenId as string, grouping, 100, 0);

    useEffect(() => {
        if (tokenId) {
            setPageLoading(false);
            fetchTokenNameFromId(tokenId as string).then((response) => {
                setTokenName(response);
            });
        }
    }, [tokenId]);

    const filteredSessions = groupedSessions && groupedSessions.map(group => ({
        ...group,
        sessions: group.sessions.filter(session => {
            return !tagFilter || session.sessiontag.toLowerCase().includes(tagFilter.toLowerCase());
        }).sort((a, b) => {
            if (sortBy === 'executionTimeDescend') {
                return a.executiontime - b.executiontime;
            } else if (sortBy === 'executionTimeAscend') {
                return b.executiontime - a.executiontime;
            } else if (sortBy === 'startDateAscend') {
                return new Date(b.startdate).getTime() - new Date(a.startdate).getTime();
            } else if (sortBy === 'startDateDescend') {
                return new Date(a.startdate).getTime() - new Date(b.startdate).getTime();
            }
            return 0;
        })
    })).sort((a, b) => {
        if (sortBy === 'executionTimeDescend') {
            return a.sessions[0].executiontime - b.sessions[0].executiontime;
        } else if (sortBy === 'executionTimeAscend') {
            return b.sessions[0].executiontime - a.sessions[0].executiontime;
        } else if (sortBy === 'startDateAscend') {
            return new Date(b.sessions[0].startdate).getTime() - new Date(a.sessions[0].startdate).getTime();
        } else if (sortBy === 'startDateDescend') {
            return new Date(a.sessions[0].startdate).getTime() - new Date(b.sessions[0].startdate).getTime();
        }
        return 0;
    });

    if (!authInfo || !authInfo.ok || pageLoading) return <Loading/>;

    return (
        <div>
            <div className="mb-4">
                <h1 className="text-2xl font-bold">
                    Dashboard
                </h1>
                <div className="breadcrumbs text-sm">
                    <ul>
                        <li><Link href={`/dashboard`}>Dashboard</Link></li>
                        <li>{tokenName && tokenName}</li>
                    </ul>
                </div>
            </div>
            <h2 className="text-xl font-bold mt-4" id="execution-time">Execution time</h2>
            <div className="divider m-0"></div>
            {
                groupedSessions && (
                    <ExecutionTimeline sessions={groupedSessions.flatMap(group => group.sessions)}/>
                )
            }
            <h2 className="text-xl font-bold mt-8" id="sessions">Sessions list</h2>
            <div className="divider m-0"></div>
            <div className="flex flex-row justify-between">
                <div className="mb-4">
                    <p className="text-gray-500">Grouped by:</p>
                    <select className="select select-bordered select-sm w-full max-w-xs" value={grouping}
                            onChange={(e) => {
                                setGrouping(e.target.value);
                                localStorage.setItem('grouping', e.target.value);
                            }}>
                        <option value="all">All</option>
                        <option value="tag">Tag</option>
                        <option value="week">Week</option>
                        <option value="day">Day</option>
                        <option value="hour">Hour</option>
                    </select>
                </div>
                <div className="mb-4">
                    <p className="text-gray-500">Filter by Tag:</p>
                    <input
                        type="text"
                        className="input input-bordered input-sm w-full max-w-xs"
                        value={tagFilter}
                        onChange={(e) => setTagFilter(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <p className="text-gray-500">Sort by:</p>
                    <select className="select select-bordered select-sm w-full max-w-xs" value={sortBy}
                            onChange={(e) => {
                                setSortBy(e.target.value);
                                localStorage.setItem('sortBy', e.target.value);
                            }} defaultValue={sortBy}>
                        <option value="startDateAscend">
                            Start Date ⭡ (lastest)
                        </option>
                        <option value="startDateDescend">
                            Start Date ⭣ (oldest)
                        </option>
                        <option value="executionTimeAscend">
                            Execution Time ⭡ (fastest)
                        </option>
                        <option value="executionTimeDescend">
                            Execution Time ⭣ (slowest)
                        </option>
                    </select>
                </div>
            </div>
            {
                loading ? <Loading/> : (
                    <div>
                        <p className="text-gray-500">List of sessions</p>
                        <ul className="menu rounded-box pl-0">
                        {filteredSessions && filteredSessions.map((group: GroupedSessionResponse, index) => (
                            <>
                            {
                                grouping === 'all' || !group._id ? (
                                    <>
                                        {group.sessions.map((session: SessionData) => (
                                            <li key={session._id}>
                                                <summary>
                                                    <Link href={`/dashboard/${session.tokenid}/session/${session.sessionuuid}`}>
                                                        <div className="flex items-center space-x-2">
                                                            <CodeIcon/>
                                                            <p>{new Date(session.startdate).toLocaleString()} {session.sessiontag === "" ? "" : `(${session.sessiontag})`}- {session.executiontime}ms
                                                                ({session._id})</p>
                                                        </div>
                                                    </Link>
                                                </summary>
                                            </li>
                                        ))}
                                    </>
                                ) : (
                                    <li key={index}>
                                        <details>
                                            <summary>
                                                <FolderIcon/>
                                                {typeof group._id === 'string' ? group._id : `Week ${group._id.week}, Year ${group._id.year}`}
                                            </summary>
                                            <ul>
                                                {group.sessions.map((session: SessionData) => (
                                                    <li key={session._id}>
                                                        <summary>
                                                            <Link href={`/dashboard/${session.tokenid}/session/${session.sessionuuid}`}>
                                                                <div className="flex items-center space-x-2">
                                                                    <CodeIcon/>
                                                                    <p>{new Date(session.startdate).toLocaleString()} {session.sessiontag === "" ? "" : `(${session.sessiontag})`}- {session.executiontime}ms
                                                                        ({session._id})</p>
                                                                </div>
                                                            </Link>
                                                        </summary>
                                                    </li>
                                                ))}
                                            </ul>
                                        </details>
                                    </li>
                                )
                            }
                            </>
                        ))}
                        </ul>
                    </div>
                )
            }
        </div>
    );
};

export default TokenDashboard;