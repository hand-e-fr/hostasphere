import React from 'react';
import Link from 'next/link';
import CodeIcon from '@mui/icons-material/Code';
import { SessionData } from '@/types/SessionData';

interface Props {
    session: SessionData;
    selectedSessions: string[];
    addSelectedSession: (sessionId: string) => void;
    removeSelectedSession: (sessionId: string) => void;
}

const SessionListItem: React.FC<Props> = ({
                                              session,
                                              selectedSessions,
                                              addSelectedSession,
                                              removeSelectedSession,
                                          }) => {
    return (
        <li>
            <summary
                className={`${selectedSessions.includes(session.sessionuuid) ? 'bg-gray-200' : ''}`}
            >
                <input
                    type="checkbox"
                    className="checkbox checkbox-xs"
                    checked={selectedSessions.includes(session.sessionuuid)}
                    onChange={(e) => {
                        if (e.target.checked) {
                            addSelectedSession(session.sessionuuid);
                        } else {
                            removeSelectedSession(session.sessionuuid);
                        }
                    }}
                />
                <Link
                    href={`/dashboard/${session.tokenid}/session/${session.sessionuuid}`}
                >
                    <div className="flex items-center space-x-2">
                        <CodeIcon />
                        <p>
                            {new Date(session.startdate).toLocaleString()}
                            {session.sessiontag === '' ? '' : `(${session.sessiontag})`} -{' '}
                            {session.executiontime}ms ({session._id})
                        </p>
                    </div>
                </Link>
            </summary>
        </li>
    );
};

export default SessionListItem;
