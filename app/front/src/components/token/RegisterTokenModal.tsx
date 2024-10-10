import React, {useState} from 'react';
import {TokenResponse, useTokenController} from '@/hooks/app/useTokenController';
import {toast} from "react-toastify";

interface RegisterTokenModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const RegisterTokenModal: React.FC<RegisterTokenModalProps> = ({isOpen, onClose}) => {
    const [name, setName] = useState('');
    const [response, setResponse] = useState<TokenResponse | null>(null);
    const {createToken, loading, error} = useTokenController();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await createToken({name});
        if (response) {
            setResponse(response);
        }
    };

    const close = () => {
        setName('');
        setResponse(null);
        onClose();
    }

    if (!isOpen) return null;

    if (response) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-base-100 rounded-lg shadow-lg p-6 w-[30em]">
                    <h2 className="text-xl font-bold mb-4">Token Created</h2>
                    <div>
                        <p className="mb-4">
                            Do not lose this token. You will not be able to see it again.
                        </p>
                        <div className="">
                            <p className="text-sm font-bold">Token:</p>
                            <div className="join flex items-center space-x-2 mt-2 mb-4">
                                <div className="bg-base-200 p-2 rounded-lg overflow-x-scroll flex-1">
                                    <p className="text-sm">{response.token}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(response.token).then(_ =>
                                            toast.success("Token copied to clipboard"));
                                    }}
                                    className="btn btn-neutral">
                                    Copy
                                </button>
                            </div>
                        </div>
                        <button
                            onClick={close}
                            className="btn btn-secondary"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-base-100 rounded-lg shadow-lg p-6 w-96">
                <h2 className="text-xl font-bold mb-4">Register New Token</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Token Name</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                                   className="input input-bordered w-full mt-1"/>
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={close}
                            className="btn btn-neutral mr-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-secondary"
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterTokenModal;