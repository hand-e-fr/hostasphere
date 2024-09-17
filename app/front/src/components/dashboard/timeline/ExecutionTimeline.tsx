import React from 'react';
import dynamic from 'next/dynamic';
import {ApexOptions} from 'apexcharts';
import {SessionData} from "@/types/SessionData";
import {ProfilerData} from "@/types/ProfilerData";

const ReactApexChart = dynamic(() => import('react-apexcharts'), {ssr: false});

interface ExecutionTimelineProps {
    session: SessionData;
    functions: ProfilerData[];
    hideTrackAnnotations?: boolean;
}

const ExecutionTimeline: React.FC<ExecutionTimelineProps> = ({session, functions, hideTrackAnnotations}) => {
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

    const series = [
        {
            data: [
                {
                    x: 'Analysis',
                    y: [
                        new Date('2019-02-27').getTime(),
                        new Date('2019-03-04').getTime()
                    ],
                    fillColor: '#008FFB'
                },
                {
                    x: 'Design',
                    y: [
                        new Date('2019-03-04').getTime(),
                        new Date('2019-03-08').getTime()
                    ],
                    fillColor: '#00E396'
                },
                {
                    x: 'Coding',
                    y: [
                        new Date('2019-03-07').getTime(),
                        new Date('2019-03-10').getTime()
                    ],
                    fillColor: '#775DD0'
                },
                {
                    x: 'Testing',
                    y: [
                        new Date('2019-03-08').getTime(),
                        new Date('2019-03-12').getTime()
                    ],
                    fillColor: '#FEB019'
                },
                {
                    x: 'Deployment',
                    y: [
                        new Date('2019-03-12').getTime(),
                        new Date('2019-03-17').getTime()
                    ],
                    fillColor: '#FF4560'
                }
            ]
        },
    ];

    const options: ApexOptions = {
        chart: {
            height: 350,
            type: 'rangeBar'
        },
        plotOptions: {
            bar: {
                horizontal: true,
                distributed: true,
                dataLabels: {
                    hideOverflowingLabels: false
                }
            }
        },
        dataLabels: {
            enabled: true,
            style: {
                colors: ['#f3f4f5', '#fff']
            }
        },
        xaxis: {
            type: 'datetime'
        },
        yaxis: {
            show: false
        },
        grid: {
            row: {
                colors: ['#f3f4f5', '#fff'],
                opacity: 1
            }
        }
    };

    return (
        <div className="p-4 bg-white shadow rounded-lg">
            <ReactApexChart options={options} series={series} type="line" height={500}/>
        </div>
    );
};

export default ExecutionTimeline;