import React from 'react';
import dynamic from 'next/dynamic';
import useProfilerData, {FuncParam, ProfilerData} from "@/hooks/profiler/useProfilerController";
import {ApexOptions} from "apexcharts";

const ReactApexChart = dynamic(() => import('react-apexcharts'), {ssr: false});

interface ExecutionTimeChartProps {
    tokenId: string;
    sortFields?: string[];
}

const ExecutionTimeChart: React.FC<ExecutionTimeChartProps> = ({tokenId, sortFields = []}) => {
    const {data, loading, error} = useProfilerData(tokenId, sortFields);

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
            x: item.starttime * 1000, // Use raw timestamp
            y: (item.executiontime * 1000 || 0),
            details: item // Store the entire item for more details on hover
        });
        return acc;
    }, {} as Record<string, { name: string; data: { x: number; y: number; details: ProfilerData }[] }>);

    const series = Object.values(groupedData);

    const options: ApexOptions = {
        chart: {
            type: 'scatter',
            height: 350,
        },
        xaxis: {
            type: 'datetime', // Use datetime for raw timestamp
            title: {
                text: 'Execution Start Time',
            },
        },
        yaxis: {
            title: {
                text: 'Execution Time (s)',
            },
        },
        title: {
            text: 'Execution Time Over Start Time',
            align: 'center',
        },
        tooltip: {
            theme: 'dark',
            shared: false,
            y: {
                formatter: function (val, {seriesIndex, dataPointIndex, w}) {
                    const details = w.config.series[seriesIndex].data[dataPointIndex].details;
                    return `
                        <div>
                            <p><strong>Execution Time:</strong> ${(val / 100000).toFixed(0)} s</p>
                            <p><strong>Function ID:</strong> ${details.functionid}</p>
                            <p><strong>Function Name:</strong> ${details.functionname}</p>
                            <p><strong>Start Time:</strong> ${new Date(details.starttime * 1000).toLocaleString()}</p>
                            <p><strong>CPU Usage:</strong> ${details.cpuusage.toFixed(2)}%</p>
                            <p><strong>Memory Usage:</strong> ${details.memoryusage.toFixed(2)} MB</p>
                            <p><strong>Function Caller:</strong> ${details.functioncaller}</p>
                            <p><strong>Returned Value:</strong> ${details.returnedvalue.type} - ${details.returnedvalue.value}</p>
                            <p><strong>Function Params:</strong> ${details.funcparams.map((param: FuncParam) => `${param.argname}: ${param.arg} (${param.type})`).join(', ')}</p>
                        </div>
                    `;
                }
            }
        },
        markers: {
            size: 8
        },
    };

    return (
        <div>
            <ReactApexChart options={options} series={series} type="scatter" height={350}/>
        </div>
    );
};

export default ExecutionTimeChart;