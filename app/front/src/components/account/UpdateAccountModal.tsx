import React, {useEffect, useState} from 'react';
import {User} from '@/hooks/useUserController';

interface UpdateAccountModalProps {
    isOpen: boolean;
    user: User | null;
    onClose: () => void;
    onUpdate: (userData: Partial<User>) => void;
}

const UpdateAccountModal: React.FC<UpdateAccountModalProps> = ({isOpen, user, onClose, onUpdate}) => {
    const [firstName, setFirstName] = useState(user?.first_name || '');
    const [lastName, setLastName] = useState(user?.last_name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [password, setPassword] = useState('');
    const [needsPasswordChange, setNeedsPasswordChange] = useState(user?.needs_password_change || false);

    useEffect(() => {
        if (user) {
            setFirstName(user.first_name);
            setLastName(user.last_name);
            setEmail(user.email);
            setNeedsPasswordChange(user.needs_password_change);
        }
    }, [user]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdate({
            first_name: firstName,
            last_name: lastName,
            email,
            password,
            needs_password_change: needsPasswordChange
        });
    };

    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-base-100 p-6 rounded-lg shadow-lg">
                <h2 className="font-bold text-lg mb-4">Update Account</h2>
                <form onSubmit={handleSubmit}>
                    <div className="flex w-full mb-4">
                        <div className="card grid h-20 flex-grow place-items-center">
                            <div className="mb-4">
                                <label htmlFor="adminFirstName" className="block text-sm font-medium">First Name</label>
                                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                                       required
                                       className="input input-bordered w-full mt-1"/>
                            </div>
                        </div>
                        <div className="divider divider-horizontal"></div>
                        <div className="card grid h-20 flex-grow place-items-center">
                            <div className="mb-4">
                                <label htmlFor="adminLastName" className="block text-sm font-medium">Last Name</label>
                                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}
                                       required
                                       className="input input-bordered w-full mt-1"/>
                            </div>
                        </div>
                    </div>
                    <div className="form-control mb-4">
                        <label>Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                               className="input input-bordered w-full"/>
                    </div>
                    <div className="form-control mb-4">
                        <label>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                               className="input input-bordered w-full"/>
                    </div>
                    <div className="form-control mb-4">
                        <label className="cursor-pointer label">
                            <span className="label-text">Needs Password Change</span>
                            <input type="checkbox" checked={needsPasswordChange}
                                   onChange={(e) => setNeedsPasswordChange(e.target.checked)} className="checkbox"/>
                        </label>
                    </div>
                    <div className="modal-action">
                        <button type="submit" className="btn btn-secondary">Update</button>
                        <button type="button" className="btn" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateAccountModal;