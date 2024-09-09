import React, {useEffect, useState} from 'react';
import {CheckTokenResponse, useAuthController} from "@/hooks/useAuthController";
import Loading from "@/components/Loading";
import {useRouter} from "next/router";
import ExecutionTimeAreaChart from "@/components/dashboard/ExecutionTimeAreaChart";
import Link from "next/link";
import {useTokenController} from "@/hooks/useTokenController";

const TokenDashboard: React.FC = () => {
    const {checkToken} = useAuthController();
    const router = useRouter();
    const {tokenId} = router.query;
    const [tokenName, setTokenName] = useState<string | null>(null);
    const {fetchTokenNameFromId} = useTokenController();
    const [authLoading, setAuthLoading] = useState(true);
    const [loading, setLoading] = useState(true);
    const [tokenInfo, setTokenInfo] = useState<CheckTokenResponse | null>(null);

    useEffect(() => {
        if (tokenId) {
            setLoading(false);
            fetchTokenNameFromId(tokenId as string).then((response) => {
                setTokenName(response);
            });
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

    if (authLoading || loading) return <Loading/>;

    return (
        <div>
            <div className="mb-4">
                <h1 className="text-2xl font-bold">
                    Dashboard
                </h1>
                <div className="breadcrumbs text-sm">
                    <ul>
                        <li><Link href={`/dashboard`}>Dashboard</Link></li>
                        <li>{tokenName && tokenName}</li>
                    </ul>
                </div>
            </div>
            <Link href={`/dashboard/${tokenId}/sessions`}>
                <button className="btn btn-secondary">
                    See sessions
                </button>
            </Link>
            <div className="divider"></div>
            <div>
                <ExecutionTimeAreaChart tokenId={tokenId as string} sortFields={["starttime"]}/>
            </div>
        </div>
    );
};

export default TokenDashboard;