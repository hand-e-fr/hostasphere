import { useState } from 'react';
import axios from 'axios';

interface CreateTokenRequest {
    name: string;
}

interface Token {
    id: string;
    name: string;
    value: string;
    created_at: number;
    last_used: number;
    owner: string;
}

interface TokenResponse {
    message: string;
    token: string;
}

interface TokensResponse {
    tokens: Token[];
}

interface ExistsTokenResponse {
    exists: boolean;
    id?: string;
}

export const useTokenController = () => {
    const [tokens, setTokens] = useState<Token[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const url = "http://localhost:8080";

    const createToken = async (data: CreateTokenRequest): Promise<TokenResponse | null> => {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found');
            setLoading(false);
            return null;
        }

        try {
            const response = await axios.post<TokenResponse>(url + '/api/token', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setLoading(false);
            return response.data;
        } catch (err: any) {
            setLoading(false);
            setError(err.response?.data?.error || 'An error occurred');
            return null;
        }
    };

    const getTokens = async (): Promise<void> => {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get<TokensResponse>(url + '/api/tokens',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            setTokens(response.data.tokens);
            setLoading(false);
        } catch (err: any) {
            setLoading(false);
            setError(err.response?.data?.error || 'An error occurred');
        }
    };

    const existsToken = async (tokenValue: string): Promise<ExistsTokenResponse | null> => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get<ExistsTokenResponse>(url + `/api/token/${tokenValue}`);
            setLoading(false);
            return response.data;
        } catch (err: any) {
            setLoading(false);
            setError(err.response?.data?.error || 'An error occurred');
            return null;
        }
    };

    const deleteToken = async (tokenId: string): Promise<void> => {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found');
            setLoading(false);
            return;
        }

        try {
            await axios.delete(url + `/api/token/${tokenId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTokens(tokens.filter(token => token.id !== tokenId));
            setLoading(false);
        } catch (err : any) {
            setLoading(false);
            setError(err.response?.data?.error || 'An error occurred');
        }
    };

    return {
        tokens,
        loading,
        error,
        createToken,
        getTokens,
        existsToken,
        deleteToken,
    };
};

export type { Token, TokenResponse, TokensResponse, ExistsTokenResponse, CreateTokenRequest };