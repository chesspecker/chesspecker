import type {Document, Types} from 'mongoose';

type ThemeItem = {title: string; count: number};
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
	totalSetSolved: number;
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
};

export interface PuzzleInterface extends Document {
	_id: Types.ObjectId;
	PuzzleId: string;
	FEN: string;
	Moves: string;
	Rating: number;
	RatingDeviation: number;
	Popularity: number;
	NbPlays: number;
	Themes: string[];
	GameUrl: string;
}

export interface AchievementItem {
	id: AchievementInterface['id'];
	claimed: boolean;
}

export interface UserInterface extends Document {
	_id: Types.ObjectId;
	stripeId: string;
	id: string;
	lichessId: string;
	username: string;
	url: string;
	isSponsor: boolean;
	validatedAchievements: AchievementItem[];
	totalPuzzleSolved: number;
	totalSetCompleted: number;
	streak: Streak;
	totalTimePlayed: number;
	puzzleSolvedByCategories: ThemeItem[];
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

export interface PuzzleItemInterface {
	_id: Types.ObjectId;
	PuzzleId: PuzzleInterface['PuzzleId'];
	played: boolean;
	count: number;
	streak: number;
	order: number;
	mistakes: number[];
	timeTaken: number[];
	grades: number[];
}

export interface PuzzleSetInterface extends Document {
	_id: Types.ObjectId;
	user: Types.ObjectId;
	puzzles: PuzzleItemInterface[];
	title: string;
	length: number;
	cycles: number;
	spacedRepetition: boolean;
	currentTime: number;
	times: number[];
	rating: number;
	progression: number;
	level: Difficulty;
}
