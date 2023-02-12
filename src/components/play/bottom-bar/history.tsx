import Link from 'next/link';

export type PreviousPuzzle = {
	grade: number;
	lichessId: string;
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

export const History = ({puzzles}: HistoryProps) => (
	<div className='flex w-full flex-row flex-wrap gap-1'>
		{puzzles.map(puzzle => (
			<Link key={puzzle.lichessId} href={`/play/puzzle/${puzzle.lichessId}`}>
				<a className={getClasses(puzzle.grade)} />
			</Link>
		))}
	</div>
);
