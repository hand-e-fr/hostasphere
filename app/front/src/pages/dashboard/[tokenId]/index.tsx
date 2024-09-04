import React, {useEffect, useState} from 'react';
import {CheckTokenResponse, useAuthController} from "@/hooks/useAuthController";
import Loading from "@/components/Loading";
import {router} from "next/client";
import ExecutionTimeChart from "@/components/dashboard/ExecutionTimeChart";
import {useRouter} from "next/router";
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ExecutionTimeColumnChart from "@/components/dashboard/ExecutionTimeColumnChart";
import ExecutionTimeRadarChart from "@/components/dashboard/ExecutionTimeRadarChart";
import ExecutionTimeTreemapChart from "@/components/dashboard/ExecutionTimeTreemapChart";
import CPUUsageColumnChart from "@/components/dashboard/CPUUsageColumnChart";
import MemoryUsageRadarChart from "@/components/dashboard/MemoryUsageRadarChart";
import ExecutionTimeAreaChart from "@/components/dashboard/ExecutionTimeAreaChart";

const Function: React.FC = () => {
    const { checkToken } = useAuthController();
    const router = useRouter();
    const { tokenId } = router.query;
    const [authLoading, setAuthLoading] = useState(true);
    const [loading, setLoading] = useState(true);
    const [tokenInfo, setTokenInfo] = useState<CheckTokenResponse | null>(null);

    useEffect(() => {
        if (tokenId) {
            setLoading(false);
        }
    }, [tokenId]);

    useEffect(() => {
        checkToken().then((response) => {
            setTokenInfo(response);
            if (response.ok) {
                setAuthLoading(false);
            }
        });
    }, []);

    if (authLoading || loading) return <Loading />;

    return (
        <div>
            <div className="mb-4">
                <h1 className="text-2xl font-bold">
                    Functions - {tokenId}
                </h1>
            </div>
            <div className="stats shadow mb-4">
                <div className="stat">
                    <div className="stat-figure text-secondary">
                        <RestartAltIcon/>
                    </div>
                    <div className="stat-title">Usage</div>
                    <div className="stat-value">25</div>
                    <div className="stat-desc">functions started this week</div>
                </div>
            </div>
            <div className="divider"></div>
            <div>
                <ExecutionTimeAreaChart tokenId={tokenId as string} sortFields={["starttime"]}/>
            </div>
        </div>
    );
};

export default Function;