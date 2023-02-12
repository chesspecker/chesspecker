import {Difficulty} from '@prisma/client';
import type {Prisma} from '@prisma/client';
import {prisma} from '@/server/db';
import type {CreateSetParams} from '@/types/create-set-params';
import {createFilter} from '@/server/api/controllers/puzzle-set/create-filter';
import {getRating} from '@/server/api/controllers/puzzle-set/get-rating';
import type {TRPCContext} from '@/server/api/context';

type Props = {
	ctx: TRPCContext;
	input: CreateSetParams;
};
export const createSet = async ({ctx, input}: Props) => {
	const setLevel = input.level ?? Difficulty.intermediate;
	const [minRating, maxRating] = getRating(setLevel, input.averageRating);
	const getFilter = createFilter(input.themeArray, minRating, maxRating);

	const searchDb = async (spread: number): Promise<Prisma.PuzzleWhereInput> => {
		const filter = getFilter(spread);
		if (spread > 250) return filter;
		const possibleDocs = await prisma.puzzle.count({where: filter});
		if (possibleDocs < input.size) return searchDb(spread + 5);
		return filter;
	};

	const filter = await searchDb(0);
	const puzzles = await prisma.puzzle.findMany({where: filter});
	const avgRating = puzzles.reduce((acc, curr) => acc + curr.rating, 0);

	const puzzleSet = await prisma.puzzleSet.create({
		data: {
			title: input.title,
			length: puzzles.length,
			rating: Math.round(avgRating / puzzles.length),
			level: setLevel,
			user: {
				connect: {id: ctx.session.userId},
			},
		},
	});

	const promises = puzzles.map((puzzle, index) =>
		prisma.puzzleItem.create({
			data: {
				lichessId: puzzle.lichessId,
				played: false,
				count: 0,
				streak: 0,
				order: index,
				puzzleSet: {connect: {id: puzzleSet.id}},
			},
		}),
	);

	await Promise.all(promises);

	return puzzleSet;
};
