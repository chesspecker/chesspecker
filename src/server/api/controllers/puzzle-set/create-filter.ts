import type {Prisma} from '@prisma/client';

export const filterWithHealthyMix = (
	spread: number,
	minRating: number,
	maxRating: number,
): Prisma.PuzzleWhereInput => ({
	rating: {gt: minRating - spread, lt: maxRating + spread},
});

export const defaultFilter = (
	spread: number,
	minRating: number,
	maxRating: number,
	themeArray: string[],
): Prisma.PuzzleWhereInput => ({
	AND: [
		{rating: {gt: minRating - spread, lt: maxRating + spread}},
		{
			themes: {
				some: {
					// eslint-disable-next-line quote-props
					name: {in: themeArray},
				},
			},
		},
	],
});

export const createFilter =
	(themeArray: string[], minRating: number, maxRating: number) =>
	(spread: number): Prisma.PuzzleWhereInput =>
		themeArray.includes('healthyMix')
			? filterWithHealthyMix(spread, minRating, maxRating)
			: defaultFilter(spread, minRating, maxRating, themeArray);
