import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Run this script with:
 * npx tsx prisma/seed.ts
 */

const main = async () => {
	// Get some puzzles
	const puzzles = await prisma.puzzle.findMany({
		take: 50,
	});

	// Create a set
	await prisma.puzzleSet.create({
		data: {
			title: 'Test Set',
			user: {
				create: {},
			},
			puzzleSetItems: {
				createMany: {
					data: puzzles.map((puzzle, index) => ({
						order: index,
						puzzleId: puzzle.id,
					})),
				},
			},
		},
	});
};

main()
	.finally(async () => prisma.$disconnect())
	.catch(console.error);
