import React, { useState, useEffect } from 'react';
import { Model, usePricingData } from '@/hooks/usePricingData';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

type SortType = {
    key: keyof Model | 'average_price' | null;
    direction: 'ascending' | 'descending';
};

const sources = ['docsbot', 'botgenuity', 'huggingface', 'huhuhang'];

const LlmCosts = () => {
    const [selectedSource, setSelectedSource] = useState<string>('docsbot');
    const { data, setData, error } = usePricingData(selectedSource);

    const [filteredData, setFilteredData] = useState<Model[] | null>([]);
    const [sortConfig, setSortConfig] = useState<SortType>({ key: null, direction: 'ascending' });
    const [providerFilter, setProviderFilter] = useState('');
    const [modelFilter, setModelFilter] = useState('');
    const [contextFilter, setContextFilter] = useState('');

    useEffect(() => {
        if (data && data.pricing_data.length > 0) {
            applyFiltersAndSorting();
        }
    }, [data, modelFilter, providerFilter, contextFilter, sortConfig]);

    const applyFiltersAndSorting = () => {
        let updatedData = null;

        if (data) {
            updatedData = [...data.pricing_data];
        }

        if (updatedData) {
            if (providerFilter) {
                updatedData = updatedData.filter((item) =>
                    item.provider.toLowerCase().includes(providerFilter.toLowerCase())
                );
            }

            if (modelFilter) {
                updatedData = updatedData.filter((item) =>
                    item.model.toLowerCase().includes(modelFilter.toLowerCase())
                );
            }

            if (contextFilter) {
                updatedData = updatedData.filter((item) =>
                    item.context.toLowerCase().includes(contextFilter.toLowerCase())
                );
            }

            if (sortConfig.key) {
                if (sortConfig.key === 'average_price') {
                    updatedData.sort((a, b) => {
                        const avgA = (a.input_tokens_price + a.output_tokens_price) / 2;
                        const avgB = (b.input_tokens_price + b.output_tokens_price) / 2;

                        if (avgA < avgB) {
                            return sortConfig.direction === 'ascending' ? -1 : 1;
                        }
                        if (avgA > avgB) {
                            return sortConfig.direction === 'ascending' ? 1 : -1;
                        }
                        return 0;
                    });
                } else {
                    updatedData.sort((a, b) => {
                        const key = sortConfig.key as keyof Model;
                        if (a[key] < b[key]) {
                            return sortConfig.direction === 'ascending' ? -1 : 1;
                        }
                        if (a[key] > b[key]) {
                            return sortConfig.direction === 'ascending' ? 1 : -1;
                        }
                        return 0;
                    });
                }
            }

            setFilteredData(updatedData);
        }
    };

    const handleSort = (key: keyof Model | 'average_price' | null) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
            <div className="mb-4">
                <h1 className="text-2xl font-bold">LLM Pricing</h1>
            </div>

            {/* Source Filter */}
            <div className="mb-4 flex flex-col items-start">
                <label className="mr-2">Select Source: </label>
                <select
                    value={selectedSource}
                    onChange={(e) => {
                        setSelectedSource(e.target.value);
                        setFilteredData([]);
                        setData(null);
                    }}
                    className="select select-bordered w-44 select-sm"
                >
                    {sources.map((source) => (
                        <option key={source} value={source}>
                            {source.charAt(0).toUpperCase() + source.slice(1)}
                        </option>
                    ))}
                </select>
            </div>

            {/* Total */}
            <div className="mb-4">
                <p>Total: {filteredData ? filteredData.length : 0}</p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <div className="min-w-[890px]">
                    <table className="table">
                        {/* Table head with Sortable Columns */}
                        <thead>
                        <tr className="bg-gray-100">
                            <th onClick={() => handleSort('provider')} className="cursor-pointer">
                                Provider {sortConfig.key === 'provider' && (sortConfig.direction === 'ascending' ?
                                <ArrowDropUpIcon/> : <ArrowDropDownIcon/>)}
                            </th>
                            <th onClick={() => handleSort('model')} className="cursor-pointer">
                                Model {sortConfig.key === 'model' && (sortConfig.direction === 'ascending' ?
                                <ArrowDropUpIcon/> : <ArrowDropDownIcon/>)}
                            </th>
                            <th onClick={() => handleSort('context')} className="cursor-pointer">
                                Context {sortConfig.key === 'context' && (sortConfig.direction === 'ascending' ?
                                <ArrowDropUpIcon/> : <ArrowDropDownIcon/>)}
                            </th>
                            <th onClick={() => handleSort('input_tokens_price')} className="cursor-pointer">
                                1M input
                                tokens {sortConfig.key === 'input_tokens_price' && (sortConfig.direction === 'ascending' ?
                                <ArrowDropUpIcon/> : <ArrowDropDownIcon/>)}
                            </th>
                            <th onClick={() => handleSort('output_tokens_price')} className="cursor-pointer">
                                1M output
                                tokens {sortConfig.key === 'output_tokens_price' && (sortConfig.direction === 'ascending' ?
                                <ArrowDropUpIcon/> : <ArrowDropDownIcon/>)}
                            </th>
                            <th onClick={() => handleSort('average_price')} className="cursor-pointer">
                                Average Price {sortConfig.key === 'average_price' && (sortConfig.direction === 'ascending' ?
                                <ArrowDropUpIcon/> : <ArrowDropDownIcon/>)}
                            </th>
                            <th onClick={() => handleSort('updated')} className="cursor-pointer">
                                Updated {sortConfig.key === 'updated' && (sortConfig.direction === 'ascending' ?
                                <ArrowDropUpIcon/> : <ArrowDropDownIcon/>)}
                            </th>
                        </tr>
                        <tr className="bg-gray-50">
                            <th className="p-3">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Search by Provider"
                                        value={providerFilter}
                                        onChange={(e) => setProviderFilter(e.target.value)}
                                        className="input input-bordered w-44 input-sm"
                                    />
                                </div>
                            </th>
                            <th className="p-3">
                                <input
                                    type="text"
                                    placeholder="Search by Model"
                                    value={modelFilter}
                                    onChange={(e) => setModelFilter(e.target.value)}
                                    className="input input-bordered w-40 input-sm"
                                />
                            </th>
                            <th className="p-3">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Search by Context"
                                        value={contextFilter}
                                        onChange={(e) => setContextFilter(e.target.value)}
                                        className="input input-bordered w-44 input-sm"
                                    />
                                </div>
                            </th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                        </tr>
                        </thead>

                        {/* Table body */}
                        <tbody>
                        {filteredData && filteredData.length > 0 ? (
                            filteredData.map((item: Model, index) => {
                                const avgPrice = (item.input_tokens_price + item.output_tokens_price) / 2;

                                return (
                                    <tr key={index}>
                                        <td>{item.provider}</td>
                                        <td>{item.model}</td>
                                        <td>{item.context}</td>
                                        <td>${item.input_tokens_price}</td>
                                        <td>${item.output_tokens_price}</td>
                                        <td>${avgPrice.toFixed(2)}</td>
                                        <td>{new Date(item.updated).toLocaleDateString()}</td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={8}>
                                    Loading...
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default LlmCosts;
