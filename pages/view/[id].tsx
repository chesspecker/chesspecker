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
	console.log('set', set.puzzles);
	const arrayFiltered = set.puzzles.filter(puzzle => puzzle.played === true);
	console.log('filtered', arrayFiltered);
	const arrayOfData = arrayFiltered.map(puzzle => {
		const length = puzzle.timeTaken.length;
		//TODO: this function work for old set structure, replace puzzle.mistakes by puzzle.mistakes[length] to get the last element of the aray of mistakes
		return puzzle.mistakes;
	});
	console.log(arrayOfData);
	return arrayOfData;
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
		<div className='m-0 mt-8 flex min-h-screen flex-col '>
			<h1 className=' mt-8 mb-6 p-5  font-merriweather text-3xl font-bold text-white md:text-5xl'>
				{provSet.title}
			</h1>
			<Button onClick={createCheckOutSession}>Bonsoir</Button>
			<div className='flex w-full'>
				<Donnuts
					played={provSet.totalPuzzlesPlayed}
					totalSet={provSet.length}
				/>
				<div className='min-h-full w-1/3 '>
					<ChartOneLine rapidity={getRapidity(set)} />
				</div>
				<div className='flex flex-col  text-white'>
					<div className=' text-xl font-light'>
						Time played: {useClock(provSet.currentTime)}
					</div>
					<div className=' text-xl font-light'>
						Accuracy: {Math.round(provSet.accuracy * 100)} %
					</div>
					<div className='text-xl'>
						<div>Best time: {provSet.bestTime}</div>
						{cycles(set)}
						{difficulty(set)}
					</div>
					<div className='text-xl font-light'>
						totalPuzzlesPlayed: {provSet.totalPuzzlesPlayed}
					</div>
					<div className='text-xl font-light'>
						totalMistakes: {provSet.totalMistakes}
					</div>
					<div className='text-xl font-light'>length: {provSet.length}</div>
					<div className='text-xl font-light'>rating: {provSet.rating}</div>
				</div>
			</div>
			<ChartMultipleLine
				array1={getArrayOfTimeByPuzzle(set)}
				array2={getArrayOfMistakeByPuzzle(set)}
				name1={'time evolution'}
				name2={'mistake evolution'}
			/>
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
