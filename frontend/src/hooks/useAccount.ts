import {useEffect, useState} from 'react';

interface Account {
    username: string;
    id: string;
    email: string;
    created_at: string;
    roles: string[];
    organizations: any[];
    password: string;
}

interface AccountList {
    accounts: Account[];
    total: number;
}

const useAccount = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [account, setAccount] = useState<Account | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchAccount = async (token: string = localStorage.getItem('token') || '') => {
        try {
            const res = await fetch('/api/account/get', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`,
                },
                body: "{}",
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error);
            }

            const data = await res.json();
            setAccount(data.account);
            console.log('useAccount fetchAccount:', data.account);
            setIsConnected(true);
            setIsLoaded(true);
        } catch (err: unknown) {
            setError((err as Error).message);
            setIsConnected(false);
            setIsLoaded(true);
        }
    };

    const getAccounts = async (page: number = 1, limit: number = 10, query: string = '') => {
        const res = await fetch('/api/account/list', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${localStorage.getItem('token') || ''}`,
            },
            body: JSON.stringify({ page, limit, query }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            setError(errorData.error);
            return { accounts: [], total: 0 } as AccountList;
        }

        const data = await res.json();
        return data as AccountList;
    }

    const clearAccount = () => {
        setAccount(null);
        setIsConnected(false);
        setIsLoaded(true);
    }

    const refreshAccount = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsConnected(false);
            setIsLoaded(true);
            return false;
        }

        try {
            await fetchAccount(token);
            setIsLoaded(true);
            setIsConnected(true);
            return true;
        } catch {
            setIsLoaded(true);
            setIsConnected(false);
            localStorage.removeItem('token');
            return false;
        }
    }

    useEffect(() => {
        refreshAccount().then();
    }, []);

    return { isConnected, isLoaded, account, error, setIsConnected, setIsLoaded,
        setAccount, fetchAccount, clearAccount, getAccounts, refreshAccount };
};

export default useAccount;
export type { Account };
export type { AccountList };