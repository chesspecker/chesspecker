import {useState} from 'react';
import type {MouseEvent} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {useRouter} from 'next/router';
import {Button} from '@/components/button';
import plus from '@/public/images/plus.svg';
import spinner from '@/public/images/spinner.svg';
import type {PuzzleSetInterface} from '@/types/models';
import useEffectAsync from '@/hooks/use-effect-async';
import {DataMany} from '@/pages/api/set';
import RemoveModal from '@/components/dashboard/remove-modal';

type PropsComponent = {
	set: PuzzleSetInterface;
};

const PuzzleSetComponent = ({set}: PropsComponent) => {
	const router = useRouter();
	const removeSet = async () =>
		fetch(`/api/set/${set._id.toString()}`, {method: 'DELETE'})
			.then(() => {
				router.reload();
			})
			.catch(error => {
				console.error(error);
			});

	const onPlayClick = async (event: MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();
		await router.push(`/play/${set._id.toString()}`);
	};

	const onViewClick = async (event: MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();
		await router.push(`/view/${set._id.toString()}`);
	};

	return (
		<div className='m-2 flex h-64 w-64 flex-col overflow-hidden rounded-xl border-2 border-white p-4 text-white'>
			<div className='flex w-full justify-end'>
				<RemoveModal onClick={removeSet} />
			</div>
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
	const [isLoading, setIsLoading] = useState(true);

	useEffectAsync(async () => {
		const data = await fetch('/api/set').then(
			async response => response.json() as Promise<DataMany>,
		);
		if (!data?.success) return;
		setSets(data.sets);
		setIsLoading(false);
	}, []);

	return (
		<div className='flex flex-wrap items-center justify-center'>
			{isLoading ? (
				<div className='relative m-4 flex h-64 w-64 flex-col overflow-hidden rounded-xl p-4 text-white'>
					<div className='absolute top-0 left-0 flex h-full w-full cursor-pointer flex-col items-center justify-center border border-transparent bg-white bg-opacity-60 text-3xl font-medium text-sky-800 shadow-md backdrop-blur-xl backdrop-filter'>
						{/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
						<Image src={spinner} className='animate-spin' />
						<p className='mt-4'>Loading...</p>
					</div>
				</div>
			) : null}
			{sets.map(set => (
				<PuzzleSetComponent key={set._id.toString()} set={set} />
			))}
			<div className='relative m-4 flex h-64 w-64 flex-col overflow-hidden rounded-xl p-4 text-white'>
				<Link href='/create'>
					<a>
						<div className='absolute top-0 left-0 flex h-full w-full cursor-pointer flex-col items-center justify-center border border-transparent bg-white bg-opacity-60 text-3xl font-medium text-sky-800 shadow-md backdrop-blur-xl backdrop-filter'>
							{/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
							<Image src={plus} className='' />
							<p className='mt-4'>Create a set</p>
						</div>
					</a>
				</Link>
			</div>
		</div>
	);
};

export default PuzzleSetMap;
