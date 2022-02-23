import {useState, useEffect, useCallback, ReactElement} from 'react';
import Router from 'next/router.js';
import Layout from '@/layouts/main';
import {fetcher} from '@/lib/fetcher';
import {PuzzleSetInterface} from '@/models/puzzle-set-model';
import {PuzzleInterface} from '@/models/puzzle-model';
import useClock from '@/hooks/use-clock';

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

const difficulty = (set: PuzzleSetInterface) => (
	<p>
		Difficulty:
		<span className={`rounded px-2 py-4 text-white ${getDifficultyColor(set)}`}>
			{set.level}
		</span>
	</p>
);

type Props = {currentSetProps: PuzzleSetInterface};
const ViewingPage = ({currentSetProps: set}: Props) => {
	return (
		<div className='m-0 flex h-screen flex-col items-center justify-center'>
			<h1 className='mx-auto mt-8 mb-6 p-5 text-center font-merriweather text-3xl font-bold text-white md:text-5xl'>
				{set.title}
			</h1>

			<div className='flex flex-col space-x-12 text-white'>
				<div className=' text-4xl font-light'>
					⏲: {useClock(set.currentTime)}
				</div>
				<div className=' text-4xl font-light'>
					🎯: {Math.round(set.accuracy * 100)} %
				</div>
				<div className='text-2xl'>
					<div>Best time: {set.bestTime}</div>
					{cycles(set)}
					{difficulty(set)}
				</div>

				<div className='text-4xl font-light'>
					totalPuzzlesPlayed: {set.totalPuzzlesPlayed}
				</div>
				<div className='text-4xl font-light'>
					totalMistakes: {set.totalMistakes}
				</div>
				<div className='text-4xl font-light'>length: {set.length}</div>
				<div className='text-4xl font-light'>rating: {set.rating}</div>
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
	return {props: {currentSetProps: data}};
};
