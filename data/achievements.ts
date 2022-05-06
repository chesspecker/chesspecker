import {AchievementInterface, AchivementsArgs} from '@/types/models';
import THEMES from '@/data/themes';
import {getRandomInt} from '@/lib/utils';

export type AchievementsCategorys = {
	name: string;
	description: string;
};

export const achievementsCategorys: AchievementsCategorys[] = [
	{
		name: 'random',
		description: 'Achievements awarded in a perfectly random way',
	},
	{
		name: 'avancement',
		description: 'Achievements related to your general progress on this site',
	},
	{
		name: 'performance',
		description: 'Achievements related to your ability in solving problems',
	},
	{
		name: 'duration',
		description:
			'Achievements related to to your diligence in working on problems',
	},
	{
		name: 'type',
		description:
			'Achievement related to the categories you have been working on',
	},
];

export const achievements: AchievementInterface[] = [
	// RANDOM
	{
		id: 'pizza',
		name: 'Pizza',
		description: 'Great, you won a slice of pizza...',
		isValidated: (_args: AchivementsArgs) => getRandomInt(5000) === 42,
		image: '/images/achievements/pizza.png',
		category: 'random',
	},
	{
		id: 'plunger',
		name: 'Toilet plunger',
		description: 'Great, you won a toilet plunger...',
		isValidated: (_args: AchivementsArgs) => getRandomInt(5000) === 666,
		image: '/images/achievements/plunger.png',
		category: 'random',
	},
	{
		id: 'unicorn',
		name: 'Nice unicorn',
		description: 'I love unicorns and their beautiful horns',
		isValidated: (_args: AchivementsArgs) => getRandomInt(5000) === 999,
		image: '/images/achievements/unicorn.png',
		category: 'random',
	},
	{
		id: 'clown',
		name: 'Clown',
		description: 'Funny joke goes here',
		isValidated: (_args: AchivementsArgs) => getRandomInt(5000) === 181,
		image: '/images/achievements/clown.png',
		category: 'random',
	},

	// AVANCEMENT
	{
		id: 'first-puzzle',
		name: 'First Puzzle',
		description: 'You completed your first puzzle.',
		isValidated: (args: AchivementsArgs) => args.totalPuzzleSolved === 1,
		image: '/images/achievements/unicorn.png', // Change
		category: 'avancement',
	},
	{
		id: 'first-set',
		name: 'First Set',
		description: 'You completed your first set.',
		isValidated: (args: AchivementsArgs) => args.totalSetSolved === 1,
		image: '/images/achievements/accordéon.png', // Change
		category: 'avancement',
	},
	{
		id: 'sponsor',
		name: 'Sponsor',
		description:
			'Because you are a sponsor, you have won thos beautiful socks ',
		isValidated: (args: AchivementsArgs) => args.isSponsor,
		image: '/images/achievements/socks.png', // Change
		category: 'avancement',
	},

	// PERFORMANCE
	{
		id: 'baby-bunny',
		name: 'Baby Bunny',
		description: 'Solve 20 consecutive puzzles in less than 5 seconds',
		isValidated: (args: AchivementsArgs) => args.streakTime > 20,
		image: '/images/achievements/bunny-baby.svg',
		category: 'performance',
	},
	{
		id: 'bunny',
		name: 'Bunny',
		description: 'Solve 40 consecutive puzzles in less than 5 seconds',
		isValidated: (args: AchivementsArgs) => args.streakTime > 40,
		image: '/images/achievements/bunny.png',
		category: 'performance',
	},
	{
		id: 'king-bunny',
		name: 'King Bunny',
		description: 'Solve 70 consecutive puzzles in less than 5 seconds',
		isValidated: (args: AchivementsArgs) => args.streakTime > 70,
		image: '/images/achievements/bunny-king.png',
		category: 'performance',
	},

	{
		id: 'baby-turtle',
		name: 'Baby turtle',
		description: 'Solve a puzzle after 2 minutes',
		isValidated: (args: AchivementsArgs) => args.completionTime > 120,
		image: '/images/achievements/turtle-baby.png',
		category: 'performance',
	},
	{
		id: 'turtle',
		name: 'turtle',
		description: 'Solve a puzzle after 5 minutes',
		isValidated: (args: AchivementsArgs) => args.completionTime > 300,
		image: '/images/achievements/turtle.png',
		category: 'performance',
	},
	{
		id: 'king-turtle',
		name: 'King turtle',
		description: 'Solve a puzzle after 15 minutes',
		isValidated: (args: AchivementsArgs) => args.completionTime > 900,
		image: '/images/achievements/turtle-king.png',
		category: 'performance',
	},

	{
		id: 'baby-watchmaker',
		name: 'Baby watchmaker',
		description: 'Solve 20 consecutive puzzles with no mistakes',
		isValidated: (args: AchivementsArgs) => args.streakMistakes > 20,
		image: '/images/achievements/archery.png',
		category: 'performance',
	},
	{
		id: 'watchmaker',
		name: 'watchmaker',
		description: 'Solve 30 consecutive puzzles with no mistakes',
		isValidated: (args: AchivementsArgs) => args.streakMistakes > 30,
		image: '/images/achievements/archery-plus.svg',
		category: 'performance',
	},
	{
		id: 'king-watchmaker',
		name: 'King watchmaker',
		description: 'Solve 50 consecutive puzzles with no mistakes',
		isValidated: (args: AchivementsArgs) => args.streakMistakes > 50,
		image: '/images/achievements/archery-plus-plus.svg',
		category: 'performance',
	},

	{
		id: 'baby-goat',
		name: 'Baby goat',
		description: 'Solve a puzzle after more than 5 mistakes',
		isValidated: (args: AchivementsArgs) => args.completionMistakes > 5,
		image: '/images/achievements/goat-baby.png',
		category: 'performance',
	},
	{
		id: 'goat',
		name: 'Goat',
		description: 'Solve a puzzle after more than 15 mistakes',
		isValidated: (args: AchivementsArgs) => args.completionMistakes > 15,
		image: '/images/achievements/goat.png',
		category: 'performance',
	},
	{
		id: 'king-goat',
		name: 'King goat',
		description: 'Solve a puzzle after more than 30 mistakes',
		isValidated: (args: AchivementsArgs) => args.completionMistakes > 30,
		image: '/images/achievements/gaot-king.png',
		category: 'performance',
	},
	// DURATION

	{
		id: 'baby-chessaolic',
		name: 'Baby chessaolic',
		description: 'Play more than 15 mn in last 7 days',
		isValidated: (args: AchivementsArgs) => args.streak.currentCount > 7,
		image: '/images/achievements/flamme.png',
		category: 'duration',
	},
	{
		id: 'chessaolic',
		name: 'Chessaolic',
		description: 'Play more than 15 mn in last 15 days',
		isValidated: (args: AchivementsArgs) => args.streak.currentCount > 15,
		image: '/images/achievements/flamme2.png',
		category: 'duration',
	},
	{
		id: 'king-chessaolic',
		name: 'King chessaolic',
		description: 'Play more than 15 mn in last 30 days',
		isValidated: (args: AchivementsArgs) => args.streak.currentCount > 30,
		image: '/images/achievements/flamme3.png',
		category: 'duration',
	},
	{
		id: 'revenant',
		name: 'Revenant',
		description: 'Come back after more than 30 days of inactivity',
		// TODO: test, not sure if it works
		isValidated: (args: AchivementsArgs) =>
			(Date.now() - new Date(args.streak.lastLoginDate).getTime()) / 1000 >
			2_592_000, // 30 jours en secondes
		image: '/images/achievements/reveneant.png',
		category: 'duration',
	},
];

for (const theme of THEMES) {
	achievements.push(
		{
			id: theme.id,
			name: `National master of ${theme.title}`,
			description: `Your are now national master of ${theme.title}`,
			isValidated: (args: AchivementsArgs) =>
				args.themes.some(t => t.title === theme.id && t.count === 400),
			image: '/images/achievements/king_bunny.svg',
			category: 'type',
		},
		{
			id: theme.id,
			name: `International master of ${theme.title}`,
			description: `Your are now international master of ${theme.title}`,
			isValidated: (args: AchivementsArgs) =>
				args.themes.some(t => t.title === theme.id && t.count === 800),
			image: '/images/achievements/king_bunny.svg',
			category: 'type',
		},
		{
			id: theme.id,
			name: `Great-master of ${theme.title}`,
			description: `Your are now great master of ${theme.title}`,
			isValidated: (args: AchivementsArgs) =>
				args.themes.some(t => t.title === theme.id && t.count === 1200),
			image: '/images/achievements/king_bunny.svg',
			category: 'type',
		},
	);
}
