import React from 'react';
import { SessionData } from '@/types/SessionData';

interface SessionInfoProps {
    session: SessionData;
    comparedSession: SessionData;
    sessionTitle?: string;
    color: string;
}

const formatTime = (date: string | number | Date) => new Date(date).toLocaleString();

const getColoredText = (value: any, comparedValue: any, isNumeric = false) => {
    if (value === comparedValue) {
        return value;
    }

    let color = 'text-red-500'; // default to negative (red)
    let sign = '-';

    if (isNumeric) {
        const difference = Number(value) - Number(comparedValue);
        if (difference > 0) {
            color = 'text-green-500'; // positive change (green)
            sign = '+';
        }
    } else if (value > comparedValue) {
        color = 'text-green-500';
    }

    return (
        <span className={`font-bold ${color}`}>
            {isNumeric ? `${value} (${sign}${Math.abs(Number(value) - Number(comparedValue))})` : value}
        </span>
    );
};

const SessionInfo: React.FC<SessionInfoProps> = ({ session, comparedSession, sessionTitle, color }) => {
    return (
        <div className="bg-base-100 shadow rounded-lg mt-3">
            <div className="card-body">
                <h2 className={`card-title text-[${color}]`}>{sessionTitle || 'Session Information'}</h2>
                <p>UUID: {session.sessionuuid}</p>
                <p>Hostname: {session.hostname}</p>

                <p>OS: {getColoredText(session.os, comparedSession.os)} ({getColoredText(session.osversion, comparedSession.osversion)})</p>
                <p>Processor: {getColoredText(session.processor, comparedSession.processor)}</p>
                <p>Python Version: {getColoredText(session.pythonversion, comparedSession.pythonversion)}</p>

                <p>Start Time: {getColoredText(formatTime(session.starttime), formatTime(comparedSession.starttime))}</p>
                <p>End Time: {getColoredText(formatTime(session.endtime), formatTime(comparedSession.endtime))}</p>

                {session.totaltokens ? (
                    <p>Total Tokens: {getColoredText(session.totaltokens, comparedSession.totaltokens, true)}</p>
                ) : null}

                <p>Session Tag: {getColoredText(session.sessiontag, comparedSession.sessiontag)}</p>
                <p>Execution Time: {getColoredText(session.executiontime, comparedSession.executiontime, true)} seconds</p>
                <p>Boot Time: {getColoredText(session.boottime, comparedSession.boottime, true)} seconds</p>
                <p>Current User: {getColoredText(session.currentuser, comparedSession.currentuser)}</p>
                <p>Kernel Version: {getColoredText(session.kernelversion, comparedSession.kernelversion)}</p>
                <p>CPU Count: {getColoredText(session.cpucount, comparedSession.cpucount, true)}</p>
                <p>Architecture: {getColoredText(session.architecture, comparedSession.architecture)}</p>
                <p>Start Date: {getColoredText(new Date(session.startdate).toLocaleDateString(), new Date(comparedSession.startdate).toLocaleDateString())}</p>
                <p>End Date: {getColoredText(new Date(session.enddate).toLocaleDateString(), new Date(comparedSession.enddate).toLocaleDateString())}</p>
                <p>PID: {getColoredText(session.pid, comparedSession.pid, true)}</p>
            </div>
        </div>
    );
};

export default SessionInfo;