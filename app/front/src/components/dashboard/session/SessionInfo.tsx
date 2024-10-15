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

    let color = 'text-base-content';
    let sign = '-';

    if (isNumeric) {
        const difference = Number(value) - Number(comparedValue);
        if (difference > 0) {
            color = 'text-green-500';
            sign = '+';
        } else {
            color = 'text-red-500';
            sign = '-';
        }
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
            <div className="card-body pl-0">
                <h2 className={`card-title pl-6`}>{sessionTitle || 'Session Information'}</h2>

                <div className="pl-5">
                    {/* Card: PC Information */}
                    <div className="card-body border p-3 rounded-lg mb-4">
                        <h3 className="text-lg font-semibold">PC Information</h3>
                        <p>UUID: {getColoredText(session.sessionuuid, comparedSession.sessionuuid, false)}</p>
                        <p>Hostname: {getColoredText(session.hostname, comparedSession.hostname)}</p>
                        <p>OS: {getColoredText(session.os, comparedSession.os)} ({getColoredText(session.osversion, comparedSession.osversion)})</p>
                        <p>Processor: {getColoredText(session.processor, comparedSession.processor)}</p>
                        <p>Python Version: {getColoredText(session.pythonversion, comparedSession.pythonversion)}</p>
                        <p>Kernel Version: {getColoredText(session.kernelversion, comparedSession.kernelversion)}</p>
                        <p>CPU Count: {getColoredText(session.cpucount, comparedSession.cpucount, true)}</p>
                        <p>Architecture: {getColoredText(session.architecture, comparedSession.architecture)}</p>
                        <p>Current User: {getColoredText(session.currentuser, comparedSession.currentuser)}</p>
                        <p>PID: {getColoredText(session.pid, comparedSession.pid, false)}</p>
                    </div>

                    {/* Card: Execution Information */}
                    <div className="border p-3 rounded-lg mb-4">
                        <h3 className="text-lg font-semibold">Execution Information</h3>
                        <p>Start Time: {getColoredText(formatTime(session.startdate), formatTime(comparedSession.startdate))}</p>
                        <p>End Time: {getColoredText(formatTime(session.enddate), formatTime(comparedSession.enddate))}</p>
                        <p>Execution Time: {getColoredText(session.executiontime, comparedSession.executiontime, true)} seconds</p>
                        <p>Boot Time: {getColoredText(session.boottime, comparedSession.boottime, true)} seconds</p>
                    </div>

                    {/* Card: Tags and Tokens */}
                    <div className="border p-3 rounded-lg mb-4">
                        <h3 className="text-lg font-semibold">Tags{session.totaltokens ? ' and Tokens' : ''}</h3>
                        {session.totaltokens ? (
                            <p>Total Tokens: {getColoredText(session.totaltokens, comparedSession.totaltokens, true)}</p>
                        ) : null}
                        <p>Session Tag: {getColoredText(session.sessiontag, comparedSession.sessiontag)}</p>
                    </div>

                    {/* Card: Dates */}
                    <div className="border p-3 rounded-lg mb-4">
                        <h3 className="text-lg font-semibold">Date Information</h3>
                        <p>Start
                            Date: {getColoredText(new Date(session.startdate).toLocaleDateString(), new Date(comparedSession.startdate).toLocaleDateString())}</p>
                        <p>End
                            Date: {getColoredText(new Date(session.enddate).toLocaleDateString(), new Date(comparedSession.enddate).toLocaleDateString())}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SessionInfo;
