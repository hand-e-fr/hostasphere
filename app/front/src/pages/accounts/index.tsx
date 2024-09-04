import React, {useEffect, useState} from 'react';
import useUserController, {CreateUserRequest, User, Users} from "@/hooks/useUserController";
import Link from "next/link";
import {useAuthController} from "@/hooks/useAuthController";
import Loading from "@/components/Loading";
import RegisterAccountModal from '@/components/account/RegisterAccountModal';

const Accounts = () => {
    const {checkToken} = useAuthController();
    const {getUsers, createUser, loading, error} = useUserController();
    const [authLoading, setAuthLoading] = useState(true);
    const [users, setUsers] = useState<Users | null>(null);
    const [page, setPage] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const limit = 8;

    useEffect(() => {
        checkToken().then((response) => {
            if (response.ok && response.is_admin) {
                setAuthLoading(false);
            }
        });
    }, []);

    useEffect(() => {
        getUsers(page, limit).then((users) => {
            setUsers(users);
        });
    }, [page]);

    const handleRegister = (userData: CreateUserRequest) => {
        createUser(userData).then((success) => {
            if (success) {
                getUsers(page, limit).then((users) => {
                    setUsers(users);
                });
                setIsModalOpen(false);
            } else {
                alert(`Failed to register user: ${error}`);
            }
        });
    };

    if (authLoading) return <Loading/>;

    const handlePage = (page: number) => {
        if (page < 0) {
            page = 0;
        }
        getUsers(page, limit).then((users) => {
            setUsers(users);
            setPage(page);
        });
    };

    return (
        <>
            <div className="overflow-x-auto">
                <div>
                    <h1 className="text-2xl font-bold">Accounts</h1>
                </div>
                <table className="table table-zebra">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Admin</th>
                        <th>Created At</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {users && users.users ? users.users.map((user: User) => (
                        <tr key={user.id}>
                            <td>
                                <p className="font-bold">{user.first_name} {user.last_name}</p>
                            </td>
                            <td>
                                {user.email}
                            </td>
                            <td>
                                {user.is_admin ? 'Yes' : 'No'}
                            </td>
                            <td>
                                {new Date(user.created_at).toLocaleDateString()}
                            </td>
                            <th className="w-0">
                                <Link href={`/accounts/${user.id}`}>
                                    <button className="btn btn-info btn-sm">details</button>
                                </Link>
                            </th>
                        </tr>
                    )) : null}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-between items-center mt-4">
                <div className="flex gap-2">
                    <button className="btn btn-secondary" onClick={() => setIsModalOpen(true)}>Register new Account
                    </button>
                </div>
                <div className="join">
                    <button className="join-item btn" onClick={() => handlePage(page - 1)}>«</button>
                    <button className="join-item btn">{page + 1}</button>
                    <button className="join-item btn" onClick={() => handlePage(page + 1)}>»</button>
                </div>
            </div>
            <RegisterAccountModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onRegister={handleRegister}
            />
        </>
    );
};

export default Accounts;