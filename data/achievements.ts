import {AchievementInterface, AchivementsArgs} from '@/types/models';
import THEMES from '@/data/themes';
import {getRandomInt} from '@/lib/utils';

const ONE_MONTH_IN_MS = 30 * 24 * 60 * 60 * 1000;

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
		name: 'advancement',
		description: 'Achievements related to your progress on this site',
	},
	{
		name: 'performance',
		description: 'Achievements related to your solving skills',
	},
	{
		name: 'duration',
		description:
			'Achievements related to your hard work and time spent on this site',
	},
	{
		name: 'type',
		description: "Achievement related to the categories you've been working on",
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

	// Advancement
	{
		id: 'first-puzzle',
		name: 'First Puzzle',
		description: 'You completed your first puzzle!',
		isValidated: (args: AchivementsArgs) => args.totalPuzzleSolved > 0,
		image: '/images/achievements/accordeon.png',
		category: 'advancement',
	},
	{
		id: 'sponsor',
		name: 'Sponsor',
		description: "Because you're a sponsor, you've won those beautiful socks",
		isValidated: (args: AchivementsArgs) => args.isSponsor,
		image: '/images/achievements/socks.png',
		category: 'advancement',
	},

	// PERFORMANCE
	{
		id: 'baby-bunny',
		name: 'Baby Bunny',
		description: 'Solve 20 consecutive puzzles in less than 5 seconds',
		isValidated: (args: AchivementsArgs) => args.streakTime > 20,
		image: '/images/achievements/bunny-0.png',
		category: 'performance',
	},
	{
		id: 'bunny',
		name: 'Bunny',
		description: 'Solve 40 consecutive puzzles in less than 5 seconds',
		isValidated: (args: AchivementsArgs) => args.streakTime > 40,
		image: '/images/achievements/bunny-1.png',
		category: 'performance',
	},
	{
		id: 'king-bunny',
		name: 'King Bunny',
		description: 'Solve 70 consecutive puzzles in less than 5 seconds',
		isValidated: (args: AchivementsArgs) => args.streakTime > 70,
		image: '/images/achievements/bunny-2.png',
		category: 'performance',
	},

	{
		id: 'baby-turtle',
		name: 'Baby turtle',
		description: 'Solve a puzzle after 2 minutes of thinking',
		isValidated: (args: AchivementsArgs) => args.completionTime > 120,
		image: '/images/achievements/turtle-0.png',
		category: 'performance',
	},
	{
		id: 'turtle',
		name: 'Turtle',
		description: 'Solve a puzzle after 5 minutes of thinking',
		isValidated: (args: AchivementsArgs) => args.completionTime > 300,
		image: '/images/achievements/turtle-1.png',
		category: 'performance',
	},
	{
		id: 'king-turtle',
		name: 'King turtle',
		description: 'Solve a puzzle after 15 minutes of thinking',
		isValidated: (args: AchivementsArgs) => args.completionTime > 900,
		image: '/images/achievements/turtle-2.png',
		category: 'performance',
	},

	{
		id: 'baby-archer',
		name: 'Baby archer',
		description: 'Solve 20 consecutive puzzles without error',
		isValidated: (args: AchivementsArgs) => args.streakMistakes > 20,
		image: '/images/achievements/archer-0.png',
		category: 'performance',
	},
	{
		id: 'archer',
		name: 'archer',
		description: 'Solve 30 consecutive puzzles without error',
		isValidated: (args: AchivementsArgs) => args.streakMistakes > 30,
		image: '/images/achievements/archer-1.png',
		category: 'performance',
	},
	{
		id: 'king-archer',
		name: 'King archer',
		description: 'Solve 50 consecutive puzzles without error',
		isValidated: (args: AchivementsArgs) => args.streakMistakes > 50,
		image: '/images/achievements/archer-2.png',
		category: 'performance',
	},

	{
		id: 'baby-goat',
		name: 'Baby goat',
		description: 'Solve a puzzle with more than 5 mistakes...',
		isValidated: (args: AchivementsArgs) => args.completionMistakes > 5,
		image: '/images/achievements/goat-0.png',
		category: 'performance',
	},
	{
		id: 'goat',
		name: 'Goat',
		description: 'Solve a puzzle with more than 15 mistakes...',
		isValidated: (args: AchivementsArgs) => args.completionMistakes > 15,
		image: '/images/achievements/goat-1.png',
		category: 'performance',
	},
	{
		id: 'king-goat',
		name: 'King goat',
		description: 'Solve a puzzle with more than 30 mistakes...',
		isValidated: (args: AchivementsArgs) => args.completionMistakes > 30,
		image: '/images/achievements/goat-2.png',
		category: 'performance',
	},
	// DURATION

	{
		id: 'baby-chess-addict',
		name: 'Baby chess-addict',
		description: 'Play at least 15mn each day for a week',
		isValidated: (args: AchivementsArgs) => args.streak.currentCount > 7,
		image: '/images/achievements/flame-0.png',
		category: 'duration',
	},
	{
		id: 'chess-addict',
		name: 'Chess-addict',
		description: 'Play at least 15mn each day for 2 weeks',
		isValidated: (args: AchivementsArgs) => args.streak.currentCount > 15,
		image: '/images/achievements/flame-1.png',
		category: 'duration',
	},
	{
		id: 'king-chess-addict',
		name: 'King chess-addict',
		description: 'Play at least 15mn each day for a month',
		isValidated: (args: AchivementsArgs) => args.streak.currentCount > 30,
		image: '/images/achievements/flame-2.png',
		category: 'duration',
	},
	{
		id: 'revenant',
		name: 'Revenant',
		description: 'Come back after a month of inactivity',
		// TODO: test, not sure if it works
		isValidated: (args: AchivementsArgs) =>
			new Date().getTime() - new Date(args.streak.lastLoginDate).getTime() >
			ONE_MONTH_IN_MS,
		image: '/images/achievements/ghost.png',
		category: 'duration',
	},
];

for (const theme of THEMES) {
	achievements.push(
		{
			id: `NM-${theme.title}`,
			name: `NM of ${theme.title}`,
			description: `Your are now a National Master of ${theme.title}`,
			isValidated: (args: AchivementsArgs) =>
				args.themes.some(t => t.title === theme.id && t.count > 500),
			image: '/images/achievements/shield-0.png',
			category: 'type',
		},
		{
			id: `IM-${theme.title}`,
			name: `IM of ${theme.title}`,
			description: `Your are now a International Master of ${theme.title}`,
			isValidated: (args: AchivementsArgs) =>
				args.themes.some(t => t.title === theme.id && t.count > 1500),
			image: '/images/achievements/shield-1.png',
			category: 'type',
		},
		{
			id: `GM-${theme.title}`,
			name: `GM of ${theme.title}`,
			description: `Your are now a Grand Master of ${theme.title}`,
			isValidated: (args: AchivementsArgs) =>
				args.themes.some(t => t.title === theme.id && t.count > 3000),
			image: '/images/achievements/shield-2.png',
			category: 'type',
		},
	);
}
