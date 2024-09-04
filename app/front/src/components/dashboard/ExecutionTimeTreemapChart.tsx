import React from 'react';
import dynamic from 'next/dynamic';
import useProfilerData from "@/hooks/useProfilerController";
import {ApexOptions} from "apexcharts";

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ExecutionTimeTreemapChartProps {
    tokenId: string;
    sortFields?: string[];
}

const ExecutionTimeTreemapChart: React.FC<ExecutionTimeTreemapChartProps> = ({ tokenId, sortFields = [] }) => {
    const { data, loading, error } = useProfilerData(tokenId, sortFields);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!data) return <p>No data available</p>;

    const series = [{
        data: data.map(item => ({
            x: item.functionname,
            y: item.memoryusage
        }))
    }];

    const options: ApexOptions = {
        chart: {
            type: 'treemap',
            height: 350,
        },
        title: {
            text: 'Memory Usage by Function',
            align: 'center',
        },
    };

    return (
        <div>
            <ReactApexChart options={options} series={series} type="treemap" height={350} />
        </div>
    );
};

export default ExecutionTimeTreemapChart;