import React, {useContext, useEffect} from 'react';
import {UserContext, UserContextType} from "@/context/UserContext";
import {AccountList} from "@/hooks/useAccount";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import _error from "@/pages/_error";
import {router} from "next/client";

const Accounts = () => {
    const {getAccounts, account} = useContext<UserContextType>(UserContext);

    if (!account || !account.roles.includes('admin')) {
        return (
            <_error statusCode={403} />
        );
    }

    const [accountList, setAccountList] = React.useState<AccountList>({ accounts: [], total: 0 });
    const [page, setPage] = React.useState(1);
    const limit = 8;
    const [query, setQuery] = React.useState('');

    useEffect(() => {
        getAccounts(1, limit, query).then((data) => {
            setAccountList(data);
        });
    }, []);

    const handlePage = (page: number) => {
        if (page < 1) {
            page = 1;
        }
        getAccounts(page, limit, query).then((data) => {
            setAccountList(data);
            setPage(page);
        });
    }

    const updateQuery = () => (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    }

    const handleEdit = (id: string) => {
        router.push(`/accounts/edit/${id}`);
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Accounts</h1>
            <div className="overflow-x-auto">
                <div>
                    <table className="table">
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Roles</th>
                            <th>Create At</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {accountList.accounts.map((account, index) => (
                            <tr key={account.id} className={`${index % 2 === 0 ? 'bg-base-100' : ''} h-[5.5em]`}>
                                <td>{((page - 1) * limit) + (index + 1)}</td>
                                <td>{account.username}</td>
                                <td>{account.email}</td>
                                <td>{account.roles.join(', ')}</td>
                                <td>{new Date(Number(account.created_at)).toLocaleString()}</td>
                                <td className="flex justify-start gap-2">
                                    <button className="btn btn-warning" onClick={() => handleEdit(account.id)}><EditIcon /></button>
                                    <button className="btn btn-error"><DeleteIcon /></button>
                                </td>
                            </tr>
                        ))}
                        {Array.from({length: limit - accountList.accounts.length}).map((_, index) => (
                            <tr key={index + accountList.accounts.length + 1}
                                className={`${(limit - accountList.accounts.length + index) % 2 === 0 ? 'bg-base-100' : ''} h-[5.5em]`}>
                                <td>{((page - 1) * limit) + (index + accountList.accounts.length + 1)}</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div className="divider mt-3"></div>
                <div className="flex justify-between items-center mt-4">
                    <div className="search">
                        <input type="text" className="input input-bordered" placeholder="Search" value={query}
                               onChange={updateQuery()}/>
                    </div>
                    <div className="join">
                        <button className="join-item btn" onClick={() => handlePage(page - 1)}>«</button>
                        <button className="join-item btn">Page {page}</button>
                        <button className="join-item btn" onClick={() => handlePage(page + 1)}>»</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Accounts;