import React from 'react';
import dynamic from 'next/dynamic';
import useProfilerData from "@/hooks/useProfilerController";

// Dynamically import the ApexCharts component to prevent SSR issues
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ExecutionTimeChartProps {
    tokenId: string;
    sortFields?: string[];
}

const ExecutionTimeChart: React.FC<ExecutionTimeChartProps> = ({ tokenId, sortFields = [] }) => {
    const { data, loading, error } = useProfilerData(tokenId, sortFields);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!data) return <p>No data available</p>;

    // Group data by functionId
    const groupedData = data.reduce((acc, item) => {
        if (!acc[item.functionid]) {
            acc[item.functionid] = {
                name: item.functionname,
                data: [],
            };
        }
        acc[item.functionid].data.push({
            x: new Date(item.starttime * 1000).toLocaleString(), // Convert Unix timestamp to human-readable format
            y: item.executiontime * 1000, // Convert seconds to milliseconds
        });
        return acc;
    }, {} as Record<string, { name: string; data: { x: string; y: number }[] }>);

    // Convert grouped data into series format
    const series = Object.values(groupedData);

    const options = {
        chart: {
            type: 'line',
            height: 350,
        },
        xaxis: {
            type: 'category',
            title: {
                text: 'Execution Start Time',
                style: {
                    color: '#fff', // Set x-axis title color to white
                },
            },
            labels: {
                style: {
                    colors: '#fff', // Set x-axis labels color to white
                },
            },
        },
        yaxis: {
            title: {
                text: 'Execution Time (s)',
                style: {
                    color: '#fff', // Set y-axis title color to white
                },
            },
            labels: {
                style: {
                    colors: '#fff', // Set y-axis labels color to white
                },
            },
        },
        title: {
            text: 'Execution Time Over Start Time',
            align: 'center',
            style: {
                color: '#fff', // Set chart title color to white
            },
        },
        tooltip: {
            theme: 'dark', // Use dark theme for tooltips
        },
        legend: {
            labels: {
                colors: '#fff', // Set legend text color to white
            },
        },
    };

    return (
        <div>
            <ReactApexChart options={options} series={series} type="line" height={350} />
        </div>
    );
};

export default ExecutionTimeChart;