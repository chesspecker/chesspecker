import {useState} from 'react';
import type {MouseEvent} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {Button} from './button';
import plus from '@/public/images/plus.svg';
import useSets from '@/hooks/use-sets';
import type {PuzzleSetInterface} from '@/models/puzzle-set-model';
import useEffectAsync from '@/hooks/use-effect-async';
import useClock from '@/hooks/use-clock';

type PropsComponent = {
	set: PuzzleSetInterface;
};

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

const PuzzleSetComponent = ({set}: PropsComponent) => {
	const onPlayClick = (event: MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();
	};

	const onViewClick = (event: MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();
	};

	return (
		<div className='m-4 flex h-64 w-64 flex-col overflow-hidden rounded-xl border-2 border-white p-4 text-white'>
			<h3 className='m-4 mt-0 text-5xl font-medium'>
				{set.title.length > 12 ? set.title.slice(0, 11) + ' ...' : set.title}
			</h3>
			<div className='relative flex h-full justify-around'>
				<div className='mt-4 text-4xl font-light'>
					⏲: {useClock(set.currentTime)}
				</div>
				<div className='mt-4 text-4xl font-light'>
					🎯: {Math.round(set.accuracy * 100)} %
				</div>
				<div className='mb-12 text-2xl'>
					<div>Best time: {set.bestTime}</div>
					{cycles(set)}
					{difficulty(set)}
				</div>
			</div>
			<Button onClick={onPlayClick}>PLAY 🗡</Button>
			<Button onClick={onViewClick}>VIEW</Button>
		</div>
	);
};

const PuzzleSetMap = () => {
	const [sets, setSets] = useState<PuzzleSetInterface[]>([]);
	useEffectAsync(async () => {
		const response = await fetch('/api/sets');
		const data = await response.json();
		setSets(data);
	}, []);

	return (
		<div className='flex flex-wrap items-center justify-center'>
			{sets.map(set => (
				<PuzzleSetComponent key={set._id} set={set} />
			))}
			<div className='relative m-4 flex h-64 w-64 flex-col overflow-hidden rounded-xl p-4 text-white'>
				<Link href='./create'>
					<div className='absolute top-0 left-0 flex h-full w-full cursor-pointer flex-col items-center justify-center bg-slate-300 text-3xl font-medium text-sky-800'>
						<Image src={plus} />
						<p>Create a set</p>
					</div>
				</Link>
			</div>
		</div>
	);
};

export default PuzzleSetMap;
