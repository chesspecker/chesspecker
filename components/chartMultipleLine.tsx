import React from 'react';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';
import {Line} from 'react-chartjs-2';
import chartTrendline from 'chartjs-plugin-trendline';

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
);

export const options = {
	responsive: true,
	plugins: {
		legend: {
			position: 'top' as const,
		},
		title: {
			display: true,
			text: 'Chart comparing time taken and mistakes evolutions',
		},
	},
	scales: {
		y: {
			type: 'linear' as const,
			display: true,
			position: 'left' as const,
			max: 40,
		},
		y1: {
			type: 'linear' as const,
			display: true,
			position: 'right' as const,
			max: 10,
			grid: {
				drawOnChartArea: false,
			},
		},
	},
};

const ChartMultipleLine = ({array1, array2, name1, name2}) => {
	const labels = array1.map((_, index) => index);

	const data = {
		labels,
		datasets: [
			{
				label: name1,
				data: array1,
				borderColor: 'rgb(255, 99, 132)',
				backgroundColor: 'rgba(255, 99, 132, 0.5)',
				yAxisID: 'y',
			},
			{
				label: name2,
				data: array2,
				borderColor: 'rgb(255, 99, 2)',
				backgroundColor: 'rgba(255, 2, 2, 0.5)',
				yAxisID: 'y1',
			},
		],
	};

	return <Line options={options} data={data} />;
};

export default ChartMultipleLine;
