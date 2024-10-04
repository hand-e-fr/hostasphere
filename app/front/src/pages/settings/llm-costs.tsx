import React, { useState } from 'react';
import {usePricingData} from "@/hooks/usePricingData";

const LlmCosts = () => {
    const [modelName, setModelName] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('');
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');

    const { data, loading, error } = usePricingData({
        model_name: modelName || undefined,
        sort_by: sortBy || undefined,
        order: order || undefined,
    });

    const handleSort = (field: string) => {
        if (sortBy === field) {
            setOrder(order === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setOrder('asc');
        }
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!data || data.pricing_data.length === 0) {
        return <div>No pricing data available</div>;
    }

    return (
        <>
            <div className="my-4">
                <input
                    type="text"
                    placeholder="Filter by model name"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    className="input input-bordered input-primary w-full max-w-xs"
                />
            </div>

            <div className="overflow-x-auto">
                <div className="min-w-[890px]">
                    <table className="table">
                        <thead>
                        <tr>
                            <th>
                                <label>
                                    <input type="checkbox" className="checkbox" />
                                </label>
                            </th>
                            <th onClick={() => handleSort('provider')}>Provider</th>
                            <th onClick={() => handleSort('model')}>Model</th>
                            <th onClick={() => handleSort('context')}>Context</th>
                            <th onClick={() => handleSort('input_tokens_price')}>1M input tokens</th>
                            <th onClick={() => handleSort('output_tokens_price')}>1M output tokens</th>
                            <th onClick={() => handleSort('updated')}>Updated</th>
                        </tr>
                        </thead>

                        <tbody>
                        {data.pricing_data.map((item, index) => (
                            <tr key={index}>
                                <th>
                                    <label>
                                        <input type="checkbox" className="checkbox" />
                                    </label>
                                </th>
                                <td>{item.provider}</td>
                                <td>{item.model}</td>
                                <td>{item.context}</td>
                                <th>${item.input_tokens_price}</th>
                                <th>${item.output_tokens_price}</th>
                                <th>{new Date(item.updated).toLocaleDateString()}</th>
                            </tr>
                        ))}
                        </tbody>
                        <tfoot>
                        <tr>
                            <th></th>
                            <th>Provider</th>
                            <th>Model</th>
                            <th>Context</th>
                            <th>1M input tokens</th>
                            <th>1M output tokens</th>
                            <th>Updated</th>
                        </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </>
    );
}

export default LlmCosts;
