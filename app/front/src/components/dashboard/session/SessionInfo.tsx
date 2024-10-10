import React from 'react';
import {ComparedSession} from "@/hooks/session/useCompareSessions";

interface SessionInfoProps {
    session: ComparedSession;
    sessionTitle?: string;
}

const SessionInfo: React.FC<SessionInfoProps> = ({ session, sessionTitle }) => {

    console.log(session);

    return (
        <div className="card bg-base-100 shadow-lg mb-6">
            <div className="card-body">
                <h2 className="card-title">{sessionTitle || 'Session Information'}</h2>
                <p>UUID: {session.sessions[0].sessionuuid}</p>
                <p>Hostname: {session.sessions[0].hostname}</p>
                <p>OS: {session.sessions[0].os} ({session.sessions[0].osversion})</p>
                <p>Processor: {session.sessions[0].processor}</p>
                <p>Python Version: {session.sessions[0].pythonversion}</p>
                <p>Start Time: {new Date(session.sessions[0].starttime).toLocaleString()}</p>
                <p>End Time: {new Date(session.sessions[0].endtime).toLocaleString()}</p>
                <p>Total Tokens: {session.sessions[0].totaltokens}</p>
                <p>Session Tag: {session.sessions[0].sessiontag}</p>
            </div>
        </div>
    );
};

export default SessionInfo;
