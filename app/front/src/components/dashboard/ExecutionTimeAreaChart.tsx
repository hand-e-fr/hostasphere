import React from 'react';
import dynamic from 'next/dynamic';
import useProfilerData from "@/hooks/profiler/useProfilerController";
import {ApexOptions} from "apexcharts";
import {FuncParam} from "@/types/ProfilerData";

const ReactApexChart = dynamic(() => import('react-apexcharts'), {ssr: false});

interface ExecutionTimeAreaChartProps {
    tokenId: string;
    sortFields?: string[];
}

const ExecutionTimeAreaChart: React.FC<ExecutionTimeAreaChartProps> = ({tokenId, sortFields = []}) => {
    const {data, loading, error} = useProfilerData(tokenId, sortFields);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!data) return <p>No data available</p>;

    // Group data by function name and detect version changes
    const groupedData = data.reduce((acc, item) => {
        if (!acc[item.functionname]) {
            acc[item.functionname] = {data: [], lastFunctionId: null};
        }
        const functionData = acc[item.functionname];

        if (functionData.lastFunctionId !== item.functionid) {
            functionData.data.push({
                x: item.starttime * 1000, // Convert to milliseconds
                y: item.executiontime * 1000, // Convert to milliseconds
                versionChange: true, // Mark version change
                params: item.funcparams // Store parameters
            });
            functionData.lastFunctionId = item.functionid;
        } else {
            functionData.data.push({
                x: item.starttime * 1000,
                y: item.executiontime * 1000,
                versionChange: false,
                params: item.funcparams
            });
        }
        return acc;
    }, {} as Record<string, {
        data: { x: number; y: number; versionChange: boolean; params: FuncParam[] }[];
        lastFunctionId: string | null
    }>);

    const series = Object.keys(groupedData).map(functionName => ({
        name: functionName,
        data: groupedData[functionName].data
    }));

    // Generate annotations for version changes
    const annotations = {
        xaxis: Object.values(groupedData).flatMap(group =>
            group.data
                .filter(point => point.versionChange)
                .map(point => ({
                    x: point.x,
                    borderColor: '#FF4560',
                    label: {
                        style: {
                            color: '#fff',
                            background: '#FF4560'
                        },
                        text: 'Version Change'
                    }
                }))
        )
    };

    const options: ApexOptions = {
        chart: {
            type: 'area',
            height: 350,
            zoom: {
                enabled: true,
                type: 'x',
                autoScaleYaxis: true
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth', // Spline style
        },
        xaxis: {
            type: 'datetime',
            title: {
                text: 'Execution Start Time',
            },
        },
        yaxis: {
            title: {
                text: 'Execution Time (ms)',
            },
        },
        title: {
            text: 'Execution Time Over Time by Function',
            align: 'center',
        },
        tooltip: {
            x: {
                format: 'dd MMM yyyy HH:mm:ss'
            },
            y: {
                formatter: (val, {seriesIndex, dataPointIndex, w}) => {
                    const pointData = w.config.series[seriesIndex].data[dataPointIndex];
                    var params;
                    if (pointData && pointData.params) {
                        params = pointData.params.map((param: FuncParam) => `${param.argname}: ${param.arg} (${param.type})`).join(', ');
                    } else {
                        params = 'N/A';
                    }
                    return `
                        <div>
                            <p><strong>Execution Time:</strong> ${val !== undefined && val.toFixed(2)} ms</p>
                            <p><strong>Parameters:</strong> ${params}</p>
                        </div>
                    `;
                }
            }
        },
        legend: {
            position: 'top',
            horizontalAlign: 'center'
        },
        annotations: annotations
    };

    return (
        <div>
            <ReactApexChart options={options} series={series} type="area" height={500}/>
        </div>
    );
};

export default ExecutionTimeAreaChart;