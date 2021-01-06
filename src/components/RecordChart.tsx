import React from 'react';
import ReactApexCharts from 'react-apexcharts';
import { useTheme } from '@material-ui/styles';
import { Theme } from '@material-ui/core';

const chartOptions = {
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: '100%',
            endingShape: 'rounded',
        },
    },
    dataLabels: {
        enabled: false,
    },
    stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
    },
    yaxis: {
        title: {
            text: 'Portals',
        },
        max: 12,
    },
    fill: {
        opacity: 1,
    },
    tooltip: {
        y: {
            formatter: function (val: number) {
                return val + ' portal' + (val === 1 ? '' : 's');
            },
        },
    },
};

type RecordChartProps = {
    data: any;
    mode: any;
    title: string;
    color: string;
};

const RecordChart = ({ data, mode, title, color }: RecordChartProps) => {
    const sorted = data.filter((m: any) => m.mode === mode).sort((a: any, b: any) => a.index - b.index);

    const series = [
        {
            name: 'World Record',
            data: sorted.map((m: any) => m.wr),
        },
    ];

    const theme = useTheme<Theme>();

    const options = {
        ...chartOptions,
        xaxis: {
            categories: sorted.map((m: any) => m.name),
            labels: {
                show: false,
            },
        },
        title: {
            text: title,
            align: 'center',
            offsetY: 10,
            style: {
                fontSize: 24,
            },
        },
        colors: [color],
        chart: {
            background: theme.palette.type === 'dark' ? theme.palette.grey['800'] : theme.palette.common.white,
        },
        theme: {
            mode: theme.palette.type,
        },
    };

    return <ReactApexCharts options={options} series={series} type="bar" height="350" />;
};

export default RecordChart;
