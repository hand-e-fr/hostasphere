import React, {useState} from 'react';
import {CheckTokenResponse, useAuthController} from "@/hooks/useAuthController";
import {useTokenController} from "@/hooks/useTokenController";
import Loading from "@/components/Loading";
import Link from "next/link";

const Dashboard: React.FC = () => {
    const {checkToken} = useAuthController();
    const {getTokens, deleteToken, error, loading, tokens, setTokens} = useTokenController();
    const [authLoading, setAuthLoading] = useState(true);
    const [tokenInfo, setTokenInfo] = useState<CheckTokenResponse | null>(null);

    React.useEffect(() => {
        getTokens();
        checkToken().then((response) => {
            setTokenInfo(response);
            if (response.ok) {
                setAuthLoading(false);
            }
        });
    }, []);

    if (authLoading || loading) return <Loading/>;

    return (
        <>
            <div className="mb-4">
                <h1 className="text-2xl font-bold">
                    Dashboard
                </h1>
            </div>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tokens && tokens.map((token, index) => tokenInfo && (tokenInfo.is_admin || token.owner === tokenInfo?.email) && (
                    <div key={index}>
                        <div className="card bg-gray-50 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title">
                                    $ {token.name}
                                </h2>
                                <p>
                                    Owner: {token.owner}
                                    <br/>
                                    Value: {token.value}
                                </p>
                                <Link className="card-actions justify-end" href={`/dashboard/${token.id}`} passHref>
                                    <button className="btn btn-secondary">See</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Dashboard;