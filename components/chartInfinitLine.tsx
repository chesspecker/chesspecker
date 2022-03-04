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
		},
		y1: {
			type: 'linear' as const,
			display: true,
			position: 'right' as const,
			grid: {
				drawOnChartArea: false,
			},
		},
	},
};

const ChartInfinitLine = ({set}) => {
	const arrayOfPuzzlePlayed = set.puzzles.filter(
		puzzle => puzzle.played === true,
	);

	const array = arrayOfPuzzlePlayed.map(puzzle => ({
		mistakes: puzzle.mistakes,
		timeTaken: puzzle.timeTaken,
		grade: puzzle.grade,
		count: puzzle.count,
	}));

	const getMaxTimePlayed = () => {
		let counter = 0;

		for (const element of array) {
			if (element.count > counter) counter = element.count;
		}

		return counter;
	};

	const getRandomColor = () => {
		const number_ = Math.round(0xff_ff_ff * Math.random());
		const r = number_ >> 16;
		const g = (number_ >> 8) & 255;
		const b = number_ & 255;
		return r + ', ' + g + ', ' + b;
	};

	const getData = () => {
		const datasets = [];
		for (let i = 0; i < getMaxTimePlayed(); i++) {
			const color = getRandomColor();

			datasets.push(
				{
					label: `Mistake ${i + 1}`,
					data: array.map(puzzle => puzzle.mistakes[i]),
					borderColor: `rgba(${color}, ${1 / (getMaxTimePlayed() - i)})`,
					backgroundColor: `rgba(${color}, ${1 / (getMaxTimePlayed() - i)})`,
					yAxisID: 'y',
				},
				{
					label: `Time ${i + 1}`,
					data: array.map(puzzle => puzzle.timeTaken[i]),
					borderColor: `rgba(${color}, ${1 / (getMaxTimePlayed() - i)})`,
					backgroundColor: `rgba(${color}, ${1 / (getMaxTimePlayed() - i)})`,
					yAxisID: 'y1',
				},
			);
		}

		return datasets;
	};

	const labels = array.map((_, index) => index);

	const data = {
		labels,
		datasets: getData(),
	};

	return <Line options={options} data={data} />;
};

export default ChartInfinitLine;
