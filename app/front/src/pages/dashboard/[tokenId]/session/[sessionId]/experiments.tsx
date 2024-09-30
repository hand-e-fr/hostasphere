import React, {useState} from "react";
import {useAppContext} from "@/context/AppContext";
import {useRouter} from "next/router";
import {useTokenController} from "@/hooks/useTokenController";
import useSessionData from "@/hooks/profiler/useSessionData";
import Loading from "@/components/Loading";

const Session: React.FC = () => {
    const {authInfo} = useAppContext();
    const router = useRouter();
    const {tokenId, sessionId} = router.query;
    const [tokenName, setTokenName] = useState<string | null>(null);
    const {fetchTokenNameFromId} = useTokenController();
    const {session, functions, loading, error, fetchData} = useSessionData(tokenId as string, sessionId as string);

    if (!authInfo || !authInfo.ok || loading) return <Loading/>;
    if (error) return <p>Error: {error}</p>;
    if (!session) return <p>No data available</p>;

    return (
        <div>
            <h1>Session</h1>
            <p>Session ID: {sessionId}</p>
            <p>Token ID: {tokenId}</p>
            <p>Token Name: {tokenName}</p>
            <p>Session Tag: {session.sessiontag}</p>
        </div>
    );
}

export default Session;