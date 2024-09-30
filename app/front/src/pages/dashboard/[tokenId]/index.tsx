import React, {useEffect, useState} from 'react';
import Loading from "@/components/Loading";
import {useRouter} from "next/router";
import Link from "next/link";
import {useTokenController} from "@/hooks/useTokenController";
import useGroupedSessions, {GroupedSessionResponse} from "@/hooks/profiler/useGroupedSessionsData";
import FolderIcon from "@mui/icons-material/Folder";
import {SessionData} from "@/types/SessionData";
import DataArrayIcon from "@mui/icons-material/DataArray";
import ExecutionTimeline from '@/components/dashboard/timeline/ExecutionTimeline';
import {useAppContext} from "@/context/AppContext";

const TokenDashboard: React.FC = () => {
    const {authInfo} = useAppContext();
    const router = useRouter();
    const {tokenId} = router.query;
    const [tokenName, setTokenName] = useState<string | null>(null);
    const {fetchTokenNameFromId} = useTokenController();
    const [pageLoading, setPageLoading] = useState(true);
    const [grouping, setGrouping] = React.useState<string>(localStorage.getItem('grouping') || 'hour');
    const [tagFilter, setTagFilter] = useState<string>('');
    const [executionTimeFilter, setExecutionTimeFilter] = useState<number | null>(null);
    const [sortBy, setSortBy] = useState<string>('');
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
            const tagMatch = !tagFilter || session.sessiontag.toLowerCase().includes(tagFilter.toLowerCase());
            const executionTimeMatch = executionTimeFilter === null || session.executiontime <= executionTimeFilter;
            return tagMatch && executionTimeMatch;
        }).sort((a, b) => {
            if (sortBy === 'executionTime') {
                return a.executiontime - b.executiontime;
            } else if (sortBy === 'startDate') {
                return new Date(a.startdate).getTime() - new Date(b.startdate).getTime();
            }
            return 0;
        })
    }));

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
            <div className="mb-4">
                <p className="text-gray-500">Grouped by:</p>
                <select className="select select-bordered select-sm w-full max-w-xs" value={grouping}
                        onChange={(e) => setGrouping(e.target.value)}>
                    <option value="hour">Hour</option>
                    <option value="day">Day</option>
                    <option value="week">Week</option>
                    <option value="tag">Tag</option>
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
                <p className="text-gray-500">Filter by Execution Time (ms):</p>
                <input
                    type="number"
                    className="input input-bordered input-sm w-full max-w-xs"
                    value={executionTimeFilter || ''}
                    onChange={(e) => setExecutionTimeFilter(e.target.value ? parseInt(e.target.value, 10) : null)}
                />
            </div>
            <div className="mb-4">
                <p className="text-gray-500">Sort by:</p>
                <select className="select select-bordered select-sm w-full max-w-xs" value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}>
                    <option value="">None</option>
                    <option value="executionTime">Execution Time</option>
                    <option value="startDate">Start Date</option>
                </select>
            </div>
            {
                loading ? <Loading/> : (
                    <div>
                        <p className="text-gray-500">List of sessions</p>
                        <ul className="menu rounded-box ">
                            {filteredSessions && filteredSessions.map((group: GroupedSessionResponse, index) => (
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
                                                        <Link
                                                            href={`/dashboard/${session.tokenid}/session/${session.sessionuuid}`}>
                                                            <DataArrayIcon/>
                                                            {new Date(session.startdate).toLocaleString()} {session.sessiontag === "" ? "" : `(${session.sessiontag})`}- {session.executiontime}ms
                                                            ({session._id})
                                                        </Link>
                                                    </summary>
                                                </li>
                                            ))}
                                        </ul>
                                    </details>
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            }
        </div>
    );
};

export default TokenDashboard;