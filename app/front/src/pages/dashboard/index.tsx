import React, {useState} from 'react';
import {CheckTokenResponse, useAuthController} from "@/hooks/useAuthController";
import {useTokenController} from "@/hooks/useTokenController";
import Loading from "@/components/Loading";
import Link from "next/link";
import {useAppContext} from "@/context/AppContext";

const Dashboard: React.FC = () => {
    const {authInfo} = useAppContext();
    const {getTokens, loading, tokens} = useTokenController();

    React.useEffect(() => {
        getTokens().then();
    }, []);

    if (loading || !authInfo || !authInfo?.ok) return <Loading/>;

    return (
        <>
            <div className="mb-4">
                <h1 className="text-2xl font-bold">
                    Dashboard
                </h1>
            </div>
            <div className="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {tokens && tokens.map((token, index) => authInfo && authInfo.ok && (authInfo.is_admin || token.owner === authInfo.email) && (
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