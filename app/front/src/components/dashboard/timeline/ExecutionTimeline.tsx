import React from 'react';
import dynamic from 'next/dynamic';
import {ApexOptions} from 'apexcharts';
import {SessionData} from "@/types/SessionData";

const ReactApexChart = dynamic(() => import('react-apexcharts'), {ssr: false});

interface ExecutionTimelineProps {
    sessions: SessionData[];
}

const ExecutionTimeline: React.FC<> = ({}) => {
    const series = [
        {
            data: [
                {
                    x: 'Code',
                    y: [
                        new Date('2019-03-02').getTime(),
                        new Date('2019-03-04').getTime()
                    ]
                },
                {
                    x: 'Test',
                    y: [
                        new Date('2019-03-04').getTime(),
                        new Date('2019-03-08').getTime()
                    ]
                },
                {
                    x: 'Validation',
                    y: [
                        new Date('2019-03-08').getTime(),
                        new Date('2019-03-12').getTime()
                    ]
                },
                {
                    x: 'Deployment',
                    y: [
                        new Date('2019-03-12').getTime(),
                        new Date('2019-03-18').getTime()
                    ]
                }
            ]
        }
    ];

    const options: ApexOptions = {
        chart: {
            height: 350,
            type: 'rangeBar',
            toolbar: {
                tools: {
                    download: false,
                    pan: false,
                    zoomin: false,
                    zoomout: false,
                    reset: false,
                    selection: false,
                    zoom: false
                }
            },
            zoom: {
                enabled: false,
            }
        },
        plotOptions: {
            bar: {
                horizontal: true
            }
        },
        xaxis: {
            type: 'datetime'
        }
    };

    return (
        <ReactApexChart options={options} series={series} type="rangeBar" height={500}/>
    );
};

export default ExecutionTimeline;