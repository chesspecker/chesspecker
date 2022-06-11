export type ThemeItem = {
	title: string;
	count: number;
};

export type Streak = {
	currentCount: number;
	startDate: string; // 11/11/2019
	lastLoginDate: string; // 14/11/2019
};

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

export interface AchievementItem {
	id: AchievementInterface['id'];
	claimed: boolean;
	date: Date;
}

export type Difficulty =
	| 'easiest'
	| 'easier'
	| 'easy'
	| 'normal'
	| 'intermediate'
	| 'hard'
	| 'harder'
	| 'hardest';
