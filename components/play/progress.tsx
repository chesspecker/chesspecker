type Props = {
	totalPuzzles: number;
	completedPuzzles: number;
};

const Progress = ({totalPuzzles, completedPuzzles}: Props) => {
	const percentage = ((completedPuzzles / totalPuzzles) * 100).toFixed(2);
	return (
		<div className='text-md mx-auto block h-fit w-36 cursor-default rounded-md border border-transparent bg-white bg-opacity-90 py-2 px-2.5 text-center font-merriweather font-bold leading-8 text-sky-700 shadow-sm backdrop-blur-lg backdrop-filter md:mx-2'>
			<div>{percentage}%</div>
			<div>
				{completedPuzzles} / {totalPuzzles}
			</div>
		</div>
	);
};

export default Progress;
