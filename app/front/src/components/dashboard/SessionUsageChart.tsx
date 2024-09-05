import React from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import useSessionData from '@/hooks/profiler/useSessionData';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface UsageChartProps {
    sessionuuid: string;
}

const UsageChart: React.FC<UsageChartProps> = ({ sessionuuid }) => {
    const { session, functions, loading, error } = useSessionData(sessionuuid);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!session || !functions) return <p>No data available</p>;

    const memoryUsageData = session.memoryusage.map(({ time, value }) => ({ x: time * 1000, y: value }));
    const cpuUsageData = session.cpuusage.map(({ time, value }) => ({ x: time * 1000, y: value }));
    const diskUsageData = session.diskusage.map(({ time, value }) => ({ x: time * 1000, y: value }));
    const networkUsageData = session.networkusage.map(({ time, value }) => ({ x: time * 1000, y: value }));

    // Prepare data for function execution points
    const functionPoints = functions.map((func) => ({
        x: func.starttime * 1000,
        y: 0, // Place function points on baseline
        details: `Function: ${func.functionname}, Execution Time: ${func.executiontime} ms`
    }));

    const series = [
        {
            name: 'Memory Usage',
            data: memoryUsageData,
        },
        {
            name: 'CPU Usage',
            data: cpuUsageData,
        },
        {
            name: 'Disk Usage',
            data: diskUsageData,
        },
        {
            name: 'Network Usage',
            data: networkUsageData,
        },
        {
            name: 'Function Calls',
            data: functionPoints,
        },
    ];

    const options: ApexOptions = {
        chart: {
            type: 'line',
            height: 350,
            zoom: {
                enabled: true,
                type: 'x',
                autoScaleYaxis: true,
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: 'smooth',
        },
        xaxis: {
            type: 'datetime',
            title: {
                text: 'Time',
            },
        },
        yaxis: {
            title: {
                text: 'Usage',
            },
        },
        tooltip: {
            x: {
                format: 'dd MMM yyyy HH:mm:ss',
            },
            y: {
                formatter: (val: number, { series, seriesIndex, dataPointIndex, w }: any) => {
                    if (seriesIndex === 4) { // Function Calls
                        return w.config.series[seriesIndex].data[dataPointIndex].details;
                    }
                    return val.toFixed(2);
                },
            },
        },
        legend: {
            position: 'top',
            horizontalAlign: 'center',
        },
    };

    return (
        <div className="p-4 bg-white shadow rounded-lg">
            <ReactApexChart options={options} series={series} type="line" height={500} />
        </div>
    );
};

export default UsageChart;