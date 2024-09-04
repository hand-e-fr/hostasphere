import React from 'react';
import dynamic from 'next/dynamic';
import useProfilerData from "@/hooks/useProfilerController";
import {ApexOptions} from "apexcharts";

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ExecutionTimeColumnChartProps {
    tokenId: string;
    sortFields?: string[];
}

const ExecutionTimeColumnChart: React.FC<ExecutionTimeColumnChartProps> = ({ tokenId, sortFields = [] }) => {
    const { data, loading, error } = useProfilerData(tokenId, sortFields);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!data) return <p>No data available</p>;

    const series = [{
        name: 'Execution Time',
        data: data.map(item => ({
            x: item.functionname,
            y: item.executiontime * 1000 // Convert to milliseconds
        }))
    }];

    const options: ApexOptions = {
        chart: {
            type: 'bar',
            height: 350,
        },
        xaxis: {
            title: {
                text: 'Function Name',
            },
        },
        yaxis: {
            title: {
                text: 'Execution Time (ms)',
            },
        },
        title: {
            text: 'Execution Time by Function',
            align: 'center',
        },
    };

    return (
        <div>
            <ReactApexChart options={options} series={series} type="bar" height={350} />
        </div>
    );
};

export default ExecutionTimeColumnChart;