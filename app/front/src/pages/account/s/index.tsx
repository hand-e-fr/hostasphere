import React from 'react';
import useUserController, {Users, User} from "@/hooks/useUserController";
import Link from "next/link";

const Accounts = () => {
    const { getUsers, loading, error } = useUserController();
    const [users, setUsers] = React.useState<Users | null>(null);
    const [page, setPage] = React.useState(0);
    const limit = 8;

    React.useEffect(() => {
        getUsers(page, limit).then((users) => {
            setUsers(users);
        });
    }, []);

    const handlePage = (page: number) => {
        if (page < 0) {
            page = 0;
        }
        setUsers(null);
        getUsers(page, limit).then((users) => {
            setUsers(users);
            setPage(page);
        });
    }

    return (
        <div className="bg-base-100 shadow-lg rounded-lg p-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
            <div className="overflow-x-auto">
                <table className="table table-zebra">
                    {/* head */}
                    <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Admin</th>
                        <th>Created At</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {users && users.users.map((user: User) => (
                        <tr key={user.id}>
                            <th className="w-0">
                                <label>
                                    <input type="radio" className="radio" onChange={(e) => {
                                        const radios = document.querySelectorAll('.radio');
                                        radios.forEach((radio) => {
                                            (radio as HTMLInputElement).checked = false;
                                        });
                                        (e.target as HTMLInputElement).checked = true;
                                    }}/>
                                </label>
                            </th>
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
                                <Link href={`/account/${user.id}`}>
                                    <button className="btn btn-info btn-sm">details</button>
                                </Link>
                            </th>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-between items-center mt-4">
                <div className="join">
                    <button className="join-item btn" onClick={() => handlePage(page - 1)}>«</button>
                    <button className="join-item btn">{page + 1}</button>
                    <button className="join-item btn" onClick={() => handlePage(page + 1)}>»</button>
                </div>
                <div className="flex gap-2">
                    <button className="btn btn-secondary">Register new Account</button>
                </div>
            </div>
        </div>
    );
};

export default Accounts;