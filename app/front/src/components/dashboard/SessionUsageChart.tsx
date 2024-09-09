import React from 'react';
import dynamic from 'next/dynamic';
import {ApexOptions} from 'apexcharts';
import {SessionData} from "@/types/SessionData";
import {ProfilerData} from "@/types/ProfilerData";

const ReactApexChart = dynamic(() => import('react-apexcharts'), {ssr: false});

interface UsageChartProps {
    session: SessionData;
    functions: ProfilerData[];
    hideTrackAnnotations?: boolean;
}

const UsageChart: React.FC<UsageChartProps> = ({session, functions, hideTrackAnnotations}) => {
    const memoryUsageData = session.memoryusage.map(({time, memoryusage}) => ({x: time * 1000, y: memoryusage}));
    const cpuUsageData = session.cpuusage.map(({time, memoryusage}) => ({x: time * 1000, y: memoryusage}));
    const diskUsageData = session.diskusage.map(({time, memoryusage}) => ({x: time * 1000, y: memoryusage}));
    const networkUsageData = session.networkusage.map(({time, memoryusage}) => ({x: time * 1000, y: memoryusage}));

    var trackAnnotations: { x: number; borderColor: string; label: { borderColor: string; style: { color: string; background: string; }; text: string; }; }[] = [];

    if (!hideTrackAnnotations && session.trackannotations) {
        trackAnnotations = session.trackannotations.map((track) => ({
            x: track.time * 1000,
            borderColor: track.color,
            label: {
                borderColor: track.color,
                style: {
                    color: '#fff',
                    background: track.color,
                },
                text: track.annotation
            },
        }));
    }

    const functionAnnotations = functions.map((func) => ({
        x: func.starttime * 1000,
        y: func.memoryusage,
        marker: {
            size: 6,
            fillColor: '#FF4560',
            strokeColor: '#fff',
            cssClass: 'apexcharts-custom-class',
        },
        label: {
            borderColor: '#FF4560',
            offsetY: 0,
            style: {
                color: '#fff',
                background: '#FF4560',
            },
            text: func.functionname,
        }
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
                formatter: (val: number) => (val !== null && val !== undefined) ? val.toFixed(2) : '0',
            },
        },
        legend: {
            position: 'top',
            horizontalAlign: 'center',
        },
        annotations: {
            xaxis: [
                {
                    x: session.starttime * 1000,
                    borderColor: '#00E396',
                    label: {
                        borderColor: '#00E396',
                        style: {
                            color: '#fff',
                            background: '#00E396',
                        },
                        text: 'Session Start',
                    },
                },
                {
                    x: session.endtime * 1000,
                    borderColor: '#FF4560',
                    label: {
                        borderColor: '#FF4560',
                        style: {
                            color: '#fff',
                            background: '#FF4560',
                        },
                        text: 'Session End'
                    },
                },
                ...trackAnnotations,
            ],
            points: functionAnnotations,
        },
    };

    return (
        <div className="p-4 bg-white shadow rounded-lg">
            <ReactApexChart options={options} series={series} type="line" height={500}/>
        </div>
    );
};

export default UsageChart;