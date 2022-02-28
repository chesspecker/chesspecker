import React from 'react';
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import {Doughnut} from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function Donnuts({totalSet, played}) {
	const data = {
		labels: ['Not Played yet', 'Played'],
		datasets: [
			{
				label: '# of Votes',
				data: [totalSet, played],
				backgroundColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
				borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
				borderWidth: 4,
			},
		],
	};
	return (
		<div>
			<Doughnut
				data={data}
				legend={{
					labels: {
						color: 'red',
					},
				}}
			/>
		</div>
	);
}

export default Donnuts;
