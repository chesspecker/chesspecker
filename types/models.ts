import {Streak} from '@/models/streak';
import {ThemeItem} from '@/models/theme';

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

export enum Difficulty {
	easiest = 'easiest',
	easier = 'easier',
	easy = 'easy',
	normal = 'normal',
	intermediate = 'intermediate',
	hard = 'hard',
	harder = 'harder',
	hardest = 'hardest',
}
