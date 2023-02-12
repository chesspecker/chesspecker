import fs from 'node:fs';
import {PrismaClient} from '@prisma/client';
import csv from 'csv-parser';

const prisma = new PrismaClient();

const getAllThemes = async () => {
	const themes = new Set();

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
				'OpeningFamily',
				'OpeningVariation',
			]),
		);

	stream.on('data', async raw => {
		raw.Themes.split(' ').forEach((/** @type {any} */ theme) =>
			themes.add(theme),
		);
	});

	stream.on('end', async () => {
		console.log(`Found ${themes.size} themes`);
		const data = [...themes].map(theme => ({name: theme}));
		const res = await prisma.theme
			.createMany({
				data,
			})
			.catch(console.error);

		console.log(`Created ${themes.size} themes`);
		console.log(res);
	});
};

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
				'OpeningFamily',
				'OpeningVariation',
			]),
		);

	stream.on('data', async raw => {
		await prisma.puzzle.upsert({
			where: {id: raw.PuzzleId},
			update: {},
			create: {
				lichessId: raw.PuzzleId,
				fen: raw.FEN,
				moves: raw.Moves.split(' '),
				rating: Number.parseInt(raw.Rating, 10),
				ratingDeviation: Number.parseInt(raw.RatingDeviation, 10),
				popularity: Number.parseInt(raw.Popularity, 10),
				nbPlays: Number.parseInt(raw.NbPlays, 10),
				themes: {
					connect: raw.Themes.split(' ').map((/** @type {any} */ theme) => ({
						name: theme,
					})),
				},
				gameUrl: raw.GameUrl,
				openingFamily: raw.OpeningFamily ? raw.OpeningFamily : undefined,
				openingVariation: raw.OpeningVariation
					? raw.OpeningVariation
					: undefined,
			},
		});
		count++;
		console.log(`${count} • ${raw.PuzzleId}`);
	});
};

// await getAllThemes();

main()
	.finally(async () => prisma.$disconnect())
	.catch(console.error);
