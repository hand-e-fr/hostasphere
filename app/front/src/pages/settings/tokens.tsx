import React from 'react';
import useUserController, {Users, User} from "@/hooks/useUserController";
import Link from "next/link";
import {useAuthController} from "@/hooks/useAuthController";
import Loading from "@/components/Loading";

interface Token {
    id: string;
    name: string;
    value: string;
    last_refreshed: number;
    last_used: number;
    permissions: string[];
}

// list of tokens
const tokens: Token[] = [
    {
        id: '1',
        name: 'John Doe',
        value: 'shs_sqsdqsdqsqsdqds',
        last_refreshed: Date.now(),
        last_used: Date.now(),
        permissions: ['read', 'write'],
    },
    {
        id: '2',
        name: 'Mike Brown',
        value: 'shs_sqsdqsdqsqsdqds',
        last_refreshed: Date.now(),
        last_used: Date.now(),
        permissions: ['read'],
    },
    {
        id: '3',
        name: 'Alice Johnson',
        value: 'shs_sqsdqsdqsqs*5dqds',
        last_refreshed: Date.now(),
        last_used: Date.now(),
        permissions: ['read', 'write'],
    },
    {
        id: '4',
        name: 'Helen Smith',
        value: 'shs_sqsdqsdqsqsdqds',
        last_refreshed: Date.now(),
        last_used: Date.now(),
        permissions: ['read'],
    }
];


const Tokens = () => {
    const { checkToken } = useAuthController();
    const [authLoading, setAuthLoading] = React.useState(true);
    const { getUsers, loading, error } = useUserController();
    const [users, setUsers] = React.useState<Users | null>(null);
    const [page, setPage] = React.useState(0);
    const limit = 8;

    React.useEffect(() => {
        checkToken().then((response) => {
            if (response.ok && response.is_admin) {
                setAuthLoading(false);
            }
        });
    }, []);

    React.useEffect(() => {
        getUsers(page, limit).then((users) => {
            setUsers(users);
        });
    }, [page]);

    if (authLoading) return <Loading/>;

    const handlePage = (page: number) => {
        if (page < 0) {
            page = 0;
        }
        getUsers(page, limit).then((users) => {
            setUsers(users);
            setPage(page);
        });
    }

    return (
        <div className="bg-base-100 shadow-lg rounded-lg p-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
            <div className="overflow-x-auto">
                <div>
                    <h1 className="text-2xl font-bold">Access Tokens</h1>
                </div>
                <table className="table table-zebra">
                    <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Value</th>
                        <th>Last Refreshed Date</th>
                        <th>Last Used Date</th>
                        <th>Permissions</th>
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
                                    }}/>
                                </label>
                            </th>
                            <td>
                                {token.name}
                            </td>
                            <td>
                                {token.value}
                            </td>
                            <td>
                                {new Date(token.last_refreshed).toLocaleDateString()}
                            </td>
                            <td>
                                {new Date(token.last_used).toLocaleDateString()}
                            </td>
                            <td>
                                {token.permissions.join(', ')}
                            </td>
                            <th className="w-0">
                                <Link href={`/account/${token.id}`}>
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
                    <button className="btn btn-secondary">Register new Token</button>
                </div>
            </div>
        </div>
    );
};

export default Tokens;