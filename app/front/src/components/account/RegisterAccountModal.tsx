import React, {useCallback, useState} from 'react';

interface RegisterAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRegister: (userData: { email: string; firstName: string; lastName: string; password: string }) => void;
}

const RegisterAccountModal: React.FC<RegisterAccountModalProps> = ({ isOpen, onClose, onRegister }) => {
    const [email, setEmail] = useState('');
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onRegister({ email, first_name, last_name, password });
    };

    // if user clicks outside of modal, close it
    const handleOutsideClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose();
    };

    if (!isOpen) return null; // Ensure modal is not rendered if not open

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" id="modal" onClick={handleOutsideClick}>
            <div className="bg-base-100 rounded-lg shadow-lg p-6 w-96">
                <h2 className="font-bold text-lg">Register New Account</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="adminEmail" className="block text-sm font-medium">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                               className="input input-bordered w-full mt-1"/>
                    </div>
                    <div className="flex w-full">
                        <div className="card grid h-20 flex-grow place-items-center">
                            <div className="mb-4">
                                <label htmlFor="adminFirstName" className="block text-sm font-medium">First Name</label>
                                <input type="text" value={first_name} onChange={(e) => setFirstName(e.target.value)}
                                       required
                                       className="input input-bordered w-full mt-1"/>
                            </div>
                        </div>
                        <div className="divider divider-horizontal"></div>
                        <div className="card grid h-20 flex-grow place-items-center">
                            <div className="mb-4">
                                <label htmlFor="adminLastName" className="block text-sm font-medium">Last Name</label>
                                <input type="text" value={last_name} onChange={(e) => setLastName(e.target.value)}
                                       required
                                       className="input input-bordered w-full mt-1"/>
                            </div>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="adminPassword" className="block text-sm font-medium">Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                               className="input input-bordered w-full mt-1"/>
                    </div>
                    <div className="modal-action">
                        <button type="button" className="btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-secondary">Register</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterAccountModal;