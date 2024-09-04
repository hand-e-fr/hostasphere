import React, {useState} from 'react';
import {CheckTokenResponse, useAuthController} from "@/hooks/useAuthController";
import {useTokenController} from "@/hooks/useTokenController";
import Loading from "@/components/Loading";
import Link from "next/link";

const Dashboard: React.FC = () => {
    const {checkToken} = useAuthController();
    const {getTokens, deleteToken, error, loading, tokens} = useTokenController();
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
                <h1 className="text-2xl font-bold">Programs</h1>
            </div>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tokens && tokens.map((token, index) => (
                    <div key={index}>
                        <Link href={`/dashboard/${token.id}`} passHref>
                            <button
                                className="btn btn-neutral w-[100%] p-4 rounded-lg shadow-lg cursor-pointer hover:bg-base-200 transition-colors duration-300">
                                $ {token.name}
                            </button>
                        </Link>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Dashboard;