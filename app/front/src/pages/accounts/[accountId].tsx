import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useUserController, { User } from '@/hooks/useUserController';
import Loading from '@/components/Loading';
import UpdateAccountModal from '@/components/account/UpdateAccountModal';
import Link from "next/link";

const AccountDetails = () => {
    const router = useRouter();
    const { accountId } = router.query;
    const { getUserById, updateUser, deleteUser, loading, error } = useUserController();
    const [user, setUser] = useState<User | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (accountId) {
            getUser(accountId as string);
        }
    }, [accountId]);

    const getUser = async (id: string) => {
        const fetchedUser = await getUserById(id);
        setUser(fetchedUser);
    };

    const handleDelete = async () => {
        if (accountId) {
            const success = await deleteUser(accountId as string);
            if (success) {
                router.push('/accounts');
            } else {
                alert('Failed to delete user');
            }
        }
    };

    const handleUpdate = async (userData: Partial<User>) => {
        if (accountId) {
            const success = await updateUser(accountId as string, userData);
            if (success) {
                getUser(accountId as string);
                setIsModalOpen(false);
            } else {
                alert('Failed to update user');
            }
        }
    };

    if (loading || !user) return <Loading />;

    if (error) return <div>Error: {error}</div>;

    return (
        <div className="bg-base-100 shadow-lg rounded-lg p-6">
            <h1 className="text-2xl font-bold">Account Details</h1>
            <div className="breadcrumbs text-sm">
                <ul>
                    <li><Link href={`/accounts`}>Accounts</Link></li>
                    <li>{user.id}</li>
                </ul>
            </div>
            <div className="mt-4">
                <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Admin:</strong> {user.is_admin ? 'Yes' : 'No'}</p>
                <p><strong>Created At:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
            </div>
            <div className="flex gap-4 mt-4">
                <button className="btn btn-warning" onClick={() => setIsModalOpen(true)}>Update</button>
                <button className="btn btn-error" onClick={handleDelete}>Delete</button>
            </div>
            <UpdateAccountModal
                isOpen={isModalOpen}
                user={user}
                onClose={() => setIsModalOpen(false)}
                onUpdate={handleUpdate}
            />
        </div>
    );
};

export default AccountDetails;