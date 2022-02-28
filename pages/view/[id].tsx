import {useState, useEffect, useCallback, ReactElement} from 'react';
import Router from 'next/router.js';
import Layout from '@/layouts/main';
import {fetcher} from '@/lib/fetcher';
import {PuzzleSetInterface} from '@/models/puzzle-set-model';
import {PuzzleInterface} from '@/models/puzzle-model';
import useClock from '@/hooks/use-clock';
import Donnuts from '@/components/donnuts';
import ChartOneLine from '../../components/chartOneLine';
import ChartMultipleLine from '@/components/chartMultipleLine';
import {provPuzle} from '../../components/provisoire';
import ChartInfinitLine from '@/components/chartInfinitLine';
import {Button} from '@/components/button';
import {loadStripe} from '@stripe/stripe-js';
import axios from 'axios';

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
	const bestTime = 10;
	const wortTime = 40;
	const scale = wortTime - bestTime;
	const step = 100 / scale;
	const averageTime = set.currentTime / set.totalPuzzlesPlayed;
	const rapidity = 100 - (averageTime - bestTime) * step;
	return rapidity < 0 ? 0 : rapidity;
};

const getArrayOfTimeByPuzzle = (set: PuzzleSetInterface) => {
	const arrayFiltered = set.puzzles.filter(puzzle => puzzle.played === true);
	const arrayOfData = arrayFiltered.map(puzzle => {
		const length = puzzle.timeTaken.length;
		//TODO: this function work for old set structure, replace puzzle.timeTaken by puzzle.timeTaken[length] to get the last element of the aray of timeTaken
		return puzzle.timeTaken;
	});
	return arrayOfData;
};

const getArrayOfMistakeByPuzzle = (set: PuzzleSetInterface) => {
	const arrayFiltered = set.puzzles.filter(puzzle => puzzle.played === true);

	const arrayOfData = arrayFiltered.map(puzzle => {
		const length = puzzle.timeTaken.length;
		//TODO: this function work for old set structure, replace puzzle.mistakes by puzzle.mistakes[length] to get the last element of the aray of mistakes
		return puzzle.mistakes;
	});
	console.log(arrayOfData);
	return arrayOfData;
};

const getArrayActualTimePreviousTime = (set: PuzzleSetInterface) => {
	const timePlayed = set.cycles + 1;
	const array = set.puzzles
		.filter(puzzle => puzzle.played === true)
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
		item: item,
	});
	const result = await stripe.redirectToCheckout({
		sessionId: checkoutSession.data.id,
	});
	if (result.error) {
		alert(result.error.message);
	}
};

type Props = {currentSetProps: PuzzleSetInterface};
const ViewingPage = ({currentSetProps: set}: Props) => {
	const provSet = provPuzle;
	console.log(set);
	return (
		<div className='m-0 mt-8 flex min-h-screen w-screen flex-col px-12 '>
			<h1 className=' mt-8 mb-6 p-5  font-merriweather text-3xl font-bold text-white md:text-5xl'>
				{provSet.title}
			</h1>

			<div className='mt-4 w-full'>
				<h2 className='h2'>Puzzle set state</h2>
				<div className='mt-4 flex w-full'>
					<div className=' mx-3 flex min-h-full w-1/3 flex-col items-center rounded-xl border-4 border-white p-4  '>
						<h3 className='h3 text-center'>Time you complete this set</h3>
						<div className='flex h-full w-full items-center justify-center'>
							<p className='justify-self-center text-5xl font-bold text-white'>
								{set.cycles}
							</p>
						</div>
					</div>
					<div className=' mx-3 flex min-h-full w-1/3 flex-col items-center rounded-xl border-4 border-white p-4  '>
						<h3 className='h3 text-center'>Total average grade</h3>
						<div className='flex h-full w-full items-center justify-center'>
							<p className=' justify-self-center text-5xl font-bold text-white'>
								C
							</p>
						</div>
					</div>
					<div className=' mx-3 flex min-h-full w-1/3 flex-col items-center rounded-xl border-4 border-white p-4  '>
						<h3 className='h3 text-center'>Total time spent on this puzzle</h3>
						<div className='flex h-full w-full items-center justify-center'>
							<p className='align-self-center text-5xl font-bold text-white'>
								{set.bestTime === 0
									? useClock(set.currentTime)
									: useClock(set.bestTime)}
							</p>
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
								C
							</p>
						</div>
					</div>
					<div className=' mx-3 flex min-h-full w-1/2 flex-col items-center rounded-xl border-4 border-white p-4  '>
						<h3 className='h3 text-center'>
							Actual grade / Average previous grade
						</h3>
						<div className='flex h-full w-full items-center justify-center'>
							<p className='align-self-center text-5xl font-bold text-white'>
								{set.bestTime === 0
									? useClock(set.currentTime)
									: useClock(set.bestTime)}
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
								played={provSet.totalPuzzlesPlayed}
								totalSet={provSet.length}
							/>
						</div>
					</div>
					<div className=' mx-3 flex  flex-col items-center rounded-xl border-4 border-white p-4  '>
						<h3 className='h3 text-center'>Actual time</h3>
						<div className='flex h-full w-full items-center justify-center'>
							<p className='align-self-center text-5xl font-bold text-white'>
								{useClock(set.currentTime)}
							</p>
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
					name1={'time evolution'}
					name2={'mistake evolution'}
				/>
			</div>
			<ChartInfinitLine set={provSet} />
		</div>
	);
};

ViewingPage.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
export default ViewingPage;

export const getServerSideProps = async ({params}) => {
	const {id} = params;
	const data = await fetcher.get(`/api/set/${id}`);
	if (!data) return {notFound: true};
	return {props: {currentSetProps: data}};
};
