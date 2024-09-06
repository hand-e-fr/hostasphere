import { useRouter } from "next/router";
import SessionUsageChart from "@/components/dashboard/SessionUsageChart";
import TestDiagram from "@/components/dashboard/diagram/TestDiagram";

const Session: React.FC = () => {
    const router = useRouter();
    const { tokenId, sessionId } = router.query;

    return (
        <>
            <div className="mb-4">
                <h1 className="text-2xl font-bold">
                    Session - {sessionId}
                </h1>
            </div>
            <div className="divider"></div>
            <div role="tablist" className="tabs tabs-bordered tabs-xl">
                <input type="radio" name="my_tabs_1" role="tab" className="tab overflow-hidden min-w-[12em] whitespace-nowrap" aria-label="Usage" defaultChecked/>
                <div role="tabpanel" className="tab-content mt-4 w-full">
                    <div className="min-w-full">
                        {tokenId && sessionId && (<SessionUsageChart tokenid={tokenId as string} sessionuuid={sessionId as string}/>)}
                    </div>
                </div>
                <input type="radio" name="my_tabs_1" role="tab" className="tab overflow-hidden min-w-[12em] whitespace-nowrap" aria-label="Call Graph"/>
                <div role="tabpanel" className="tab-content mt-4 w-full">
                    <div className="min-w-full h-[500px]">
                        <TestDiagram/>
                    </div>
                </div>
            </div>
            <div>
            </div>
        </>
    );
};

export default Session;