import React, {useState} from "react";
import {useAppContext} from "@/context/AppContext";
import {useRouter} from "next/router";
import {useTokenController} from "@/hooks/app/useTokenController";
import useSessionData from "@/hooks/session/useSessionData";
import Loading from "@/components/Loading";
import useProfilerData from "@/hooks/profiler/useProfilerController";
import {ProfilerData} from "@/types/ProfilerData";
import ExperimentForm from "@/components/ExperimentForm";

const Session: React.FC = () => {
    const {authInfo} = useAppContext();
    const router = useRouter();
    const {tokenId, sessionId, functionId} = router.query;
    const [tokenName, setTokenName] = useState<string | null>(null);
    const {fetchTokenNameFromId} = useTokenController();
    const {session, functions, loading: sessionLoading, error: sessionError, fetchData} = useSessionData(tokenId as string, sessionId as string, '', false);
    const {data, loading: profilerLoading, error: profilerError} = useProfilerData(tokenId as string, [], 1, functionId as string);

    if (!authInfo || !authInfo.ok || sessionLoading || profilerLoading) return <Loading/>;
    if (sessionError || profilerError) return <p>Error: {sessionError || profilerError}</p>;
    if (!session || !data) return <p>No data available</p>;

    return (
        <div>
            {/*<h1>Session</h1>*/}
            {/*<p>Session ID: {sessionId}</p>*/}
            {/*<p>Token ID: {tokenId}</p>*/}
            {/*<p>Function ID: {functionId}</p>*/}
            {/*<p>Token Name: {tokenName}</p>*/}
            {/*<p>Session Tag: {session.sessiontag}</p>*/}
            {/*{ data.map((item: ProfilerData) => (*/}
            {/*    <div key={item._id}>*/}
            {/*        <p>{item._id}</p>*/}
            {/*        <p>{item.functionname}</p>*/}
            {/*        <textarea value={item.sourcecode} className="w-full h-64"/>*/}
            {/*    </div>*/}
            {/*))}*/}
            <ExperimentForm />
        </div>
    );
}

export default Session;
