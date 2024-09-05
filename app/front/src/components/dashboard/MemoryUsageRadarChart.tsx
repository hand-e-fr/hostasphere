import React from 'react';
import dynamic from 'next/dynamic';
import useProfilerData from "@/hooks/profiler/useProfilerController";
import {ApexOptions} from "apexcharts";

const ReactApexChart = dynamic(() => import('react-apexcharts'), {ssr: false});

interface MemoryUsageRadarChartProps {
    tokenId: string;
    sortFields?: string[];
}

const MemoryUsageRadarChart: React.FC<MemoryUsageRadarChartProps> = ({tokenId, sortFields = []}) => {
    const {data, loading, error} = useProfilerData(tokenId, sortFields);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!data) return <p>No data available</p>;

    const series = [{
        name: 'Memory Usage',
        data: data.map(item => item.memoryusage)
    }];

    const options: ApexOptions = {
        chart: {
            type: 'radar',
            height: 350,
        },
        xaxis: {
            categories: data.map(item => item.functionname),
        },
        title: {
            text: 'Memory Usage by Function',
            align: 'center',
        },
    };

    return (
        <div>
            <ReactApexChart options={options} series={series} type="radar" height={350}/>
        </div>
    );
};

export default MemoryUsageRadarChart;