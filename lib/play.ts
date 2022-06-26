import type {ChessInstance} from 'chess.js';
import type {Config} from 'chessground/config';
import {groupBy} from './utils';
import {PuzzleItem} from '@/models/puzzle-item';
import type {PuzzleData} from '@/api/puzzle/[id]';
import {ThemeItem} from '@/models/theme';
import {Puzzle} from '@/models/puzzle';

const getTimeTaken = (initialTime: number, mistakes = 0) => {
	const timeTaken_ = (Date.now() - initialTime) / 1000;
	const timeTaken = Number.parseInt(timeTaken_.toFixed(2), 10);
	const timeWithMistakes = timeTaken + 3 * mistakes;
	return {timeTaken, timeWithMistakes};
};

const getTimeInterval = (historyLength: number) => {
	const moveNumber_ = historyLength / 2;
	const maxTime = moveNumber_ * 8;
	const minTime = moveNumber_ * 4;
	return {maxTime, minTime};
};

export const getTime = {
	taken: getTimeTaken,
	interval: getTimeInterval,
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

type PropsRetrieveCurrentPuzzle = {
	puzzleItemList: PuzzleItem[];
	puzzleIndex: number;
	nextPuzzle: Puzzle | undefined;
	setPuzzle: React.Dispatch<React.SetStateAction<Puzzle | undefined>>;
	setNextPuzzle: React.Dispatch<React.SetStateAction<Puzzle | undefined>>;
};

export const getCurrentPuzzle = ({
	puzzleItemList,
	puzzleIndex,
	nextPuzzle,
	setPuzzle,
	setNextPuzzle,
}: PropsRetrieveCurrentPuzzle) => {
	if (!puzzleItemList[puzzleIndex] || puzzleItemList.length === 0) return;
	const item = puzzleItemList[puzzleIndex];
	if (nextPuzzle?.PuzzleId === item.PuzzleId) {
		console.log('🟣 using cached puzzle:', item.PuzzleId);
		setPuzzle(() => nextPuzzle);
	} else {
		console.log('🔵 fetching puzzle:', item.PuzzleId);
		fetch(`/api/puzzle/${item.PuzzleId}`)
			.then(async response => response.json() as Promise<PuzzleData>)
			.then(request => {
				console.log('🟢 fetched puzzle:', item.PuzzleId);
				if (request.success) setPuzzle(() => request.data);
			})
			.catch(console.error);
	}

	if (!puzzleItemList[puzzleIndex + 1]) return;
	const item2 = puzzleItemList[puzzleIndex + 1];
	console.log('🔵 fetching next puzzle:', item2.PuzzleId);
	fetch(`/api/puzzle/${item2.PuzzleId}`)
		.then(async response => response.json() as Promise<PuzzleData>)
		.then(request => {
			console.log('🟢 fetched next puzzle:', item2.PuzzleId);
			if (request.success) setNextPuzzle(() => request.data);
		})
		.catch(console.error);
};

export const updatePuzzleSolvedByCategories = (
	puzzleSolvedByCategories: ThemeItem[],
	puzzleThemes: string[],
): ThemeItem[] => {
	const groupedArray = groupBy<ThemeItem>(
		puzzleSolvedByCategories,
		v => v.title,
	);

	const puzzleSolvedByCategories_: ThemeItem[] = Object.keys(groupedArray).map(
		key => ({
			title: key,
			count: groupedArray[key].reduce(
				(previous_: number, {count}) => previous_ + count,
				0,
			),
		}),
	);

	const userThemes = puzzleSolvedByCategories_;
	const newThemes = puzzleThemes;
	const {themesInCommon, themesNotInCommon} = getThemes({
		userThemes,
		newThemes,
	});

	if (themesNotInCommon.length > 0)
		puzzleSolvedByCategories_.push(
			...themesNotInCommon.map(title => ({title, count: 1})),
		);

	if (themesInCommon.length > 0)
		for (const theme of themesInCommon) {
			const currentTheme =
				puzzleSolvedByCategories_[
					puzzleSolvedByCategories_.indexOf(
						puzzleSolvedByCategories_.find(
							value => value.title === theme.title,
						)!,
					)
				];

			currentTheme.count += 1;
		}

	return puzzleSolvedByCategories_;
};

type PropsFinishedSetUpdate = {
	timeTaken: number;
};

const getFinishedSetUpdateBody = ({timeTaken}: PropsFinishedSetUpdate) => ({
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

type PropsPuzzleSetUpdate = {
	currentGrade: number;
	currentTime: number;
	mistakes: number;
	timeTaken: number;
};

export const getPuzzleSetUpdateBody = ({
	currentGrade,
	currentTime,
	mistakes,
	timeTaken,
}: PropsPuzzleSetUpdate) => {
	const updatePuzzleSet = {
		$inc: {
			'puzzles.$.count': 1,
			'puzzles.$.streak': 0,
			currentTime,
			progress: 1,
		},
		$push: {
			'puzzles.$.mistakes': mistakes,
			'puzzles.$.timeTaken': timeTaken,
			'puzzles.$.grades': currentGrade,
		},
		$set: {
			'puzzles.$.played': true,
		},
	};
	return updatePuzzleSet;
};

export const getUpdateBody = {
	set: getFinishedSetUpdateBody,
	puzzle: getPuzzleSetUpdateBody,
};
