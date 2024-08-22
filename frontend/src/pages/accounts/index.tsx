import React, {useContext, useEffect} from 'react';
import {UserContext, UserContextType} from "@/context/UserContext";
import {AccountList} from "@/hooks/useAccount";

const Accounts = () => {
    const {getAccounts} = useContext<UserContextType>(UserContext);
    const [accountList, setAccountList] = React.useState<AccountList>({ accounts: [], total: 0 });
    const [page, setPage] = React.useState(1);
    const limit = 20;

    useEffect(() => {
        getAccounts(1, limit).then((data) => {
            setAccountList(data);
        });
    }, []);

    const handlePage = (page: number) => {
        if (page < 1) {
            page = 1;
        }
        getAccounts(page, limit).then((data) => {
            setAccountList(data);
            setPage(page);
        });
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Accounts</h1>
            <div className="overflow-x-auto">
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
                        <tr key={account.id} className={index % 2 === 0 ? 'bg-base-200' : ''}>
                            <td>{index + 1}</td>
                            <td>{account.username}</td>
                            <td>{account.email}</td>
                            <td>{account.roles.join(', ')}</td>
                            <td>{new Date(Number(account.created_at)).toLocaleString()}</td>
                            <td className="flex gap-2">
                                <button className="btn btn-warning">Edit</button>
                                <button className="btn btn-error">Delete</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className="flex justify-between items-center mt-4">
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