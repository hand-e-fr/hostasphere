import React, { useEffect, useState } from 'react';
import Loading from "@/components/Loading";
import { useRouter } from "next/router";
import Link from "next/link";
import { useTokenController } from "@/hooks/useTokenController";
import useGroupedSessions, { GroupedSessionResponse } from "@/hooks/profiler/useGroupedSessionsData";
import FolderIcon from "@mui/icons-material/Folder";
import { SessionData } from "@/types/SessionData";
import DataArrayIcon from "@mui/icons-material/DataArray";
import ExecutionTimeline from '@/components/dashboard/timeline/ExecutionTimeline';
import { useAppContext } from "@/context/AppContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TokenDashboard: React.FC = () => {
    const { authInfo } = useAppContext();
    const router = useRouter();
    const { tokenId } = router.query;
    const [tokenName, setTokenName] = useState<string | null>(null);
    const { fetchTokenNameFromId } = useTokenController();
    const [pageLoading, setPageLoading] = useState(true);
    const [grouping, setGrouping] = React.useState<string>(localStorage.getItem('grouping') || 'hour');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const {
        groupedSessions,
        loading
    } = useGroupedSessions(tokenId as string, grouping, 100, 0, startDate, endDate, sortOrder);

    useEffect(() => {
        if (tokenId) {
            setPageLoading(false);
            fetchTokenNameFromId(tokenId as string).then((response) => {
                setTokenName(response);
            });
        }
    }, [tokenId]);

    if (!authInfo || !authInfo.ok || pageLoading) return <Loading />;

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOrder(e.target.value as 'asc' | 'desc');
    };

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
                    <ExecutionTimeline sessions={groupedSessions.flatMap(group => group.sessions)} />
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
                <p className="text-gray-500">Date range:</p>
                <div className="flex space-x-4">
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        placeholderText="Start Date"
                        className="input input-bordered w-full max-w-xs"
                    />
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        placeholderText="End Date"
                        className="input input-bordered w-full max-w-xs"
                    />
                </div>
            </div>
            <div className="mb-4">
                <p className="text-gray-500">Sort by execution time:</p>
                <select className="select select-bordered select-sm w-full max-w-xs" value={sortOrder}
                        onChange={handleSortChange}>
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
            </div>
            {
                loading ? <Loading /> : (
                    <div>
                        <p className="text-gray-500">List of sessions</p>
                        <ul className="menu rounded-box ">
                            {groupedSessions && groupedSessions.map((group: GroupedSessionResponse, index) => (
                                <li key={index}>
                                    <details>
                                        <summary>
                                            <FolderIcon />
                                            {typeof group._id === 'string' ? group._id : `Week ${group._id.week}, Year ${group._id.year}`}
                                        </summary>
                                        <ul>
                                            {group.sessions.map((session: SessionData) => (
                                                <li key={session._id}>
                                                    <summary>
                                                        <Link
                                                            href={`/dashboard/${session.tokenid}/session/${session.sessionuuid}`}>
                                                            <DataArrayIcon />
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