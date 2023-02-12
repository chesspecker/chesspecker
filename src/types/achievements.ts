import type {ThemeItem, Streak} from '@prisma/client';

export type AchivementsArgs = {
	streakMistakes: number;
	streakTime: number;
	completionTime: number;
	completionMistakes: number;
	totalPuzzleSolved: number;
	themes: ThemeItem[];
	streak: Streak;
	isSponsor: boolean;
};

export type AchievementInterface = {
	id: string;
	name: string;
	description: string;
	isValidated: (args: AchivementsArgs) => boolean;
	image: string;
	category: string;
};
