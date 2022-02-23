import {useState} from 'react';
import type {MouseEvent} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {useRouter} from 'next/router';
import {Button} from './button';
import plus from '@/public/images/plus.svg';
import useSets from '@/hooks/use-sets';
import type {PuzzleSetInterface} from '@/models/puzzle-set-model';
import useEffectAsync from '@/hooks/use-effect-async';
import useClock from '@/hooks/use-clock';

type PropsComponent = {
	set: PuzzleSetInterface;
};

const PuzzleSetComponent = ({set}: PropsComponent) => {
	const router = useRouter();
	const onPlayClick = (event: MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();
		router.push(`/play/${set._id}`);
	};

	const onViewClick = (event: MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();
		router.push(`/view/${set._id}`);
	};

	return (
		<div className='m-2 flex h-64 w-64 flex-col overflow-hidden rounded-xl border-2 border-white p-4 text-white'>
			<h3 className='mx-4 mt-0 mb-4 text-4xl font-medium'>
				{set.title.length > 12 ? set.title.slice(0, 11) + ' ...' : set.title}
			</h3>
			<div className='m-2'>
				<Button onClick={onPlayClick}>PLAY ⚔️</Button>
			</div>
			<div className='m-2'>
				<Button onClick={onViewClick}>VIEW</Button>
			</div>
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
					<div className='absolute top-0 left-0 flex h-full w-full cursor-pointer flex-col items-center justify-center bg-gray-300 text-3xl font-medium text-sky-800'>
						<Image src={plus} />
						<p>Create a set</p>
					</div>
				</Link>
			</div>
		</div>
	);
};

export default PuzzleSetMap;
