import React from "react";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const TokenUsageChart = () => {
    const series = [
        {
            name: 'Line Series',
            data: [10, 20, 30, 40, 50, 0, 20, 5, 4, 4, 5, 6, 4, 8, 10, 12, 14, 15, 15, 16, 18, 19, 21],
        },
    ];

    const options = {
        chart: {
            type: 'line',
            toolbar: {
                show: false, // Hide the toolbar
            },
            zoom: {
                enabled: false, // Disable zooming
            },
        },
        stroke: {
            width: 2, // Line width
        },
        xaxis: {
            labels: {
                show: false, // Hide X-axis labels
            },
            axisBorder: {
                show: false, // Hide X-axis border
            },
            axisTicks: {
                show: false, // Hide X-axis ticks
            },
        },
        yaxis: {
            labels: {
                show: false, // Hide Y-axis labels
            },
            axisBorder: {
                show: false, // Hide Y-axis border
            },
            axisTicks: {
                show: false, // Hide Y-axis ticks
            },
        },
        grid: {
            show: false, // Hide grid lines
        },
        tooltip: {
            enabled: false, // Disable tooltip
        },
        markers: {
            size: 0, // Hide markers on data points
        },
    };

    return (
        <div>
            <ReactApexChart options={options} series={series} type="line" height={350} />
        </div>
    );
};

export default TokenUsageChart;
