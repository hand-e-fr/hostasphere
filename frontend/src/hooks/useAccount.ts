import { useEffect, useState } from 'react';

interface Account {
    roles: any[];
    organizations: any[];
    id: string;
    username: string;
    email: string;
    password: string;
    created_at: string;
}

const useAccount = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [account, setAccount] = useState<Account | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            setIsConnected(false);
            setIsLoaded(true);
            return;
        }

        const fetchAccount = async () => {
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
                console.log(account);
                setIsConnected(true);
                setIsLoaded(true);
            } catch (err: unknown) {
                setError((err as Error).message);
                setIsConnected(false);
                setIsLoaded(true);
            }
        };

        fetchAccount().then();
    }, []);

    return { isConnected, isLoaded, account, error, setIsConnected, setIsLoaded, setAccount };
};

export default useAccount;