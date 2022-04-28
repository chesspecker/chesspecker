/* eslint-disable new-cap */
import {ReactElement} from 'react';
import {GetServerSideProps} from 'next';
import ChartOneLine from '@/components/chart-one-line';
import Layout from '@/layouts/main';
import {PuzzleSetInterface} from '@/types/models';
import useClock from '@/hooks/use-clock';
import Donnuts from '@/components/doughnuts';
import ChartMultipleLine from '@/components/chart-multiple-line';
import type {Data as SetData} from '@/api/set/[id]';

const getRapidity = (set: PuzzleSetInterface) => {
	const bestTime = 5;
	const wortTime = 50;
	const scale = wortTime - bestTime;
	const step = 100 / scale;
	const length = set.puzzles ? set.puzzles.filter(p => p.played).length : 0;
	const averageTime = set.currentTime / length;
	const rapidity = 100 - (averageTime - bestTime) * step;
	return rapidity < 0 ? 0 : rapidity;
};

const armonizedData = (array: number[]): number[] => {
	const numberOfLine = 10;
	if (array.length < numberOfLine) return array;
	const length = array.length;
	const iterator = numberOfLine;
	const packBy = Math.round(length / iterator);

	const newArray: number[] = [];
	for (let i = 0; i < iterator; i++) {
		const _oldArray = [...array];
		const _array = _oldArray.slice(i * packBy, i * packBy + packBy);
		newArray.push(_array.reduce((a, b) => a + b, 0) / _array.length);
	}

	return newArray;
};

const getArrayOfTimeByPuzzle = (set: PuzzleSetInterface): number[] =>
	armonizedData(
		set.puzzles
			.filter(puzzle => puzzle.played)
			.map(puzzle => puzzle.timeTaken[puzzle.timeTaken.length - 1]),
	);

const getArrayOfMistakeByPuzzle = (set: PuzzleSetInterface): number[] =>
	armonizedData(
		set.puzzles
			.filter(puzzle => puzzle.played)
			.map(puzzle => puzzle.mistakes[puzzle.mistakes.length - 1]),
	);

const GetTotalTime = (set: PuzzleSetInterface): JSX.Element => {
	const totalTime = set.times.reduce(
		(previous, current) => previous + current,
		0,
	);
	const toFormatTime = totalTime === 0 ? set.currentTime : totalTime;
	const [days, hours, minutes, secondes] = useClock(toFormatTime);
	return (
		<p className='align-self-center text-2xl font-bold text-white'>
			{days !== 0 && `${days} days `}
			{hours !== 0 && `${hours} hours `}
			{minutes !== 0 && `${minutes} minutes `}
			{secondes !== 0 && `${secondes} secondes `}
		</p>
	);
};

const getAtonAp = (set: PuzzleSetInterface): string => {
	if (!set.cycles || set.cycles === 0 || set.cycles === 0) return '0%';

	const arrayOfPreviousTime = [];
	for (let i = 0; i < set.times.length; i++) {
		for (const puzzle of set.puzzles) {
			arrayOfPreviousTime.push(puzzle.timeTaken[i]);
		}
	}

	const averagePreviousTime =
		arrayOfPreviousTime.reduce(
			(previous: number, current: number) => previous + current,
			0,
		) / arrayOfPreviousTime.length;

	const arrayOfActualTime = set.puzzles
		.filter(puzzle => puzzle.timeTaken.length >= set.times.length)
		.map(puzzle => puzzle.timeTaken[puzzle.timeTaken.length - 1]);

	const averageActualTime =
		arrayOfActualTime.reduce((previous, current) => previous + current, 0) /
		arrayOfActualTime.length;

	return `${Math.round((1 - averageActualTime / averagePreviousTime) * 100)} %`;
};

const getAgonAg = (set: PuzzleSetInterface): string => {
	if (!set.cycles || set.cycles === 0) return '0%';
	const arrayOfPreviousMistakes: number[] = [];
	for (let i = 0; i < set.times.length; i++) {
		for (const puzzle of set.puzzles) {
			arrayOfPreviousMistakes.push(puzzle.mistakes[i]);
		}
	}

	const averagePreviousMistakes =
		arrayOfPreviousMistakes.reduce(
			(previous, current) => previous + current,
			0,
		) / arrayOfPreviousMistakes.length;
	const puzzlePlayedInLastTry = set.puzzles.filter(
		puzzle => puzzle.mistakes.length >= set.times.length,
	);
	const arrayOfActualMistakes = puzzlePlayedInLastTry.map(
		puzzle => puzzle.mistakes[puzzle.mistakes.length - 1],
	);
	const averageActualTime =
		arrayOfActualMistakes.reduce((previous, current) => previous + current, 0) /
		arrayOfActualMistakes.length;

	return `${Math.round(
		(1 - averageActualTime / averagePreviousMistakes) * 100,
	)} %`;
};

const GetActualTime = (set: PuzzleSetInterface): JSX.Element => {
	const [days, hours, minutes, secondes] = useClock(set.currentTime);

	return (
		<p className='align-self-center text-2xl font-bold text-white'>
			{days !== 0 && `${days} days `}
			{hours !== 0 && `${hours} hours `}
			{minutes !== 0 && `${minutes} minutes `}
			{secondes !== 0 && `${secondes} secondes `}
		</p>
	);
};

const getTotalAverageGrade = (set: PuzzleSetInterface): string => {
	const arrayOfGrade = set.puzzles
		.map(puzzle => puzzle.grades)
		.flat(Number.POSITIVE_INFINITY) as number[];
	const sum = arrayOfGrade.reduce((previous, current) => previous + current, 0);
	const average = sum / arrayOfGrade.length;
	if (average > 5.5) return 'A';
	if (average > 4.5) return 'B';
	if (average > 3.5) return 'C';
	if (average > 2.5) return 'D';
	if (average > 1.5) return 'E';
	if (average <= 1.5) return 'F';
};

type Props = {currentSetProps: PuzzleSetInterface};
const ViewingPage = ({currentSetProps: set}: Props) => {
	if (!set || !set.puzzles) return null;
	return (
		<div className='m-0 flex min-h-screen w-screen flex-col px-2 pt-32 pb-24 sm:px-12 '>
			<h1 className=' mt-8 mb-6 p-5  font-merriweather text-3xl font-bold text-white md:text-5xl'>
				{set.title}
			</h1>

			<div className='mt-4 w-full'>
				<h2 className='h2'>Puzzle set state</h2>
				<div className='mt-4 flex w-full flex-wrap'>
					<div className=' m-3 flex min-h-[10rem] min-w-[20rem] flex-auto flex-col items-center justify-center rounded-xl border-4 border-white p-4  '>
						<h3 className='h3 text-center'>Time you complete this set</h3>
						<div className='flex h-full w-full items-center justify-center'>
							<p className='justify-self-center text-5xl font-bold text-white'>
								{set.cycles ? set.cycles : 0}
							</p>
						</div>
					</div>
					<div className=' m-3 flex min-h-[10rem] w-1/3 min-w-[20rem] flex-auto  flex-col items-center justify-center rounded-xl border-4 border-white p-4  '>
						<h3 className='h3 text-center'>Total average grade</h3>
						<div className='flex h-full w-full items-center justify-center'>
							<p className=' justify-self-center text-5xl font-bold text-white'>
								{getTotalAverageGrade(set)}
							</p>
						</div>
					</div>
					<div className=' m-3 flex min-h-[10rem] w-1/3 min-w-[20rem] flex-auto  flex-col items-center justify-center rounded-xl border-4 border-white p-4  '>
						<h3 className='h3 text-center'>Total time spent on this set</h3>
						<div className='flex h-full w-full items-center justify-center'>
							{GetTotalTime(set)}
						</div>
					</div>
				</div>
			</div>
			<div className='mt-4 w-full'>
				<h2 className='h2'>Global Progression</h2>
				<div className='mt-4 flex w-full flex-wrap'>
					<div className=' m-3 flex  min-h-[10rem]  min-w-[20rem] flex-auto flex-col  items-center rounded-xl border-4 border-white p-4  '>
						<h3 className='h3 text-center'>
							Actual time / Average previous time
						</h3>
						<div className='flex h-full w-full items-center justify-center'>
							<p className=' justify-self-center text-5xl font-bold text-white'>
								{getAtonAp(set)}
							</p>
						</div>
					</div>
					<div className=' m-3 flex min-h-[10rem]   min-w-[20rem] flex-auto flex-col  items-center rounded-xl border-4 border-white p-4  '>
						<h3 className='h3 text-center'>
							Actual grade / Average previous grade
						</h3>
						<div className='flex h-full w-full items-center justify-center'>
							<p className='align-self-center text-5xl font-bold text-white'>
								{getAgonAg(set)}
							</p>
						</div>
					</div>
				</div>
			</div>
			<div className='mt-4 w-full flex-wrap'>
				<h2 className='h2'>Actual Progression</h2>
				<div className='mt-4 flex w-full flex-wrap justify-around'>
					<div className=' m-3 flex flex-auto flex-col items-center  rounded-xl border-4 border-white p-4  '>
						<h3 className='h3 text-center'>Progress</h3>
						<div className='flex h-full items-center justify-center'>
							<Donnuts
								played={set.puzzles?.filter(p => p.played).length}
								totalSet={set.length}
							/>
						</div>
					</div>
					<div className='m-3 flex min-h-[10rem]  min-w-[20rem] flex-auto flex-col  items-center rounded-xl border-4 border-white p-4  '>
						<h3 className='h3 text-center'>Actual time</h3>
						<div className='flex h-full w-full items-center justify-center'>
							{GetActualTime(set)}
						</div>
					</div>
					<div className=' m-3 flex  flex-auto flex-col  items-center rounded-xl border-4 border-white p-4  '>
						<h3 className='h3 text-center'>Average Grade</h3>
						<div className='flex h-full items-center justify-center'>
							<ChartOneLine rapidity={getRapidity(set)} />
						</div>
					</div>
				</div>
			</div>

			<div className='mt-10 pt-10'>
				<ChartMultipleLine
					array1={getArrayOfTimeByPuzzle(set)}
					array2={getArrayOfMistakeByPuzzle(set)}
					name1='time evolution'
					name2='mistake evolution'
				/>
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
