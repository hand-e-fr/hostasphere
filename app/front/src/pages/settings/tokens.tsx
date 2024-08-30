import React, { useState } from 'react';
import Link from "next/link";
import { CheckTokenResponse, useAuthController } from "@/hooks/useAuthController";
import Loading from "@/components/Loading";
import { Token, useTokenController } from "@/hooks/useTokenController";
import RegisterTokenModal from '@/components/token/RegisterTokenModal';
import ConfirmDeleteModal from '@/components/token/ConfirmDeleteModal';

const Tokens = () => {
    const { checkToken } = useAuthController();
    const { getTokens, deleteToken, error, loading, tokens } = useTokenController();
    const [authLoading, setAuthLoading] = useState(true);
    const [tokenInfo, setTokenInfo] = useState<CheckTokenResponse | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [tokenToDelete, setTokenToDelete] = useState<string | null>(null);

    React.useEffect(() => {
        getTokens();
        checkToken().then((response) => {
            setTokenInfo(response);
            if (response.ok) {
                setAuthLoading(false);
            }
        });
    }, []);

    const handleDeleteClick = (tokenId: string) => {
        setTokenToDelete(tokenId);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (tokenToDelete) {
            deleteToken(tokenToDelete).then(() => {
                getTokens(); // Refresh tokens after deletion
                setIsConfirmOpen(false);
            });
        }
    };

    if (authLoading || loading) return <Loading />;

    return (
        <div className="bg-base-100 shadow-lg rounded-lg p-6">
            <div>
                <div>
                    <h1 className="text-2xl font-bold">Access Tokens</h1>
                </div>
                <div className="overflow-x-auto">
                    <table className="table table-zebra mt-4 mb-4">
                        <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Value</th>
                            <th>Create Date</th>
                            <th>Last Used Date</th>
                            <th>Owner</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {tokens && tokens.map((token: Token) => (
                            <tr key={token.id}>
                                <th className="w-0">
                                    <label>
                                        <input type="radio" className="radio" onChange={(e) => {
                                            const radios = document.querySelectorAll('.radio');
                                            radios.forEach((radio) => {
                                                (radio as HTMLInputElement).checked = false;
                                            });
                                            (e.target as HTMLInputElement).checked = true;
                                        }} />
                                    </label>
                                </th>
                                <td>
                                    {token.name}
                                </td>
                                <td>
                                    {token.value}
                                </td>
                                <td>
                                    {token.created_at === 0 ? 'Never' : new Date(token.created_at).toLocaleDateString()}
                                </td>
                                <td>
                                    {token.last_used === 0 ? 'Never' : new Date(token.last_used).toLocaleDateString()}
                                </td>
                                <td>
                                    {token.owner}
                                </td>
                                {tokenInfo && (tokenInfo.is_admin || token.owner === tokenInfo.email) ? (
                                    <>
                                        <th className="w-0">
                                            <Link href={`/settings/tokens/manage/${token.id}`}>
                                                <button className="btn btn-info btn-sm">usage</button>
                                            </Link>
                                        </th>
                                        <th className="w-0">
                                            <button className="btn btn-error btn-sm" onClick={() => handleDeleteClick(token.id)}>delete</button>
                                        </th>
                                    </>
                                ) : (
                                    <>
                                        <th className="w-0">
                                            <button className="btn btn-info btn-sm" disabled>usage</button>
                                        </th>
                                        <th className="w-0">
                                            <button className="btn btn-error btn-sm" disabled>delete</button>
                                        </th>
                                    </>
                                )}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="flex justify-between items-center mt-4">
                <div className="flex gap-2">
                    <button
                        className="btn btn-secondary"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Register new Token
                    </button>
                </div>
            </div>
            <RegisterTokenModal
                isOpen={isModalOpen}
                onClose={() => {
                    getTokens();
                    setIsModalOpen(false);
                }}
            />
            <ConfirmDeleteModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
};

export default Tokens;