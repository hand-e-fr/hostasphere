import React from 'react'
import dynamic from 'next/dynamic'
import { UsageAtTime } from '@/types/SessionData'
import {ApexOptions} from "apexcharts";

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface SessionChartsProps {
    title: string;
    session1Data: UsageAtTime[];
    session2Data: UsageAtTime[];
}

const SessionCharts: React.FC<SessionChartsProps> = ({ title, session1Data, session2Data }) => {
    const chartOptions: ApexOptions = {
        chart: {
            type: 'line',
            height: 350,
            zoom: {
                enabled: true
            }
        },
        colors: ['#008FFB', '#e30000'],
        title: {
            text: title || 'Chart',
            align: 'center'
        },
        xaxis: {
            type: 'numeric',
            title: {
                text: 'Time'
            }
        },
        series: [
            {
                name: 'Session 1',
                data: session1Data.map((point) => [point.time - session1Data[0].time, point.memoryusage]),
            },
            {
                name: 'Session 2',
                data: session2Data.map((point) => [point.time - session2Data[0].time, point.memoryusage]),
            },
        ],
    }

    return (
        <div className="bg-base-100 shadow rounded-lg mt-3">
            <div className="card-body">
                <ApexChart options={chartOptions} series={chartOptions.series} type="line" height={500} />
            </div>
        </div>
    )
}

export default SessionCharts
