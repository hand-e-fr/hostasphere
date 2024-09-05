import React, {useEffect, useState} from "react";
import useGroupedSessions, {GroupedSessionResponse} from "@/hooks/profiler/useGroupedSessionsData";
import {SessionData} from "@/types/SessionData";
import DataArrayIcon from '@mui/icons-material/DataArray';
import FolderIcon from '@mui/icons-material/Folder';
import Link from "next/link";
import {useRouter} from "next/router";
import Loading from "@/components/Loading";

const Sessions: React.FC = () => {
    const router = useRouter();
    const {tokenId} = router.query;
    const [grouping, setGrouping] = React.useState<string>('day');
    const [pageLoading, setPageLoading] = useState(true);
    const { groupedSessions, loading, error, fetchGroupedSessions } = useGroupedSessions(tokenId as string, grouping, 100, 0);

    useEffect(() => {
        if (tokenId) {
            setPageLoading(false);
            fetchGroupedSessions().then();
        }
    }, [tokenId]);

    if (loading || pageLoading) return <Loading/>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <h1 className="text-2xl font-semibold mb-4">Sessions</h1>
            <div className="mb-4">
                <p className="text-gray-500">Grouped by:</p>
                <select className="select select-bordered select-sm w-full max-w-xs" value={grouping} onChange={(e) => setGrouping(e.target.value)}>
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
                                                <Link href={`/dashboard/${session.tokenid}/session/${session.sessionuuid}`}>
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