import React from 'react';
import {usePricingData} from "@/hooks/usePricingData";

// Component to show the LLM Costs
const LlmCosts = () => {
    const { data, loading, error } = usePricingData();

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
            <div className="overflow-x-auto">
                <div className="min-w-[890px]">
                    <table className="table">
                        {/* Table head */}
                        <thead>
                        <tr>
                            <th>
                                <label>
                                    <input type="checkbox" className="checkbox" />
                                </label>
                            </th>
                            <th>Provider</th>
                            <th>Model</th>
                            <th>Context</th>
                            <th>1M input tokens</th>
                            <th>1M output tokens</th>
                            <th>Updated</th>
                        </tr>
                        </thead>
                        {/* Table body */}
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
                                <th>${item.input_tokens_price}</th> {/* 1M input tokens */}
                                <th>${item.output_tokens_price}</th> {/* 1M output tokens */}
                                <th>{new Date(item.updated).toLocaleDateString()}</th>
                            </tr>
                        ))}
                        </tbody>
                        {/* Table foot */}
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
};

export default LlmCosts;
