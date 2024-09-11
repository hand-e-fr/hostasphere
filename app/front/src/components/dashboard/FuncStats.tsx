import React from 'react';
import dynamic from 'next/dynamic';
import {ApexOptions} from "apexcharts";
import {ProfilerData} from "@/types/ProfilerData";

const ReactApexChart = dynamic(() => import('react-apexcharts'), {ssr: false});

interface ExecutionTimeAreaChartProps {
    profilerData: ProfilerData;
}

const FuncStats: React.FC<ExecutionTimeAreaChartProps> = ({profilerData = []}) => {
    const data: ProfilerData = profilerData as ProfilerData;

    if (!data) return <p>No data available</p>;

    const series = [
        {
            name: 'CPU Usage',
            data: [data.cpuusage]
        },
        {
            name: 'Memory Usage',
            data: [data.memoryusage]
        },
        {
            name: 'Execution Time',
            data: [data.executiontime]
        }
    ];

    const options: ApexOptions = {
        chart: {
            type: 'area',
            height: 350,
            zoom: {
                enabled: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth'
        },
        xaxis: {
            type: 'datetime',
            categories: [new Date(data.startdate).toLocaleDateString()]
        },
        tooltip: {
            x: {
                format: 'dd/MM/yy HH:mm'
            }
        },
        title: {
            text: 'Execution Time',
            align: 'left'
        },
        colors: ['#ff0000', '#00ff00', '#0000ff'],
        legend: {
            position: 'top'
        },
        grid: {
            row: {
                colors: ['#f3f3f3', 'transparent'],
                opacity: 0.5,
            },
        }
    }

    return (
        <div>
            <ReactApexChart options={options} series={series} type="area" height={500}/>
        </div>
    );
};

export default FuncStats;