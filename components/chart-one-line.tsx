import React from 'react';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';
import {Bar} from 'react-chartjs-2';

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
);

const options = {
	responsive: true,
	plugins: {
		title: {
			display: true,
			text: 'Rapidity average',
		},
		legend: {
			labels: {
				color: 'rgba(255, 99, 132, 0.5)',
			},
		},
	},
};

const labels = ['RAPIDITY'];

const ChartOneLine = ({rapidity}: {rapidity: number}) => {
	const data = {
		labels,
		datasets: [
			{
				label: 'Rapidity',
				data: [rapidity],
				backgroundColor: 'rgba(255, 99, 132, 0.5)',
			},
		],
	};
	return <Bar options={options} data={data} />;
};

export default ChartOneLine;
