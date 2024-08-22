import { createContext, ReactNode } from "react";
import useAccount, { Account, AccountList } from "@/hooks/useAccount";

interface UserContextType {
    isConnected: boolean;
    isLoaded: boolean;
    account: Account | null;
    error: string | null;
    setIsConnected: (value: boolean) => void;
    setIsLoaded: (value: boolean) => void;
    setAccount: (account: Account) => void;
    isAuth: () => boolean;
    haveRoles: (roles: string[]) => boolean;
    fetchAccount: (token: string) => Promise<void>;
    clearAccount: () => void;
    getAccounts: (page: number, limit: number, query: string) => Promise<AccountList>;
}

const initialValue: UserContextType = {
    isConnected: false,
    isLoaded: false,
    account: null,
    error: null,
    setIsConnected: () => {},
    setIsLoaded: () => {},
    setAccount: () => {},
    isAuth: () => false,
    haveRoles: () => false,
    fetchAccount: async () => {},
    clearAccount: () => {},
    getAccounts: async () => ({ accounts: [], total: 0, query: '' }),
};

const UserContext = createContext<UserContextType>(initialValue);

interface UserProviderProps {
    children: ReactNode;
}

const UserProvider = ({ children }: UserProviderProps) => {
    const { isConnected, isLoaded, account, error, setIsConnected, setIsLoaded,
        setAccount, fetchAccount, clearAccount, getAccounts } = useAccount();

    const isAuth = () => {
        return isConnected && isLoaded;
    }

    const haveRoles = (roles: string[]) => {
        return isAuth() && roles.every(role => account?.roles.includes(role));
    }

    return (
        <UserContext.Provider value={{ isConnected, isLoaded, account, error, setIsConnected, setIsLoaded,
            setAccount, isAuth, haveRoles, fetchAccount, clearAccount, getAccounts }}>
            {children}
        </UserContext.Provider>
    );
};

export type { UserContextType };
export { UserContext, UserProvider };