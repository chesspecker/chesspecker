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
} from '@heroicons/react/solid';
import useClock from '@/hooks/use-clock';
import {PuzzleSetInterface} from '@/types/models';

export type ViewData = {
	title: string;
	stat: string | number | JSX.Element;
	Icon?: (props: SVGProps<SVGSVGElement>) => JSX.Element;
	change?: string;
	type?: 'up' | 'down';
	hasChange: boolean;
};

const INFINITY = Number.POSITIVE_INFINITY;
const reducer = (accumulator: number, current: number) => accumulator + current;

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
	const [days, hours, minutes, secondes] = useClock(time);
	return (
		<p className='text-2xl font-semibold text-gray-900 justify-self-center'>
			{days !== 0 && `${days} days `}
			{hours !== 0 && `${hours} hours `}
			{minutes !== 0 && `${minutes} minutes `}
			{secondes !== 0 && `${secondes} secondes `}
		</p>
	);
};

const getAverageGrade = (set: PuzzleSetInterface): number => {
	const grades = set.puzzles
		.map(puzzle => puzzle.grades)
		.flat(INFINITY) as number[];
	const sum = grades.reduce(reducer, 0);
	return Math.round(sum / grades.length);
};

const totalCycles = (set: PuzzleSetInterface): ViewData => ({
	title: 'How many times you completed this set',
	stat: set.cycles.toString(),
	hasChange: false,
	Icon: FireIcon,
});

const totalAverageGrade = (set: PuzzleSetInterface): ViewData => {
	const average = getAverageGrade(set);
	const stat = parseGrade[average];
	return {title: 'Average grade', stat, hasChange: false, Icon: LibraryIcon};
};

const totalTimeSpent = (set: PuzzleSetInterface): ViewData => {
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

const time = {
	lastOverFirst: (set: PuzzleSetInterface): ViewData => {
		const result: ViewData = {
			title: 'Last time / first time',
			stat: '/',
			hasChange: false,
			Icon: LightningBoltIcon,
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
	lastOverAverage: (set: PuzzleSetInterface): ViewData => {
		const result: ViewData = {
			title: 'Last time / average time',
			stat: '/',
			hasChange: false,
			Icon: LightningBoltIcon,
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
};

const grade = {
	lastOverFirst: (set: PuzzleSetInterface): ViewData => {
		const result: ViewData = {
			title: 'Last grade / first grade',
			stat: '/',
			hasChange: false,
			Icon: AcademicCapIcon,
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
	lastOverAverage: (set: PuzzleSetInterface): ViewData => {
		const result: ViewData = {
			title: 'Last grade / average grade',
			stat: '/',
			hasChange: false,
			Icon: AcademicCapIcon,
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
};

const currentProgress = (set: PuzzleSetInterface): ViewData => {
	const completedPuzzles = set.puzzles.filter(puzzle => puzzle.played).length;
	const totalPuzzles = set.puzzles.length;
	const percentage = ((completedPuzzles / totalPuzzles) * 100).toFixed(2);
	return {
		title: 'Current progress',
		stat: `${completedPuzzles}/${totalPuzzles} • ${percentage}%`,
		hasChange: false,
	};
};

const currentTime = (set: PuzzleSetInterface): ViewData => ({
	title: 'Current time',
	stat: <ParseTime time={set.currentTime} />,
	hasChange: false,
});

const currentGrade = (set: PuzzleSetInterface): ViewData => {
	const last = set.puzzles
		.filter(puzzle => puzzle.played)
		.map(puzzle => puzzle.grades[puzzle.grades.length - 1]);
	const sumLast = last.reduce(reducer, 0);
	const averageLast = Math.round(sumLast / last.length);
	return {
		title: 'Current grade',
		stat: parseGrade[averageLast],
		hasChange: false,
	};
};

export const getOverviewStats = (set: PuzzleSetInterface): ViewData[] => {
	const data: ViewData[] = [];
	data.push(totalCycles(set));
	data.push(totalAverageGrade(set));
	data.push(totalTimeSpent(set));
	return data;
};

export const getProgressStats = (set: PuzzleSetInterface): ViewData[] => {
	const data: ViewData[] = [];
	data.push(time.lastOverFirst(set));
	data.push(time.lastOverAverage(set));
	data.push(grade.lastOverFirst(set));
	data.push(grade.lastOverAverage(set));
	return data;
};

export const getCurrentRunStats = (set: PuzzleSetInterface): ViewData[] => {
	const data: ViewData[] = [];
	data.push(currentProgress(set));
	data.push(currentTime(set));
	data.push(currentGrade(set));
	return data;
};
