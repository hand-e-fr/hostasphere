import React from 'react';
import dynamic from 'next/dynamic';
import useProfilerData from "@/hooks/useProfilerController";
import {ApexOptions} from "apexcharts";

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface CPUUsageColumnChartProps {
    tokenId: string;
    sortFields?: string[];
}

const CPUUsageColumnChart: React.FC<CPUUsageColumnChartProps> = ({ tokenId, sortFields = [] }) => {
    const { data, loading, error } = useProfilerData(tokenId, sortFields);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!data) return <p>No data available</p>;

    const series = [{
        name: 'CPU Usage',
        data: data.map(item => ({
            x: item.functionname,
            y: item.cpuusage
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
                text: 'CPU Usage (%)',
            },
        },
        title: {
            text: 'CPU Usage by Function',
            align: 'center',
        },
    };

    return (
        <div>
            <ReactApexChart options={options} series={series} type="bar" height={350} />
        </div>
    );
};

export default CPUUsageColumnChart;