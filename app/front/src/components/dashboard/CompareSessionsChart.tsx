import React from 'react'
import dynamic from 'next/dynamic'
import { UsageAtTime } from '@/types/SessionData'
import {ApexOptions} from "apexcharts";

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface SessionChartsProps {
    session1Data: UsageAtTime[];
    session2Data: UsageAtTime[];
}

const SessionCharts: React.FC<SessionChartsProps> = ({ session1Data, session2Data }) => {
    const chartOptions: ApexOptions = {
        chart: {
            type: 'line',
            height: 350,
            zoom: {
                enabled: true
            }
        },
        title: {
            text: 'Session Comparison - CPU & Memory Usage',
            align: 'left'
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
                data: session1Data.map((point) => [point.time, point.memoryusage]),
            },
            {
                name: 'Session 2',
                data: session2Data.map((point) => [point.time, point.memoryusage]),
            },
        ],
    }

    return (
        <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
                <h2 className="card-title">Session Comparison Chart</h2>
                <ApexChart options={chartOptions} series={chartOptions.series} type="line" height={500} />
            </div>
        </div>
    )
}

export default SessionCharts
