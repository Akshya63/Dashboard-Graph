import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TimeSeriesChart = ({ data }) => {
  const chartData = {
    datasets: data.map(event => ({
      label: event.label,
      data: event.data,
      borderColor: event.color,
      backgroundColor: event.color,
      fill: false,
    })),
  };

  const options = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
        },
        ticks: { color: 'white' },
      },
      y: {
        ticks: { color: 'white' },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: 'white',
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default TimeSeriesChart;
