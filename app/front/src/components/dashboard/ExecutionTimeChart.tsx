import React from 'react';
import dynamic from 'next/dynamic';
import useProfilerData from "@/hooks/useProfilerController";
import {ApexOptions} from "apexcharts";

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

    const groupedData = data.reduce((acc, item) => {
        if (!acc[item.functionid]) {
            acc[item.functionid] = {
                name: item.functionname,
                data: [],
            };
        }
        acc[item.functionid].data.push({
            x: new Date(item.starttime * 1000).toLocaleString(),
            y: (item.executiontime * 1000 || 0),
        });
        return acc;
    }, {} as Record<string, { name: string; data: { x: string; y: number }[] }>);

    const series = Object.values(groupedData);

    const options: ApexOptions = {
        chart: {
            type: 'line',
            height: 350,
        },
        xaxis: {
            type: 'category',
            title: {
                text: 'Execution Start Time',
                style: {
                    color: '#fff',
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
                    color: '#fff',
                },
            },
            labels: {
                style: {
                    colors: '#fff',
                },
            },
        },
        title: {
            text: 'Execution Time Over Start Time',
            align: 'center',
            style: {
                color: '#fff',
            },
        },
        tooltip: {
            theme: 'dark',
            shared: false,
            y: {
                formatter: function (val) {
                    return (val / 1000000).toFixed(0)
                }
            }
        },
        legend: {
            labels: {
                colors: '#fff',
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