import {useContext} from "react";
import {UserContext, UserContextType} from "@/context/UserContext";

const MyAccount = () => {
    const { isConnected, isLoaded, account } = useContext<UserContextType>(UserContext);

    return (
        <div className="w-full max-w-md p-8 space-y-3 rounded-xl bg-base-100 shadow-md">
            <h1 className="text-2xl font-bold text-center">Account</h1>
            {isLoaded && isConnected && account && (
                <div>
                    <p>Username: {account.username}</p>
                    <p>{account.roles.length > 1 ? 'Roles' : 'Role'}: {account.roles.join(', ')}</p>
                    <p>Email: {account.email}</p>
                    <p>Created At: {new Date(Number(account.created_at)).toLocaleString()}</p>
                </div>
            )}
            {isLoaded && !isConnected && (
                <p className="text-red-500">You are not connected.</p>
            )}
        </div>
    );
};

export default MyAccount;