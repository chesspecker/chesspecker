import {AchievementInterface, AchivementsArgs} from '@/models/types';
import THEMES from '@/data/themes';

const getRandomInt = (max: number): number => Math.floor(Math.random() * max);

export const achievements: AchievementInterface[] = [
	// RANDOM
	{
		id: 'pizza',
		name: 'Pizza',
		description: 'Great, you won a slice of pizza...',
		isValidated: (args: AchivementsArgs) => getRandomInt(1000) === 42,
		image: 'http://localhost:3000/images/achievements/pizza.png',
	},
	{
		id: 'plunger',
		name: 'Toilet plunger',
		description: 'Great, you won a toilet plunger...',
		isValidated: (args: AchivementsArgs) => getRandomInt(1000) === 666,
		image: 'http://localhost:3000/images/achievements/plunger.jpg',
	},
	{
		id: 'unicorn',
		name: 'Nice unicorn',
		description: 'I love unicorns and their beautiful horns',
		isValidated: (args: AchivementsArgs) => getRandomInt(1000) === 999,
		image: 'http://localhost:3000/images/achievements/unicorn.png',
	},
	{
		id: 'clown',
		name: 'Funny clown',
		description: 'Funny joke goes here',
		isValidated: (args: AchivementsArgs) => getRandomInt(1000) === 181,
		image: 'http://localhost:3000/images/achievements/clown.png',
	},

	// AVANCEMENT
	{
		id: 'first-puzzle',
		name: 'First Puzzle',
		description: 'You completed your first puzzle.',
		isValidated: (args: AchivementsArgs) => args.totalPuzzleSolved === 1,
		image: 'http://localhost:3000/images/achievements/baby_bunny.svg', // Change
	},
	{
		id: 'first-set',
		name: 'First Set',
		description: 'You completed your first set.',
		isValidated: (args: AchivementsArgs) => args.totalSetSolved === 1,
		image: 'http://localhost:3000/images/achievements/baby_bunny.svg', // Change
	},

	// PERFORMANCE
	{
		id: 'baby-bunny',
		name: 'Baby Bunny',
		description: 'Solve 10 consecutive puzzles in less than 5 seconds',
		isValidated: (args: AchivementsArgs) => args.streakTime > 20,
		image: 'http://localhost:3000/images/achievements/baby_bunny.svg',
	},
	{
		id: 'bunny',
		name: 'Bunny',
		description: 'Solve 25 consecutive puzzles in less than 5 seconds',
		isValidated: (args: AchivementsArgs) => args.streakTime > 30,
		image: 'http://localhost:3000/images/achievements/bunny.svg',
	},
	{
		id: 'king-bunny',
		name: 'King Bunny',
		description: 'Solve 50 consecutive puzzles in less than 5 seconds',
		isValidated: (args: AchivementsArgs) => args.streakTime > 50,
		image: 'http://localhost:3000/images/achievements/king_bunny.svg',
	},

	{
		id: 'baby-turtle',
		name: 'Baby turtle',
		description: 'Solve a puzzle after 2 minutes',
		isValidated: (args: AchivementsArgs) => args.completionTime > 120,
		image: 'http://localhost:3000/images/achievements/king_bunny.svg',
	},
	{
		id: 'turtle',
		name: 'turtle',
		description: 'Solve a puzzle after 5 minutes',
		isValidated: (args: AchivementsArgs) => args.completionTime > 300,
		image: 'http://localhost:3000/images/achievements/king_bunny.svg',
	},
	{
		id: 'king-turtle',
		name: 'King turtle',
		description: 'Solve a puzzle after 15 minutes',
		isValidated: (args: AchivementsArgs) => args.completionTime > 900,
		image: 'http://localhost:3000/images/achievements/king_bunny.svg',
	},

	{
		id: 'baby-watchmaker',
		name: 'Baby watchmaker',
		description: 'Solve 20 consecutive puzzles with no mistakes',
		isValidated: (args: AchivementsArgs) => args.streakMistakes > 20,
		image: 'http://localhost:3000/images/achievements/baby_watchmaker.svg',
	},
	{
		id: 'watchmaker',
		name: 'watchmaker',
		description: 'Solve 30 consecutive puzzles with no mistakes',
		isValidated: (args: AchivementsArgs) => args.streakMistakes > 3,
		image: 'http://localhost:3000/images/achievements/watchmaker.svg',
	},
	{
		id: 'king-watchmaker',
		name: 'King watchmaker',
		description: 'Solve 50 consecutive puzzles with no mistakes',
		isValidated: (args: AchivementsArgs) => args.streakMistakes > 50,
		image: 'http://localhost:3000/images/achievements/king_watchmaker.svg',
	},

	{
		id: 'baby-goat',
		name: 'Baby goat',
		description: 'Solve a puzzle after more than 5 mistakes',
		isValidated: (args: AchivementsArgs) => args.completionTime > 900,
		image: 'http://localhost:3000/images/achievements/king_bunny.svg',
	},
	{
		id: 'goat',
		name: 'Goat',
		description: 'Solve a puzzle after more than 15 mistakes',
		isValidated: (args: AchivementsArgs) => args.completionTime > 900,
		image: 'http://localhost:3000/images/achievements/king_bunny.svg',
	},
	{
		id: 'king-goat',
		name: 'King goat',
		description: 'Solve a puzzle after more than 30 mistakes',
		isValidated: (args: AchivementsArgs) => args.completionTime > 900,
		image: 'http://localhost:3000/images/achievements/king_bunny.svg',
	},
	// DURATION

	{
		id: 'baby-chessaolic',
		name: 'Baby chessaolic',
		description: 'Play more than 15 mn in last 7 days',
		isValidated: (args: AchivementsArgs) => args.streakDays > 7,
		image: 'http://localhost:3000/images/achievements/king_bunny.svg',
	},
	{
		id: 'chessaolic',
		name: 'Chessaolic',
		description: 'Play more than 15 mn in last 15 days',
		isValidated: (args: AchivementsArgs) => args.streakDays > 15,
		image: 'http://localhost:3000/images/achievements/king_bunny.svg',
	},
	{
		id: 'king-chessaolic',
		name: 'King chessaolic',
		description: 'Play more than 15 mn in last 30 days',
		isValidated: (args: AchivementsArgs) => args.streakDays > 30,
		image: 'http://localhost:3000/images/achievements/king_bunny.svg',
	},
	{
		id: 'revenant',
		name: 'Revenant',
		description: 'Come back after more than 30 days of inactivity',
		isValidated: (args: AchivementsArgs) =>
			(Date.now() - args.lastVisit) / 1000 > 2_592_000, // 30 jours en secondes
		image: 'http://localhost:3000/images/achievements/king_bunny.svg',
	},
];

for (const theme of THEMES) {
	achievements.push(
		{
			id: theme.id,
			name: `National master of ${theme.title}`,
			description: `Your are now national master of ${theme.description}`,
			isValidated: (args: AchivementsArgs) =>
				args.themes.some(t => t.id === theme.id && t.totalPuzzleSolved === 500),
			image: 'http://localhost:3000/images/achievements/king_bunny.svg',
		},
		{
			id: theme.id,
			name: `International master of ${theme.title}`,
			description: `Your are now international master of ${theme.description}`,
			isValidated: (args: AchivementsArgs) =>
				args.themes.some(
					t => t.id === theme.id && t.totalPuzzleSolved === 1000,
				),
			image: 'http://localhost:3000/images/achievements/king_bunny.svg',
		},
		{
			id: theme.id,
			name: `Great-master of ${theme.title}`,
			description: `Your are now great master of ${theme.description}`,
			isValidated: (args: AchivementsArgs) =>
				args.themes.some(
					t => t.id === theme.id && t.totalPuzzleSolved === 1500,
				),
			image: 'http://localhost:3000/images/achievements/king_bunny.svg',
		},
	);
}
