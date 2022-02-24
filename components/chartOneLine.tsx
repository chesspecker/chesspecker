import React from 'react';
import faker from '@faker-js/faker';
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

export const options = {
	responsive: true,
	plugins: {
		title: {
			display: true,
			text: 'Rapidity average',
		},
	},
	scales: {
		y: {
			suggestedMin: 50,
			suggestedMax: 100,
		},
	},
};

const labels = ['RAPIDITY'];

function ChartOneLine({rapidity}) {
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
}

export default ChartOneLine;
