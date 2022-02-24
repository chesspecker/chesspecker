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

function ChartInfinitLine({set}) {
	const arrayOfPuzzlePlayed = set.puzzles.filter(
		puzzle => puzzle.played === true,
	);

	console.log('puzzle played', arrayOfPuzzlePlayed);

	const array = arrayOfPuzzlePlayed.map(puzzle => ({
		mistakes: puzzle.mistakes,
		timeTaken: puzzle.timeTaken,
		grade: puzzle.grade,
		count: puzzle.count,
	}));
	console.log('array', array);

	const getMaxTimePlayed = () => {
		let counter = 0;
		console.log(array.length);
		for (let i = 0; i < array.length; i++) {
			if (array[i].count > counter) counter = array[i].count;
		}
		return counter;
	};

	const getRandomColor = () => {
		const num = Math.round(0xffffff * Math.random());
		const r = num >> 16;
		const g = (num >> 8) & 255;
		const b = num & 255;
		return r + ', ' + g + ', ' + b;
	};

	function getRandomRgb() {}

	const getData = () => {
		console.log('max time played', getMaxTimePlayed());
		let datasets = [];
		for (let i = 0; i < getMaxTimePlayed(); i++) {
			const color = getRandomColor();
			console.log(
				'the color',
				`rgba(${color}, ${1 / (getMaxTimePlayed() - i)})`,
			);
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
					yAxisID: 'y',
				},
			);
		}
		console.log(datasets);
		return datasets;
	};

	const labels = array.map((_, index) => index);

	const data = {
		labels,
		datasets: getData(),
	};

	return <Line options={options} data={data} />;
}

export default ChartInfinitLine;
