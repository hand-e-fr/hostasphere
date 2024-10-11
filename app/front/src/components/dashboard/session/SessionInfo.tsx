import React from 'react';
import {SessionData} from "@/types/SessionData";

interface SessionInfoProps {
    session: SessionData;
    sessionTitle?: string;
    color: string;
}

const SessionInfo: React.FC<SessionInfoProps> = ({ session, sessionTitle, color }) => {
    return (
        <div className="bg-base-100 shadow rounded-lg mt-3">
            <div className="card-body">
                <h2 className={`card-title text-[${color}]`}>{sessionTitle || 'Session Information'}</h2>
                <p>UUID: {session.sessionuuid}</p>
                <p>Hostname: {session.hostname}</p>
                <p>OS: {session.os} ({session.osversion})</p>
                <p>Processor: {session.processor}</p>
                <p>Python Version: {session.pythonversion}</p>
                <p>Start Time: {new Date(session.starttime).toLocaleString()}</p>
                <p>End Time: {new Date(session.endtime).toLocaleString()}</p>
                {
                    session.totaltokens && (
                        <p>Total Tokens: {session.totaltokens}</p>
                    )
                }
                <p>Session Tag: {session.sessiontag}</p>
            </div>
        </div>
    );
};

export default SessionInfo;
