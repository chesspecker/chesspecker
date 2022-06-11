/* eslint-disable unicorn/no-array-reduce */
/* eslint-disable unicorn/no-array-callback-reference */
/* eslint-disable unicorn/no-array-push-push */
import {SVGProps} from 'react';
import {
	ClockIcon,
	LibraryIcon,
	FireIcon,
	LightningBoltIcon,
	AcademicCapIcon,
	SparklesIcon,
	ChartBarIcon,
} from '@heroicons/react/solid';
import useClock from '@/hooks/use-clock';
import {PuzzleSet} from '@/models/puzzle-set';

export type ViewData = {
	title: string;
	stat: string | number | JSX.Element;
	Icon?: (props: SVGProps<SVGSVGElement>) => JSX.Element;
	change?: string;
	type?: 'up' | 'down';
	hasChange: boolean;
	tooltip?: string;
};

const INFINITY = Number.POSITIVE_INFINITY;
const reducer = (accumulator: number, current: number) => accumulator + current;
const summer = (arrays: number[][]): number[] =>
	arrays.reduce<number[]>(
		(acc: number[], array) => acc.map((sum, i) => sum + array[i]),
		/* eslint-disable-next-line unicorn/no-new-array */
		new Array(arrays[0].length).fill(0),
	);

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

const ParseTime = ({time}: {time: number}): JSX.Element => {
	const [days, hours, minutes, seconds] = useClock(time);
	return (
		<span className='text-2xl font-semibold text-white dark:text-gray-900 justify-self-center'>
			{days !== 0 && `${days} days `}
			{hours !== 0 && `${hours} hours `}
			{minutes !== 0 && `${minutes} minutes `}
			{seconds !== 0 && `${seconds} seconds `}
		</span>
	);
};

export {parseGrade, ParseTime};

const getAverageGrade = (set: PuzzleSet): number => {
	const grades = set.puzzles
		.map(puzzle => puzzle.grades)
		.flat(INFINITY) as number[];
	const sum = grades.reduce(reducer, 0);
	return Math.round(sum / grades.length);
};

const totalCycles = (set: PuzzleSet): ViewData => ({
	title: 'How many times you completed this set',
	stat: <span>{set?.cycles}</span>,
	hasChange: false,
	Icon: FireIcon,
});

const totalAverageGrade = (set: PuzzleSet): ViewData => {
	const average = getAverageGrade(set);
	const stat = parseGrade[average];
	return {
		title: 'Average grade',
		stat,
		hasChange: false,
		Icon: LibraryIcon,
		tooltip:
			'Grades are calculated based on the number of mistakes and time taken to solve the puzzle.',
	};
};

const totalTimeSpent = (set: PuzzleSet): ViewData => {
	const sum = set.times.reduce(reducer, 0);
	const total = sum === 0 ? set.currentTime : sum + set.currentTime;
	const stat = <ParseTime time={total} />;
	return {
		title: 'Total time spent on this set',
		stat,
		hasChange: false,
		Icon: ClockIcon,
	};
};

const setRating = (set: PuzzleSet): ViewData => ({
	title: 'Elo rating',
	stat: <span>{set.rating}</span>,
	hasChange: false,
	Icon: ChartBarIcon,
	tooltip: 'Lichess rating of the puzzles in this set.',
});

const time = {
	lastOverFirst: (set: PuzzleSet): ViewData => {
		const result: ViewData = {
			title: 'Last time / first time',
			stat: '/',
			hasChange: false,
			Icon: LightningBoltIcon,
			tooltip: 'Compare your last completion time with your first run',
		};
		if (!set.cycles || set.cycles < 2) return result;

		const last = set.puzzles
			.map(puzzle => puzzle.timeTaken[set.cycles - 1])
			.reduce(reducer, 0);

		const first = set.puzzles
			.map(puzzle => puzzle.timeTaken[0])
			.reduce(reducer, 0);

		result.stat = `${last}s / ${first}s`;
		if (last !== first) {
			result.hasChange = true;
			result.change = last < first ? `${last - first}s` : `${last - first}s`;
			result.type = last < first ? 'up' : 'down';
		}

		return result;
	},
	lastOverAverage: (set: PuzzleSet): ViewData => {
		const result: ViewData = {
			title: 'Last time / average time',
			stat: '/',
			hasChange: false,
			Icon: LightningBoltIcon,
			tooltip: 'Compare your last completion time with your average time',
		};
		if (!set.cycles || set.cycles < 2) return result;

		const last = set.puzzles
			.map(puzzle => puzzle.timeTaken[set.cycles - 1])
			.reduce(reducer, 0);

		const previousTimes = set.puzzles
			.map(puzzle => puzzle.timeTaken)
			.flat(INFINITY)
			.reduce(reducer, 0);
		const average = Math.round((previousTimes as number) / set.cycles);

		result.stat = `${last}s / ${average}s`;
		if (last !== average) {
			result.hasChange = true;
			result.change =
				last < average ? `${last - average}s` : `${last - average}s`;
			result.type = last < average ? 'up' : 'down';
		}

		return result;
	},
	lastOverBest: (set: PuzzleSet): ViewData => {
		const result: ViewData = {
			title: 'Last time / best time',
			stat: '/',
			hasChange: false,
			Icon: SparklesIcon,
			tooltip: 'Compare your last completion time with your best time',
		};
		if (!set.cycles || set.cycles < 2) return result;

		const last = set.puzzles
			.map(puzzle => puzzle.timeTaken[set.cycles - 1])
			.reduce(reducer, 0);

		const allTimeTaken = set.puzzles.map(puzzle => puzzle.timeTaken);
		const sumOfRuns = summer(allTimeTaken).filter(Boolean);
		const best = Math.min(...sumOfRuns);

		result.stat = `${last}s / ${best}s`;
		if (last !== best) {
			result.hasChange = true;
			result.change = last < best ? `${last - best}s` : `${last - best}s`;
			result.type = last < best ? 'up' : 'down';
		}

		return result;
	},
};

const grade = {
	lastOverFirst: (set: PuzzleSet): ViewData => {
		const result: ViewData = {
			title: 'Last grade / first grade',
			stat: '/',
			hasChange: false,
			Icon: AcademicCapIcon,
			tooltip: 'Compare your last average grade with your first run',
		};
		if (!set.cycles || set.cycles < 2) return result;

		const last = set.puzzles.map(puzzle => puzzle.grades[set.cycles - 1]);
		const sumLast = last.reduce(reducer, 0);
		const averageLast = Math.round(sumLast / last.length);
		const parsedLast = parseGrade[averageLast];

		const first = set.puzzles.map(puzzle => puzzle.grades[0]);
		const sumFirst = first.reduce(reducer, 0);
		const averageFirst = Math.round(sumFirst / first.length);
		const parsedFirst = parseGrade[averageFirst];

		result.stat = `${parsedLast} / ${parsedFirst}`;
		if (averageLast !== averageFirst) {
			result.hasChange = true;
			result.change =
				averageLast < averageFirst
					? `${averageLast - averageFirst}`
					: `${averageLast - averageFirst}`;
			result.type = averageLast < averageFirst ? 'up' : 'down';
		}

		return result;
	},
	lastOverAverage: (set: PuzzleSet): ViewData => {
		const result: ViewData = {
			title: 'Last grade / average grade',
			stat: '/',
			hasChange: false,
			Icon: AcademicCapIcon,
			tooltip:
				'Compare your last average grade with your all over average grade',
		};
		if (!set.cycles || set.cycles < 2) return result;

		const last = set.puzzles.map(puzzle => puzzle.grades[set.cycles - 1]);
		const sumLast = last.reduce(reducer, 0);
		const averageLast = Math.round(sumLast / last.length);
		const parsedLast = parseGrade[averageLast];

		const average = getAverageGrade(set);
		const parsedAverage = parseGrade[average];

		result.stat = `${parsedLast} / ${parsedAverage}`;
		if (averageLast !== average) {
			result.hasChange = true;
			result.change =
				averageLast < average
					? `${averageLast - average}`
					: `${averageLast - average}`;
			result.type = averageLast < average ? 'up' : 'down';
		}

		return result;
	},
	lastOverBest: (set: PuzzleSet): ViewData => {
		const result: ViewData = {
			title: 'Last grade / best grade',
			stat: '/',
			hasChange: false,
			Icon: SparklesIcon,
			tooltip: 'Compare your last average grade with your best average grade',
		};
		if (!set.cycles || set.cycles < 2) return result;

		const last = set.puzzles.map(puzzle => puzzle.grades[set.cycles - 1]);
		const sumLast = last.reduce(reducer, 0);
		const averageLast = Math.round(sumLast / last.length);
		const parsedLast = parseGrade[averageLast];

		const average = getAverageGrade(set);

		const allGrades = set.puzzles.map(puzzle => puzzle.grades);
		const sumOfRuns = summer(allGrades).filter(Boolean);
		const best = Math.max(...sumOfRuns) / set.length;
		const parsedAverage = parseGrade[Math.round(best)];

		result.stat = `${parsedLast} / ${parsedAverage}`;
		if (averageLast !== average) {
			result.hasChange = true;
			result.change =
				averageLast < average
					? `${averageLast - average}`
					: `${averageLast - average}`;
			result.type = averageLast < average ? 'up' : 'down';
		}

		return result;
	},
};

const currentProgress = (set: PuzzleSet): ViewData => {
	const completedPuzzlesArray = set.spacedRepetition
		? set.puzzles.filter(puzzle => puzzle.grades[puzzle.grades.length - 1] >= 5)
		: set.puzzles.filter(puzzle => puzzle.played);
	const completedPuzzles = completedPuzzlesArray.length;
	const totalPuzzles = set.puzzles.length;
	const percentage = ((completedPuzzles / totalPuzzles) * 100).toFixed(2);
	return {
		title: 'Current progress',
		stat: `${completedPuzzles}/${totalPuzzles} • ${percentage}%`,
		hasChange: false,
		tooltip: 'How far are you from completing the set?',
	};
};

const currentTime = (set: PuzzleSet): ViewData => {
	const current = set.currentTime;
	const result: ViewData = {
		title: 'Current time',
		stat: <ParseTime time={current} />,
		hasChange: false,
		tooltip: 'Current time spent in seconds',
	};

	if (!set.cycles || set.cycles < 1) return result;

	const last = set.puzzles
		.filter(puzzle => puzzle.played)
		.map(puzzle => puzzle.timeTaken[set.cycles - 1])
		.reduce(reducer, 0);

	result.stat = `${current.toFixed(1)}s / ${last}s`;
	result.title = 'Current time / last time';
	if (last !== current) {
		result.hasChange = true;
		result.change =
			current < last
				? `${(last - current).toFixed(1)}s`
				: `${(last - current).toFixed(1)}s`;
		result.type = current < last ? 'up' : 'down';
	}

	return result;
};

const currentGrade = (set: PuzzleSet): ViewData => {
	const current = set.puzzles
		.filter(puzzle => puzzle.played)
		.map(puzzle => puzzle.grades[puzzle.grades.length - 1]);
	const sumCurrent = current.reduce(reducer, 0);
	const averageCurrent = Math.round(sumCurrent / current.length);
	const parsedCurrent = parseGrade[averageCurrent];

	const result: ViewData = {
		title: 'Current grade',
		stat: parsedCurrent,
		hasChange: false,
		tooltip: 'Current average grade this run',
	};

	if (!set.cycles || set.cycles < 1) return result;

	const last = set.puzzles
		.filter(puzzle => puzzle.played)
		.map(puzzle => puzzle.grades[set.cycles - 1]);
	const sumLast = last.reduce(reducer, 0);
	const averageLast = Math.round(sumLast / last.length);
	const parsedLast = parseGrade[averageLast];

	result.stat = `${parsedCurrent} / ${parsedLast}`;
	result.title = 'Current grade / last grade';
	if (averageLast !== averageCurrent) {
		result.hasChange = true;
		result.change =
			averageCurrent < averageLast
				? `${averageLast - averageCurrent}`
				: `${averageLast - averageCurrent}`;
		result.type = averageLast < averageCurrent ? 'up' : 'down';
	}

	return result;
};

export const getOverviewStats = (set: PuzzleSet): ViewData[] => {
	const data: ViewData[] = [];
	data.push(totalCycles(set));
	data.push(totalAverageGrade(set));
	data.push(totalTimeSpent(set));
	data.push(setRating(set));
	return data;
};

export const getProgressStats = (set: PuzzleSet): ViewData[] => {
	const data: ViewData[] = [];
	data.push(time.lastOverFirst(set));
	data.push(time.lastOverAverage(set));
	data.push(time.lastOverBest(set));
	data.push(grade.lastOverFirst(set));
	data.push(grade.lastOverAverage(set));
	data.push(grade.lastOverBest(set));
	return data;
};

export const getCurrentRunStats = (set: PuzzleSet): ViewData[] => {
	const data: ViewData[] = [];
	data.push(currentProgress(set));
	data.push(currentTime(set));
	data.push(currentGrade(set));
	return data;
};
