import { useRouter } from "next/router";
import SessionUsageChart from "@/components/dashboard/SessionUsageChart";
import { useEffect } from "react";

const Session: React.FC = () => {
    const router = useRouter();
    const { tokenId, sessionId } = router.query;

    useEffect(() => {
        if (sessionId) {
            document.title = `Session - ${sessionId}`;
        }
    }, [sessionId]);

    return (
        <>
            <div className="mb-4">
                <h1 className="text-2xl font-bold">
                    Session - {sessionId}
                </h1>
            </div>
            <div className="divider"></div>
            <div>
                <SessionUsageChart tokenid={tokenId as string} sessionuuid={sessionId as string} />
            </div>
        </>
    );
};

export default Session;