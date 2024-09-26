import React, {useState} from 'react';
import Link from "next/link";
import Loading from "@/components/Loading";
import {useTokenController} from "@/hooks/useTokenController";
import RegisterTokenModal from '@/components/token/RegisterTokenModal';
import ConfirmDeleteModal from '@/components/token/ConfirmDeleteModal';
import {Token} from "@/types/TokenData";
import {useAppContext} from "@/context/AppContext";

const Tokens = () => {
    const {authInfo} = useAppContext();
    const {getTokens, deleteToken, loading, tokens} = useTokenController();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [tokenToDelete, setTokenToDelete] = useState<string | null>(null);

    React.useEffect(() => {
        getTokens().then()
    }, []);

    const handleDeleteClick = (tokenId: string) => {
        setTokenToDelete(tokenId);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (tokenToDelete) {
            deleteToken(tokenToDelete).then(() => {
                getTokens().then();
                setIsConfirmOpen(false);
            });
        }
    };

    if (!authInfo || !authInfo?.ok || loading) return <Loading/>;

    return (
        <>
            <div>
                <div>
                    <h1 className="text-2xl font-bold">Access Tokens</h1>
                </div>
                <div className="overflow-x-auto">
                    <table className="table table-zebra mt-4 mb-4">
                        <thead>
                        <tr>
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
                                {authInfo && authInfo.ok && (authInfo.is_admin || token.owner === authInfo.email) ? (
                                    <>
                                        <th className="w-0">
                                            <Link href={`/dashboard/${token.id}`}>
                                                <button className="btn btn-info btn-sm">usage</button>
                                            </Link>
                                        </th>
                                        <th className="w-0">
                                            <button className="btn btn-error btn-sm"
                                                    onClick={() => handleDeleteClick(token.id)}>delete
                                            </button>
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
                    getTokens().then();
                    setIsModalOpen(false);
                }}
            />
            <ConfirmDeleteModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
            />
        </>
    );
};

export default Tokens;