export type PreviousPuzzle = {
	grade: number;
	PuzzleId: string;
};

type HistoryProps = {
	puzzles: PreviousPuzzle[];
};

const getClasses = (grade: number) => {
	const base = 'h-3 w-5 cursor-pointer rounded-sm mb-1';
	if (grade < 3) return `${base} bg-red-500`;
	if (grade < 5) return `${base} bg-orange-500`;
	if (grade < 7) return `${base} bg-green-500`;
};

const History = ({puzzles}: HistoryProps) => {
	return (
		<div className='flex flex-row flex-wrap w-full gap-1'>
			{puzzles.map(puzzle => (
				<a
					key={puzzle.PuzzleId}
					href={`https://lichess.org/training/${puzzle.PuzzleId}`}
					className={getClasses(puzzle.grade)}
					target='_blank'
				/>
			))}
		</div>
	);
};

export default History;
