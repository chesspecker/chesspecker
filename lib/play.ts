/* eslint-disable @typescript-eslint/no-unsafe-return */
import {UpdateQuery} from 'mongoose';
import type {ChessInstance} from 'chess.js';
import type {Config} from 'chessground/config';
import {PuzzleItem} from '@/models/puzzle-item';
import {PuzzleSet} from '@/models/puzzle-set';
import {User} from '@/models/user';
import type {PuzzleData, PuzzleSetData} from '@/api/puzzle/[id]';
import type {SetData} from '@/api/set/[id]';
import type {UserData} from '@/api/user/[id]';
import {ThemeItem} from '@/models/theme';

const getPuzzleById = async (id: string, baseUrl = ''): Promise<PuzzleData> =>
	fetch(`${baseUrl}/api/puzzle/${id}`).then(async response => response.json());

const getUser = async (id: string, baseUrl = ''): Promise<UserData> =>
	fetch(`${baseUrl}/api/user/${id}`).then(async response => response.json());

const updatePuzzle = async (
	setId: string,
	puzzleId: string,
	data: UpdateQuery<Partial<PuzzleItem>>,
): Promise<PuzzleSetData> =>
	fetch(`/api/puzzle/${puzzleId}`, {
		method: 'PUT',
		body: JSON.stringify({_id: setId, update: data}),
	}).then(async response => response.json());

const getSetById = async (id: string, baseUrl = ''): Promise<SetData> =>
	fetch(`${baseUrl}/api/set/${id}`).then(async response => response.json());

const updateSet = async (
	id: string,
	data: UpdateQuery<Partial<PuzzleSet>>,
): Promise<SetData> =>
	fetch(`/api/set/${id}`, {
		method: 'PUT',
		body: JSON.stringify(data),
	}).then(async response => response.json());

export type UpdateUser =
	| {
			$inc: {
				totalPuzzleSolved: number;
				totalTimePlayed: number;
				puzzleSolvedByCategories?: Record<number, ThemeItem>;
			};
	  }
	| {
			$push: {
				puzzleSolvedByCategories: {
					$each: ThemeItem[];
				};
			};
	  };

const updateUser = async (
	id: string,
	data: UpdateQuery<Partial<User>>,
): Promise<UserData> =>
	fetch(`/api/user/${id}`, {
		method: 'PUT',
		body: JSON.stringify(data),
	}).then(async response => response.json());

export const get = {
	puzzle: getPuzzleById,
	set: getSetById,
	user: getUser,
};

export const update = {
	puzzle: updatePuzzle,
	set: updateSet,
	user: updateUser,
};

type BodyData = {
	didCheat: boolean;
	mistakes: number;
	timeTaken: number;
	maxTime: number;
	minTime: number;
	streak: number;
};

const parseGrade: Record<number, string> = {
	0: 'F',
	1: 'E',
	2: 'D',
	3: 'C',
	4: 'B',
	5: 'A',
	6: 'A+',
};

Object.freeze(parseGrade);
export {parseGrade};

export const getGrade = ({
	didCheat,
	mistakes,
	timeTaken,
	maxTime,
	minTime,
	streak = 0,
}: BodyData) => {
	if (didCheat || mistakes >= 3) return 1;
	if (mistakes === 2 || (mistakes === 1 && timeTaken >= maxTime)) return 2;
	if (mistakes === 1 || timeTaken >= maxTime) return 3;
	if (timeTaken >= minTime) return 4;
	if (streak < 2) return 5;
	return 6;
};

export const getTimeTaken = (initialTime: number, mistakes = 0) => {
	const timeTaken_ = (Date.now() - initialTime) / 1000;
	const timeTaken = Number.parseInt(timeTaken_.toFixed(2), 10);
	const timeWithMistakes = timeTaken + 3 * mistakes;
	return {timeTaken, timeWithMistakes};
};

export const getTimeInterval = (historyLength: number) => {
	const moveNumber_ = historyLength / 2;
	const maxTime = moveNumber_ * 8;
	const minTime = moveNumber_ * 4;
	return {maxTime, minTime};
};

type ThemesArgs = {
	userThemes: ThemeItem[];
	newThemes: string[];
};

export const getThemes = ({userThemes, newThemes}: ThemesArgs) => {
	const oldThemes = new Set(userThemes.map(t => t.title));
	const themesInCommon = userThemes.filter(t => newThemes.includes(t.title));
	const themesNotInCommon = newThemes.filter(id => !oldThemes.has(id));
	return {themesInCommon, themesNotInCommon};
};

export const getColor = (string_: 'w' | 'b') =>
	string_ === 'w' ? 'white' : 'black';

export const getMovable = (
	chess: ChessInstance,
): Partial<Config['movable']> => {
	const dests = new Map();
	for (const s of chess.SQUARES) {
		const ms = chess.moves({square: s, verbose: true});
		if (ms.length > 0)
			dests.set(
				s,
				ms.map(m => m.to),
			);
	}

	return {
		free: false,
		dests,
		showDests: true,
		color: 'both',
	};
};

const bodyUpdateFinishedSet = (timeTaken: number) => ({
	$inc: {
		cycles: 1,
		totalSetCompleted: 1,
	},
	$push: {
		times: timeTaken,
	},
	$set: {
		'puzzles.$[].played': false,
		currentTime: 0,
		progress: 0,
	},
});

export const getUpdateBody = {
	finishedSet: bodyUpdateFinishedSet,
};
