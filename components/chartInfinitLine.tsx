import React, {useState} from 'react';
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

const armonizedData = (array: Array<number>) => {
	const packBy = Math.floor((30 / 500) * array.length);

	const length = array.length;
	const iterator = Math.ceil(length / packBy);

	let newArray = [];
	for (let i = 0; i < iterator; i++) {
		const _oldArray = [...array];

		const _array = _oldArray.splice(i * packBy, packBy);

		const sum = _array.reduce((a, b) => a + b);

		newArray.push(sum / _array.length);
	}
	return newArray;
};

function ChartInfinitLine({set}) {
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

	const getData = () => {
		let datasets = [];
		for (let i = 0; i < getMaxTimePlayed(); i++) {
			const color = getRandomColor();

			datasets.push(
				{
					label: `Mistake ${i + 1}`,
					data: armonizedData(array.map(puzzle => puzzle.mistakes[i])),
					borderColor: `rgba(${color}, ${1 / (getMaxTimePlayed() - i)})`,
					backgroundColor: `rgba(${color}, ${1 / (getMaxTimePlayed() - i)})`,
					yAxisID: 'y',
				},
				{
					label: `Time ${i + 1}`,
					data: armonizedData(array.map(puzzle => puzzle.timeTaken[i])),
					borderColor: `rgba(${color}, ${1 / (getMaxTimePlayed() - i)})`,
					backgroundColor: `rgba(${color}, ${1 / (getMaxTimePlayed() - i)})`,
					yAxisID: 'y1',
				},
			);
		}

		return datasets;
	};

	const labels = armonizedData(array.map(puzzle => puzzle.timeTaken[0])).map(
		(_, index) => index,
	);

	const data = {
		labels,
		datasets: getData(),
	};

	const [isChecked, setIsChecked] = useState({});

	const handlCLick = index => {
		console.log(isChecked, 'ischecked');
	};

	return (
		<div>
			<div className='mt-20 flex h-20 w-full items-center justify-around bg-white'>
				{[...Array(getMaxTimePlayed())].map((_, index) => (
					<div className='flex'>
						<p className='mr-2'>Try {index + 1}</p>
						<input
							className='form-check-input float-left mt-1 mr-2 h-4 w-4 cursor-pointer appearance-none rounded-sm border border-gray-300 bg-white bg-contain bg-center bg-no-repeat align-top transition duration-200 checked:border-blue-600 checked:bg-blue-600 focus:outline-none'
							type='checkbox'
							value=''
							checked={isChecked && isChecked[index]}
							id='flexCheckDefault'
							onChange={() => handlCLick(index)}
						></input>
					</div>
				))}
			</div>
			<Line options={options} data={data} />
		</div>
	);
}

export default ChartInfinitLine;
