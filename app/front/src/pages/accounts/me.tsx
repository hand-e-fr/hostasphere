import React from 'react';
import {useRouter} from "next/router";
import {User, useUserController} from "@/hooks/profiler/useUserController";

const Account = () => {
    const {getUser, loading, error} = useUserController();
    const [user, setUser] = React.useState<User | null>(null);
    const router = useRouter();

    React.useEffect(() => {
        getUser().then((user) => {
            setUser(user);
        });
    }, []);

    return (
        <div className="w-full max-w-md">
            <h1 className="text-2xl font-bold mb-4 text-center">
                My Account
            </h1>
            <p className="mb-4 text-center">

            </p>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {loading && <p className="text-center">Loading...</p>}
            {user && (
                <div>
                    <p className="mb-4">
                        <strong>Email:</strong> {user.email}
                    </p>
                    <p className="mb-4">
                        <strong>Id:</strong> {user.id}
                    </p>
                    <p className="mb-4">
                        <strong>First Name:</strong> {user.first_name}
                    </p>
                    <p className="mb-4">
                        <strong>Last Name:</strong> {user.last_name}
                    </p>
                    <p className="mb-4">
                        <strong>Admin:</strong> {user.is_admin ? 'Yes' : 'No'}
                    </p>
                    <p className="mb-4">
                        <strong>Created At:</strong> {new Date(user.created_at).toLocaleString()}
                    </p>
                </div>
            )}
        </div>
    );
};

export default Account;