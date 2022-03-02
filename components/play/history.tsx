type Props = {
	puzzles: Array<{
		grade: number;
		PuzzleId: string;
	}>;
};

const getClasses = (grade: number) => {
	const result = 'h-3 w-5 cursor-pointer rounded-sm mx-1 mb-2 ';

	if (grade < 3) {
		return result + 'bg-red-500';
	}

	if (grade < 5) {
		return result + 'bg-orange-500';
	}

	if (grade < 7) {
		return result + 'bg-green-500';
	}
};

const History = ({puzzles}: Props) => {
	return (
		<div className='flex w-full flex-row flex-wrap'>
			{puzzles.map(puzzle => (
				<a
					key={puzzle.PuzzleId}
					href={`https://lichess.org/training/${puzzle.PuzzleId}`}
					className={getClasses(puzzle.grade)}
				/>
			))}
		</div>
	);
};

export default History;
