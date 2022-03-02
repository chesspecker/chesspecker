type Props = {
	totalPuzzles: number;
	completedPuzzles: number;
};

const Progress = ({totalPuzzles, completedPuzzles}: Props) => {
	const percentage = ((completedPuzzles / totalPuzzles) * 100).toFixed(2);
	return (
		<div className='w-36 bg-sky-500 text-center'>
			<div>{percentage}%</div>
			<div>
				{completedPuzzles} / {totalPuzzles}
			</div>
		</div>
	);
};

export default Progress;
