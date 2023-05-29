import fs from 'node:fs';
import {PrismaClient, Prisma} from '@prisma/client';
import csv from 'csv-parser';

const prisma = new PrismaClient();

/**
 * Run this script with:
 * npx tsx prisma/seed-puzzles.ts
 */

const main = async () => {
	let count = 0;

	// Read CSV file
	const stream = fs
		.createReadStream('prisma/lichess_db_puzzle.csv')
		.pipe(
			csv([
				'PuzzleId',
				'FEN',
				'Moves',
				'Rating',
				'RatingDeviation',
				'Popularity',
				'NbPlays',
				'Themes',
				'GameUrl',
				'OpeningTags',
			]),
		);

	stream.on(
		'data',
		async (raw: {
			PuzzleId: string;
			FEN: string;
			Moves: string;
			Rating: string;
			RatingDeviation: string;
			Popularity: string;
			NbPlays: string;
			Themes: string;
			GameUrl: string;
			OpeningTags: string | undefined;
		}) => {
			const createPuzzleInput = {
				id: raw.PuzzleId,
				fen: raw.FEN,
				moves: raw.Moves.split(' '),
				rating: Number.parseInt(raw.Rating, 10),
				ratingDeviation: Number.parseInt(raw.RatingDeviation, 10),
				popularity: Number.parseInt(raw.Popularity, 10),
				nbPlays: Number.parseInt(raw.NbPlays, 10),
				gameUrl: raw.GameUrl,
				openingTags: raw.OpeningTags ? raw.OpeningTags?.split(' ') : [],
			} satisfies Prisma.PuzzleCreateInput;

			await prisma.puzzle
				.upsert({
					where: {id: raw.PuzzleId},
					update: {},
					create: createPuzzleInput,
				})
				.catch(console.error);

			count++;
			console.log(`${count} • ${raw.PuzzleId}`);
		},
	);
};

main()
	.finally(async () => prisma.$disconnect())
	.catch(console.error);
