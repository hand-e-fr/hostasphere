import {useContext} from "react";
import {UserContext, UserContextType} from "@/context/UserContext";

const MyAccount = () => {
    const { isConnected, isLoaded, account } = useContext<UserContextType>(UserContext);

    return (
        <div>
            {isLoaded && isConnected && account && (
                <div>
                    <div className="w-full max-w-md p-8 space-y-3 rounded-xl bg-base-100 shadow-md">
                        <h1 className="text-2xl font-bold text-center">Account</h1>
                        <div>
                            <p>Username: {account.username}</p>
                            <p>{account.roles.length > 1 ? 'Roles' : 'Role'}: {account.roles.join(', ')}</p>
                            <p>Email: {account.email}</p>
                            <p>Created At: {new Date(Number(account.created_at)).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            )}
            {isLoaded && !isConnected && (
                <p className="text-red-500">You are not connected.</p>
            )}
            <div className="mt-8 p-8 space-y-3 rounded-xl bg-base-100 shadow-md">
                <h1 className="text-2xl font-bold text-center">Access Tokens</h1>
                <div>
                    <div className="overflow-x-auto">
                        <table className="table">
                            {/* head */}
                            <thead>
                            <tr>
                                <th>
                                    <label>
                                        <input type="checkbox" className="checkbox"/>
                                    </label>
                                </th>
                                <th>Name</th>
                                <th>Value</th>
                                <th>Last refreshed data</th>
                                <th>Permissions</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <th>
                                    <label>
                                        <input type="checkbox" className="checkbox"/>
                                    </label>
                                </th>
                                <td>CLé william</td>
                                <td>hf_...ozNA</td>
                                <td>21/05/2024</td>
                                <td>write</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyAccount;