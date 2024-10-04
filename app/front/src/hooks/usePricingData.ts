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

interface UsePricingDataResult {
    data: PricingData | null;
    loading: boolean;
    error: string | null;
}

interface FetchParams {
    model_name?: string;
    sort_by?: string;
    order: "asc" | "desc";
}

export const usePricingData = ({ model_name, sort_by, order }: FetchParams): UsePricingDataResult => {
    const [data, setData] = useState<PricingData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPricingData = async () => {
            try {
                setLoading(true);

                const params = new URLSearchParams();
                if (model_name) params.append('model_name', model_name);
                if (sort_by) params.append('sort_by', sort_by);
                if (order) params.append('order', order);

                const apiURL = `http://california-a.tensordockmarketplace.com:20426/api/pricing/?${params.toString()}`;

                const response = await fetch(apiURL);

                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }

                const result: PricingData = await response.json();

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

        fetchPricingData();
    }, [model_name, sort_by, order]);

    return { data, loading, error };
};
