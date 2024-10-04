import { useState, useEffect } from 'react';

interface Model {
    model: string;
    provider: string;
    input_tokens_price: number;
    output_tokens_price: number;
    context: string;
    source: string;
    updated: string;
}

interface PricingData {
    pricing_data: Model[];
}

interface UsePricingDataParams {
    model_name?: string;
    sort_by?: string;
    order?: 'asc' | 'desc';
}

interface UsePricingDataResult {
    data: PricingData | null;
    loading: boolean;
    error: string | null;
}

export const usePricingData = (params: UsePricingDataParams = {}): UsePricingDataResult => {
    const [data, setData] = useState<PricingData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPricingData = async () => {
            setLoading(true);
            setError(null);

            let queryParams = '';
            const queryStrings = Object.entries(params)
                .filter(([key, value]) => value !== undefined && value !== null)
                .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`);

            if (queryStrings.length > 0) {
                queryParams = `?${queryStrings.join('&')}`;
            }

            try {
                const response = await fetch(`http://california-a.tensordockmarketplace.com:20426/api/pricing/${queryParams}`);

                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }

                const result = await response.json();
                setData(result);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('Unknown error occurred');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchPricingData().then();
    }, [params]);

    return { data, loading, error };
};
