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

export const usePricingData = (source: string = 'docsbot'): {
    data: PricingData | null;
    setData: (value: (((prevState: (PricingData | null)) => (PricingData | null)) | PricingData | null)) => void;
    loading: boolean;
    error: string | null
} => {
    const [data, setData] = useState<PricingData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPricingData = async () => {
            try {
                setLoading(true);

                const response = await fetch(
                    `http://california-a.tensordockmarketplace.com:20426/api/pricing/?source=${encodeURIComponent(source)}`
                );

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
    }, [source]);

    return { data, setData, loading, error };
};

export type { Model, PricingData, UsePricingDataResult };
