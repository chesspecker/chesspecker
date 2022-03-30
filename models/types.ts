import type {Document, Types} from 'mongoose';

export type AchivementsArgs = {
	streakMistakes: number;
	streakTime: number;
	completionTime: number;
	completionMistakes: number;
	totalPuzzleSolved: number;
	totalSetSolved: number;
	theme: {id: string; totalPuzzleSolved: number};
	streakDays: number;
	lastVisit: number;
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
	id: string;
	lichessId: string;
	username: string;
	url: string;
	permissionLevel: number;
	lastUpdatedAt: number;
	isSponsor: boolean;
	validatedAchievements: AchievementItem[];
	/*
	TODO:
	totalPuzzleSolved: number;
	totalSetCompleted: number;
	streakDays: number;
	totalTimePlayed: number;
	lastVisit: date;
	 puzzleSolvedByCategories : {
		[category: string]: number;
	} */

	perfs: {
		ultraBullet: {games: number; rating: number};
		bullet: {games: number; rating: number};
		blitz: {games: number; rating: number};
		rapid: {games: number; rating: number};
		classical: {games: number; rating: number};
		correspondence: {games: number; rating: number};
		puzzle: {games: number; rating: number};
	};
	puzzleSet: any[];
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
