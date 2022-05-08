/* eslint-disable unicorn/no-array-reduce */
/* eslint-disable unicorn/no-array-callback-reference */
import {GetServerSideProps} from 'next';
import {ReactElement, SVGProps, useEffect, useState} from 'react';
import type {Data as SetData} from '@/api/set/[id]';
import Donnuts from '@/components/doughnuts';
import useClock from '@/hooks/use-clock';
import Layout from '@/layouts/main';
import {PuzzleItemInterface, PuzzleSetInterface} from '@/types/models';
import {
	ArrowSmDownIcon,
	ArrowSmUpIcon,
	UsersIcon,
} from '@heroicons/react/solid';

const INFINITY = Number.POSITIVE_INFINITY;
const reducer = (accumulator: number, current: number) => accumulator + current;
const classNames = (...classes: string[]) => classes.filter(Boolean).join(' ');

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

const getTotalTime = (set: PuzzleSetInterface): number => {
	const t = set.times.reduce(reducer, 0);
	return t === 0 ? set.currentTime : t + set.currentTime;
};

const DisplayTime = ({time}: {time: number}) => {
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

const parsedTime = (set: PuzzleSetInterface): JSX.Element => {
	const totalTime = getTotalTime(set);
	return <DisplayTime time={totalTime} />;
};

const getAverageGrade = (set: PuzzleSetInterface): string => {
	const grades = set.puzzles
		.map(puzzle => puzzle.grades)
		.flat(INFINITY) as number[];
	const sum = grades.reduce(reducer, 0);
	const average = Math.round(sum / grades.length);
	return parseGrade[average];
};

const lastOverFirstTime = (set: PuzzleSetInterface): string => {
	if (!set.cycles || set.cycles < 2) return '/';

	const last = set.puzzles
		.map(puzzle => puzzle.timeTaken[set.cycles - 1])
		.reduce(reducer, 0);

	const first = set.puzzles
		.map(puzzle => puzzle.timeTaken[0])
		.reduce(reducer, 0);

	return `${last}s / ${first}s`;
};

const lastOverFirstGrade = (set: PuzzleSetInterface): string => {
	if (!set.cycles || set.cycles < 2) return '/';

	const last = set.puzzles.map(puzzle => puzzle.grades[set.cycles - 1]);
	const sumLast = last.reduce(reducer, 0);
	const averageLast = Math.round(sumLast / last.length);

	const first = set.puzzles.map(puzzle => puzzle.grades[0]);
	const sumFirst = first.reduce(reducer, 0);
	const averageFirst = Math.round(sumFirst / first.length);

	return `${parseGrade[averageLast]} / ${parseGrade[averageFirst]}`;
};

const getLastOverAverageTime = (set: PuzzleSetInterface): Data => {
	if (!set.cycles || set.cycles < 2)
		return {stat: '/', change: '', type: 'none'};

	const last = set.puzzles
		.map(puzzle => puzzle.timeTaken[set.cycles - 1])
		.reduce(reducer, 0);

	const previousTimes = set.puzzles
		.map(puzzle => puzzle.timeTaken)
		.flat(INFINITY)
		.reduce(reducer, 0);
	const average = Math.round((previousTimes as number) / set.cycles);

	const type = last < average ? 'up' : 'down';
	const change = type === 'up' ? `${last - average}s` : `${last - average}s`;

	return {stat: `${last}s / ${average}s`, change, type};
};

const lastOverAverageGrade = (set: PuzzleSetInterface): string => {
	if (!set.cycles || set.cycles < 2) return '/';

	const last = set.puzzles.map(puzzle => puzzle.grades[set.cycles - 1]);
	const sumLast = last.reduce(reducer, 0);
	const averageLast = Math.round(sumLast / last.length);

	return `${parseGrade[averageLast]} / ${getAverageGrade(set)}`;
};

const getCurrentTime = (set: PuzzleSetInterface): JSX.Element => {
	if (!set?.currentTime || set.currentTime === 0) return <p>0</p>;
	return <DisplayTime time={set.currentTime} />;
};

const getCurrentGrade = (set: PuzzleSetInterface): string => {
	const last = set.puzzles
		.filter(puzzle => puzzle.played)
		.map(puzzle => puzzle.grades[puzzle.grades.length - 1]);
	const sumLast = last.reduce(reducer, 0);
	const averageLast = Math.round(sumLast / last.length);
	return parseGrade[averageLast];
};

type BlockProps = {title: string; data: string | number | JSX.Element};

const Block = ({title, data}: BlockProps): JSX.Element => (
	<div className='m-3 flex min-h-[10rem] min-w-[20rem] flex-auto flex-col items-center px-4 py-5 overflow-hidden bg-white rounded-lg shadow sm:pt-6 sm:px-6'>
		<h3 className='text-sm font-medium text-center text-gray-500 truncate'>
			{title}
		</h3>
		<div className='flex items-center justify-center w-full h-full'>
			<p className='text-2xl font-semibold text-gray-900 justify-self-center'>
				{data}
			</p>
		</div>
	</div>
);

type StatBlockProps = {
	title: string;
	stat: Data['stat'];
	type: Data['type'];
	change: Data['change'];
	Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
};

const StatBlock = ({
	title,
	stat,
	type,
	change,
	Icon,
}: StatBlockProps): JSX.Element =>
	type === 'none' ? null : (
		<div className='relative px-4 py-5 overflow-hidden bg-white rounded-lg shadow sm:pt-6 sm:px-6'>
			<div>
				<div className='absolute p-3 rounded-md bg-sky-700'>
					<Icon className='w-6 h-6 text-white' aria-hidden='true' />
				</div>
				<p className='ml-16 text-sm font-medium text-gray-500 truncate'>
					{title}
				</p>
			</div>
			<div className='flex items-baseline ml-16'>
				<p className='text-2xl font-semibold text-gray-900'>{stat}</p>
				<p
					className={classNames(
						type === 'up' ? 'text-green-600' : 'text-red-600',
						'ml-2 flex items-baseline text-sm font-semibold',
					)}
				>
					{type === 'up' ? (
						<ArrowSmUpIcon
							className='self-center flex-shrink-0 w-5 h-5 text-green-500'
							aria-hidden='true'
						/>
					) : (
						<ArrowSmDownIcon
							className='self-center flex-shrink-0 w-5 h-5 text-red-500'
							aria-hidden='true'
						/>
					)}
					<span className='sr-only'>
						{type === 'up' ? 'Increased' : 'Decreased'} by
					</span>
					{change}
				</p>
			</div>
		</div>
	);

const getClasses = (grade: number) => {
	const base = 'h-5 w-10 cursor-pointer rounded-sm mb-1';
	if (grade < 3) return `${base} bg-red-500`;
	if (grade < 5) return `${base} bg-orange-500`;
	if (grade < 7) return `${base} bg-green-500`;
};

const getAverage = (array: number[]): number =>
	array.reduce(reducer, 0) / array.length;

const PuzzleComponent = (puzzle: PuzzleItemInterface): JSX.Element => (
	<a
		key={puzzle.PuzzleId}
		href={`https://lichess.org/training/${puzzle.PuzzleId}`}
		className={getClasses(getAverage(puzzle.grades))}
		target='_blank'
	/>
);

type Data = {
	stat: string;
	change: string;
	type: 'up' | 'down' | 'none';
};
type Props = {currentSetProps: PuzzleSetInterface};
const ViewingPage = ({currentSetProps: set}: Props) => {
	if (!set || !set.puzzles) return null;
	const none: Data = {stat: '/', change: '', type: 'none'};
	const [lastOverAverageTime, setLastOverAverageTime] = useState<Data>(none);

	useEffect(() => {
		if (!set) return;
		setLastOverAverageTime(getLastOverAverageTime(set));
	}, [set]);

	return (
		<div className='flex flex-col w-screen min-h-screen px-2 pt-32 pb-24 m-0 sm:px-12'>
			<h1 className='p-5 mt-8 mb-6 font-sans text-3xl font-bold text-white md:text-5xl'>
				{set.title}
			</h1>

			<div className='w-full mt-4'>
				<h2 className='h2'>Puzzle set state</h2>
				<div className='flex flex-wrap w-full mt-4'>
					<Block title='Time you completed this set' data={set.cycles} />
					<Block title='Total average grade' data={getAverageGrade(set)} />
					<Block title='Total time spent on this set' data={parsedTime(set)} />
				</div>
			</div>
			<div className='w-full mt-4'>
				<h2 className='h2'>Global progression</h2>
				<div className='flex flex-wrap w-full mt-4'>
					<Block title='Last time / First time' data={lastOverFirstTime(set)} />
					<Block
						title='Last grade / First grade'
						data={lastOverFirstGrade(set)}
					/>
					<Block
						title='Last grade / Average grade'
						data={lastOverAverageGrade(set)}
					/>

					<div className='grid grid-cols-1 gap-5 mt-5 sm:grid-cols-2 lg:grid-cols-3'>
						<StatBlock
							title='Last time vs. Average time'
							stat={lastOverAverageTime.stat}
							type={lastOverAverageTime.type}
							change={lastOverAverageTime.change}
							Icon={UsersIcon}
						/>
						<StatBlock
							title='Last grade / Average grade'
							stat={lastOverAverageGrade(set)}
							type='up'
							change='122%'
							Icon={UsersIcon}
						/>
					</div>
				</div>
			</div>
			<div className='flex-wrap w-full mt-4'>
				<h2 className='h2'>Current progression</h2>
				<div className='flex flex-wrap justify-around w-full mt-4'>
					<Block
						title='Current progress'
						data={
							<Donnuts
								played={set.puzzles?.filter(p => p.played).length}
								totalSet={set.length}
							/>
						}
					/>

					<Block title='Current time' data={getCurrentTime(set)} />
					<Block title='Current grade' data={getCurrentGrade(set)} />
				</div>
			</div>

			<div className='flex-wrap w-full mt-4'>
				<h2 className='mb-4 h2'>All puzzles</h2>
				<div className='flex flex-row flex-wrap w-full gap-2 mb-4'>
					{set.puzzles.map(puzzle => (
						<PuzzleComponent key={puzzle.PuzzleId} {...puzzle} />
					))}
				</div>
			</div>
		</div>
	);
};

ViewingPage.getLayout = (page: ReactElement): JSX.Element => (
	<Layout>{page}</Layout>
);
export default ViewingPage;

export const getServerSideProps: GetServerSideProps = async ({req, params}) => {
	const id: string = params.id as string;
	const protocol = (req.headers['x-forwarded-proto'] as string) || 'http';
	const baseUrl = req ? `${protocol}://${req.headers.host}` : '';
	const data = await fetch(`${baseUrl}/api/set/${id}`).then(
		async response => response.json() as Promise<SetData>,
	);
	if (!data?.success) return {notFound: true};
	return {props: {currentSetProps: data.set}};
};
