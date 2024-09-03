import React, {useEffect, useState} from 'react';
import {CheckTokenResponse, useAuthController} from "@/hooks/useAuthController";
import Loading from "@/components/Loading";
import {router} from "next/client";
import ExecutionTimeChart from "@/components/dashboard/ExecutionTimeChart";

const Function: React.FC = () => {
    const { checkToken } = useAuthController();
    const [authLoading, setAuthLoading] = useState(true);
    const [loading, setLoading] = useState(true);
    const [tokenInfo, setTokenInfo] = useState<CheckTokenResponse | null>(null);
    const { tokenId } = router.query;

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
        <div className="bg-base-100 shadow-lg rounded-lg p-6">
            <div className="mb-4">
                <h1 className="text-2xl font-bold">
                    Functions - {tokenId}
                </h1>
            </div>
            <div>
                <ExecutionTimeChart tokenId={tokenId as string} sortFields={["starttime"]} />
            </div>
        </div>
    );
};

export default Function;