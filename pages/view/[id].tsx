/* eslint-disable unicorn/no-array-reduce */
/* eslint-disable unicorn/no-array-callback-reference */
import {GetServerSideProps} from 'next';
import {ReactElement} from 'react';
import type {Data as SetData} from '@/api/set/[id]';
import Donnuts from '@/components/doughnuts';
import useClock from '@/hooks/use-clock';
import Layout from '@/layouts/main';
import {PuzzleItemInterface, PuzzleSetInterface} from '@/types/models';

const INFINITY = Number.POSITIVE_INFINITY;
const reducer = (accumulator: number, current: number) => accumulator + current;

const getTotalTime = (set: PuzzleSetInterface): number => {
	const t = set.times.reduce(reducer, 0);
	return t === 0 ? set.currentTime : t + set.currentTime;
};

const ParsedTime = ({set}: {set: PuzzleSetInterface}): JSX.Element => {
	const totalTime = getTotalTime(set);
	const [days, hours, minutes, secondes] = useClock(totalTime);
	return (
		<p className='text-2xl font-bold text-white align-self-center'>
			{days !== 0 && `${days} days `}
			{hours !== 0 && `${hours} hours `}
			{minutes !== 0 && `${minutes} minutes `}
			{secondes !== 0 && `${secondes} secondes `}
		</p>
	);
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

const lastOverAverageTime = (set: PuzzleSetInterface): string => {
	if (!set.cycles || set.cycles < 2) return '/';

	const last = set.puzzles
		.map(puzzle => puzzle.timeTaken[set.cycles - 1])
		.reduce(reducer, 0);

	const previousTimes = set.puzzles
		.map(puzzle => puzzle.timeTaken)
		.flat(INFINITY)
		.reduce(reducer, 0);
	const average = Math.round((previousTimes as number) / set.cycles);

	return `${last}s / ${average}s`;
};

const lastOverAverageGrade = (set: PuzzleSetInterface): string => {
	if (!set.cycles || set.cycles < 2) return '/';

	const last = set.puzzles.map(puzzle => puzzle.grades[set.cycles - 1]);
	const sumLast = last.reduce(reducer, 0);
	const averageLast = Math.round(sumLast / last.length);

	return `${parseGrade[averageLast]} / ${getAverageGrade(set)}`;
};

const GetCurrentTime = ({set}: {set: PuzzleSetInterface}): JSX.Element => {
	const [days, hours, minutes, secondes] = useClock(set.currentTime);
	if (!set?.currentTime || set.currentTime === 0) return <p>0</p>;

	return (
		<p className='text-2xl font-bold text-white align-self-center'>
			{days !== 0 && `${days} days `}
			{hours !== 0 && `${hours} hours `}
			{minutes !== 0 && `${minutes} minutes `}
			{secondes !== 0 && `${secondes} secondes `}
		</p>
	);
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
	<div className='m-3 flex min-h-[10rem] min-w-[20rem] flex-auto flex-col items-center rounded-xl border-4 border-white p-4'>
		<h3 className='text-center h3'>{title}</h3>
		<div className='flex items-center justify-center w-full h-full'>
			<p className='text-5xl font-bold text-white justify-self-center'>
				{data}
			</p>
		</div>
	</div>
);

const getClasses = (grade: number) => {
	const result = 'h-3 w-5 cursor-pointer rounded-sm mb-1 ';
	if (grade < 3) return result + 'bg-red-500';
	if (grade < 5) return result + 'bg-orange-500';
	if (grade < 7) return result + 'bg-green-500';
};

const getAverage = (array: number[]): number =>
	array.reduce(reducer, 0) / array.length;

const PuzzleComponent = (puzzle: PuzzleItemInterface): JSX.Element => (
	<a
		key={puzzle.PuzzleId}
		href={`https://lichess.org/training/${puzzle.PuzzleId}`}
		className={getClasses(getAverage(puzzle.grades))}
	/>
);

type Props = {currentSetProps: PuzzleSetInterface};
const ViewingPage = ({currentSetProps: set}: Props) => {
	if (!set || !set.puzzles) return null;
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
					<Block
						title='Total time spent on this set'
						data={<ParsedTime set={set} />}
					/>
				</div>
			</div>
			<div className='w-full mt-4'>
				<h2 className='h2'>Global progression</h2>
				<div className='flex flex-wrap w-full mt-4'>
					<Block title='Last time / First time' data={lastOverFirstTime(set)} />
					<Block
						title='Last time / Average time'
						data={lastOverAverageTime(set)}
					/>
					<Block
						title='Last grade / First grade'
						data={lastOverFirstGrade(set)}
					/>
					<Block
						title='Last grade / Average grade'
						data={lastOverAverageGrade(set)}
					/>
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

					<Block title='Current time' data={<GetCurrentTime set={set} />} />
					<Block title='Current grade' data={getCurrentGrade(set)} />
				</div>
			</div>

			<div className='flex-wrap w-full mt-4'>
				<h2 className='h2'>All puzzles</h2>
				<div className='flex flex-row flex-wrap w-full gap-1'>
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
