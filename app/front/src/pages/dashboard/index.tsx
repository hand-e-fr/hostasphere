import React, {useState} from 'react';
import {useTokenController} from "@/hooks/app/useTokenController";
import Loading from "@/components/Loading";
import Link from "next/link";
import {useAppContext} from "@/context/AppContext";
import RegisterTokenModal from "@/components/token/RegisterTokenModal";
import ConfirmDeleteModal from "@/components/token/ConfirmDeleteModal";
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

const Dashboard: React.FC = () => {
    const {authInfo} = useAppContext();
    const {getTokens, deleteToken, loading, tokens} = useTokenController();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [tokenToDelete, setTokenToDelete] = useState<string | null>(null);

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
                {!tokens || tokens.filter(token => authInfo && authInfo.ok && (authInfo.is_admin || token.owner === authInfo.email)).length <= 0 ? (
                    <div className="card bg-gray-50 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">
                                No Projects
                            </h2>
                            <p>
                                Create new Project
                            </p>
                            <div className="card-actions justify-end">
                                <button
                                    className="btn btn-primary"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    Create
                                </button>
                            </div>
                        </div>
                    </div>
                ) : tokens.map((token, index) => authInfo && authInfo.ok && (authInfo.is_admin || token.owner === authInfo.email) &&
                    (
                        <div key={index}>
                            <Link className="card shadow-md" href={`/dashboard/${token.id}`} passHref>
                                <div className="card-body flex justify-between flex-row">
                                    <div className="flex flex-col justify-start">
                                        <h2 className="card-title">
                                            $ {token.name}
                                        </h2>
                                        <p>
                                            Token: {token.value}
                                            <br/>
                                            Created
                                            at: {token.created_at === 0 ? 'Never' : new Date(token.created_at).toLocaleDateString()}
                                            <br/>
                                            Owner: {token.owner}
                                        </p>
                                    </div>w
                                    <div className="flex flex-col gap-2">
                                        {authInfo && authInfo.ok && (authInfo.is_admin || token.owner === authInfo.email) && (
                                            <>
                                                <div className="">
                                                    <button className="btn btn-error"
                                                            onClick={() => handleDeleteClick(token.id)}><DeleteIcon sx={{ color: "white" }}/>
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                        <div>
                                            <Link className="" href={`/dashboard/${token.id}`} passHref>
                                                <button className="btn btn-secondary">
                                                    <VisibilityIcon sx={{ color: "white" }}/>
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    )
                )}
            </div>
            <div className="flex justify-between items-center mt-4">
                <div className="flex gap-2">
                    <button
                        className="btn btn-primary"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Create new Project
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

export default Dashboard;