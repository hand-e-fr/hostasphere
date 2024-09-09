import React, {useEffect, useState} from "react";
import useGroupedSessions, {GroupedSessionResponse} from "@/hooks/profiler/useGroupedSessionsData";
import {SessionData} from "@/types/SessionData";
import DataArrayIcon from '@mui/icons-material/DataArray';
import FolderIcon from '@mui/icons-material/Folder';
import Link from "next/link";
import {useRouter} from "next/router";
import Loading from "@/components/Loading";
import {useTokenController} from "@/hooks/useTokenController";

const Sessions: React.FC = () => {
    const router = useRouter();
    const {tokenId} = router.query;
    const [tokenName, setTokenName] = useState<string | null>(null);
    const {fetchTokenNameFromId} = useTokenController();
    const [grouping, setGrouping] = React.useState<string>(localStorage.getItem('grouping') || 'hour');
    const [pageLoading, setPageLoading] = useState(true);
    const {
        groupedSessions,
        loading,
        error,
        fetchGroupedSessions
    } = useGroupedSessions(tokenId as string, grouping, 100, 0);

    useEffect(() => {
        if (localStorage.getItem('grouping')) {
            setGrouping(localStorage.getItem('grouping') as string);
        }
    }, []);

    useEffect(() => {
        if (tokenId) {
            fetchTokenNameFromId(tokenId as string).then((response) => {
                setTokenName(response);
            });
            fetchGroupedSessions().then();
            setPageLoading(false);
        }
    }, [tokenId]);

    if (loading || pageLoading) return <Loading/>;
    if (error) return <div>Error: {error}</div>;

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
                        <li>Sessions</li>
                    </ul>
                </div>
            </div>
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
            <div>
                <p className="text-gray-500">List of sessions</p>
                <ul className="menu rounded-box ">
                    {groupedSessions && groupedSessions.map((group: GroupedSessionResponse, index) => (
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
        </>
    );
}

export default Sessions;