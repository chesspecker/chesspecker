import {notFound} from 'next/navigation';
import prisma from '@/utils/prisma';
import {Chessboard} from '@/components/play/board';
import {Suspense} from 'react';

type Props = {
	params: {
		setId: string;
		puzzleId: string;
	};
};

const getSetById = async (id: string) =>
	prisma.puzzleSet.findUnique({where: {id}});

const PlayPuzzlePage = async ({params: {setId, puzzleId}}: Props) => {
	const set = await getSetById(setId);

	const puzzleItem = await prisma.puzzleSetItem.findUnique({
		where: {id: puzzleId},
	});

	const nextPuzzleItem = await prisma.puzzleSetItem.findFirst({
		where: {
			puzzleSetId: setId,
			order: {gt: puzzleItem?.order},
		},
		take: 1,
		orderBy: {order: 'asc'},
		select: {id: true, puzzleSetId: true},
	});

	const puzzle = await prisma.puzzle.findUnique({
		where: {id: puzzleItem?.puzzleId},
	});

	if (!set || !puzzleItem || !puzzle) {
		return notFound();
	}

	return (
		<div>
			<p>PuzzleItem: {puzzleItem.id}</p>
			<p>Puzzle: {puzzle.id}</p>

			<Suspense>
				<Chessboard puzzle={puzzle} nextPuzzleItem={nextPuzzleItem} />
			</Suspense>
		</div>
	);
};

export default PlayPuzzlePage;
