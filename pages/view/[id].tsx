import {useState, useEffect, useCallback, ReactElement} from 'react';
import Router from 'next/router.js';
import {loadStripe} from '@stripe/stripe-js';
import axios from 'axios';
import ChartOneLine from '../../components/chartOneLine';
import Layout from '@/layouts/main';
import {fetcher} from '@/lib/fetcher';
import {PuzzleSetInterface} from '@/models/puzzle-set-model';
import {PuzzleInterface} from '@/models/puzzle-model';
import useClock from '@/hooks/use-clock';
import Donnuts from '@/components/donnuts';
import ChartMultipleLine from '@/components/chartMultipleLine';
import ChartInfinitLine from '@/components/chartInfinitLine';
import {Button} from '@/components/button';
import {provSet} from '@/components/provisoire';

const getCyclesColor = (set: PuzzleSetInterface) =>
	set.cycles < 1
		? 'bg-gray-400'
		: set.cycles < 3
		? 'bg-red-700'
		: set.cycles < 5
		? 'bg-yellow-500 text-black'
		: 'bg-green-900';

const cycles = (set: PuzzleSetInterface) => (
	<p>
		Completed:
		<span className={`rounded px-2 py-4 text-white ${getCyclesColor(set)}`}>
			{set.cycles} time{set.cycles > 1 && 's'}
		</span>
	</p>
);

const getDifficultyColor = (set: PuzzleSetInterface) =>
	set.level === 'hard' || set.level === 'harder' || set.level === 'hardest'
		? 'bg-red-700'
		: set.level === 'intermediate' || set.level === 'normal'
		? 'bg-yellow-500 text-black'
		: 'bg-green-900';

const getRapidity = (set: PuzzleSetInterface) => {
	const bestTime = 5;
	const wortTime = 50;
	const scale = wortTime - bestTime;
	const step = 100 / scale;
	const length = set.puzzles ? set.puzzles.filter(p => p.played).length : 0;
	const averageTime = set.currentTime / length;
	console.log(averageTime);
	const rapidity = 100 - (averageTime - bestTime) * step;
	console.log(rapidity);
	return rapidity < 0 ? 0 : rapidity;
};

const armonizedData = (array: number[]) => {
	const numberOfLine = 50;

	if (array.length < numberOfLine) return array;

	const length = array.length;
	const iterator = numberOfLine;
	const packBy = Math.round(length / iterator);

	const newArray = [];
	for (let i = 0; i < iterator; i++) {
		const _oldArray = [...array];

		const _array = _oldArray.splice(i * packBy, packBy);

		const sum = _array.reduce((a, b) => a + b, 0);

		newArray.push(sum / _array.length);
	}

	return newArray;
};

const getArrayOfTimeByPuzzle = (set: PuzzleSetInterface) => {
	const arrayFiltered = set.puzzles.filter(puzzle => puzzle.played);
	const arrayOfData = arrayFiltered.map(puzzle => {
		const length = puzzle.timeTaken.length;
		// TODO: this function work for old set structure, replace puzzle.timeTaken by puzzle.timeTaken[length] to get the last element of the aray of timeTaken
		return puzzle.timeTaken[length - 1];
	});

	return armonizedData(arrayOfData);
};

const getArrayOfMistakeByPuzzle = (set: PuzzleSetInterface) => {
	const arrayFiltered = set.puzzles.filter(puzzle => puzzle.played);

	const arrayOfData = arrayFiltered.map(puzzle => {
		const length = puzzle.mistakes.length;

		// TODO: this function work for old set structure, replace puzzle.mistakes by puzzle.mistakes[length] to get the last element of the aray of mistakes
		return puzzle.mistakes[length - 1];
	});

	return armonizedData(arrayOfData);
};

const getArrayActualTimePreviousTime = (set: PuzzleSetInterface) => {
	const timePlayed = set.cycles + 1;
	const array = set.puzzles
		.filter(puzzle => puzzle.played)
		.map(puzzle => puzzle.timeTaken[puzzle.timeTaken.length - 1]);
};

const difficulty = (set: PuzzleSetInterface) => (
	<p>
		Difficulty:
		<span className={`rounded px-2 py-4 text-white ${getDifficultyColor(set)}`}>
			{set.level}
		</span>
	</p>
);

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(publishableKey);

const item = {name: 'test', price: 100, description: 'test', quantity: 43};

const createCheckOutSession = async () => {
	const stripe = await stripePromise;
	const checkoutSession = await axios.post('/api/checkout-sessions', {
		item,
	});
	const result = await stripe.redirectToCheckout({
		sessionId: checkoutSession.data.id,
	});
	if (result.error) {
		alert(result.error.message);
	}
};

const TotalTime = (set: PuzzleSetInterface) => {
	const totalTime = set.times.reduce((prev, current) => prev + current, 0);
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

const getAtonAp = (set: PuzzleSetInterface) => {
	let arrayOfPreviousTime = [];
	for (let i = 0; i < set.times.length; i++) {
		set.puzzles.map(puzzle => {
			arrayOfPreviousTime.push(puzzle.timeTaken[i]);
		});
	}
	const averagePreviousTime =
		arrayOfPreviousTime.reduce((prev, current) => prev + current) /
		arrayOfPreviousTime.length;
	const puzzlePlayedInLastTry = set.puzzles.filter(
		puzzle => puzzle.timeTaken.length >= set.times.length,
	);
	const arrayOfActualTime = puzzlePlayedInLastTry.map(
		puzzle => puzzle.timeTaken[puzzle.timeTaken.length - 1],
	);
	const averageActualTime =
		arrayOfActualTime.reduce((prev, current) => prev + current) /
		arrayOfActualTime.length;

	return `${Math.round((1 - averageActualTime / averagePreviousTime) * 100)} %`;
};

const getAgonAg = (set: PuzzleSetInterface) => {
	let arrayOfPreviousMistakes = [];
	for (let i = 0; i < set.times.length; i++) {
		set.puzzles.map(puzzle => {
			arrayOfPreviousMistakes.push(puzzle.mistakes[i]);
		});
	}
	const averagePreviousMistakes =
		arrayOfPreviousMistakes.reduce((prev, current) => prev + current) /
		arrayOfPreviousMistakes.length;
	const puzzlePlayedInLastTry = set.puzzles.filter(
		puzzle => puzzle.mistakes.length >= set.times.length,
	);
	const arrayOfActualMistakes = puzzlePlayedInLastTry.map(
		puzzle => puzzle.mistakes[puzzle.mistakes.length - 1],
	);
	const averageActualTime =
		arrayOfActualMistakes.reduce((prev, current) => prev + current) /
		arrayOfActualMistakes.length;

	return `${Math.round(
		(1 - averageActualTime / averagePreviousMistakes) * 100,
	)} %`;
};

const getActualTime = (set: PuzzleSetInterface) => {
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

const getTotalAverageGrade = (set: PuzzleSetInterface) => {
	const arrayOfGrade = set.puzzles.map(puzzle => puzzle.grades).flat(Infinity);
	const sum = arrayOfGrade.reduce((prev, current) => prev + current, 0);
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
	console.log('set finished', set.cycles);

	const bestTime = set.times ? Math.max(...set.times) : 0;

	if (!set || !set.puzzles) return <></>;
	return (
		<div className='m-0 mt-8 flex min-h-screen w-screen flex-col px-12 '>
			<h1 className=' mt-8 mb-6 p-5  font-merriweather text-3xl font-bold text-white md:text-5xl'>
				{set.title}
			</h1>

			<div className='mt-4 w-full'>
				<h2 className='h2'>Puzzle set state</h2>
				<div className='mt-4 flex w-full'>
					<div className=' mx-3 flex min-h-full w-1/3 flex-col items-center rounded-xl border-4 border-white p-4  '>
						<h3 className='h3 text-center'>Time you complete this set</h3>
						<div className='flex h-full w-full items-center justify-center'>
							<p className='justify-self-center text-5xl font-bold text-white'>
								{set.cycles ? set.cycles : 0}
							</p>
						</div>
					</div>
					<div className=' mx-3 flex min-h-full w-1/3 flex-col items-center rounded-xl border-4 border-white p-4  '>
						<h3 className='h3 text-center'>Total average grade</h3>
						<div className='flex h-full w-full items-center justify-center'>
							<p className=' justify-self-center text-5xl font-bold text-white'>
								{getTotalAverageGrade(set)}
							</p>
						</div>
					</div>
					<div className=' mx-3 flex min-h-full w-1/3 flex-col items-center rounded-xl border-4 border-white p-4  '>
						<h3 className='h3 text-center'>Total time spent on this set</h3>
						<div className='flex h-full w-full items-center justify-center'>
							{TotalTime(set)}
						</div>
					</div>
				</div>
			</div>
			<div className='mt-4 w-full'>
				<h2 className='h2'>Global Progression</h2>
				<div className='mt-4 flex w-full'>
					<div className=' mx-3 flex min-h-full w-1/2 flex-col items-center rounded-xl border-4 border-white p-4  '>
						<h3 className='h3 text-center'>
							Actual time / Average previous time
						</h3>
						<div className='flex h-full w-full items-center justify-center'>
							<p className=' justify-self-center text-5xl font-bold text-white'>
								{getAtonAp(provSet)}
							</p>
						</div>
					</div>
					<div className=' mx-3 flex min-h-full w-1/2 flex-col items-center rounded-xl border-4 border-white p-4  '>
						<h3 className='h3 text-center'>
							Actual grade / Average previous grade
						</h3>
						<div className='flex h-full w-full items-center justify-center'>
							<p className='align-self-center text-5xl font-bold text-white'>
								{getAgonAg(provSet)}
							</p>
						</div>
					</div>
				</div>
			</div>
			<div className='mt-4 w-full'>
				<h2 className='h2'>Actual Progression</h2>
				<div className='mt-4 flex w-full flex-wrap justify-around'>
					<div className=' mx-3 flex  flex-col items-center rounded-xl border-4 border-white p-4  '>
						<h3 className='h3 text-center'>Progress</h3>
						<div className='flex h-full items-center justify-center'>
							<Donnuts
								played={set.puzzles && set.puzzles.filter(p => p.played).length}
								totalSet={set.length}
							/>
						</div>
					</div>
					<div className=' mx-3 flex  flex-col items-center rounded-xl border-4 border-white p-4  '>
						<h3 className='h3 text-center'>Actual time</h3>
						<div className='flex h-full w-full items-center justify-center'>
							{getActualTime(set)}
						</div>
					</div>
					<div className=' mx-3 flex  flex-col items-center rounded-xl border-4 border-white p-4  '>
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

ViewingPage.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
export default ViewingPage;

export const getServerSideProps = async ({params}) => {
	const {id} = params;
	const data = await fetcher.get(`/api/set/${id}`);
	if (!data) return {notFound: true};
	return {props: {currentSetProps: data.set}};
};
