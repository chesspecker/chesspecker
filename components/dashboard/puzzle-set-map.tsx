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
import audio from '@/lib/sound';

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
		await audio('VICTORY', true, 0);
		await router.push(`/play/${set._id.toString()}`);
	};

	const onViewClick = async (event: MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();
		await router.push(`/view/${set._id.toString()}`);
	};

	return (
		<div className='flex flex-col w-64 h-64 p-4 m-2 overflow-hidden border-2 border-sky-800 dark:border-white rounded-xl'>
			<div className='flex justify-end w-full'>
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

type EmptyComponentProps = {
	image: JSX.Element;
	text: JSX.Element;
};
const EmptyPuzzleSetComponent = ({image, text}: EmptyComponentProps) => (
	<div className='relative flex flex-col w-64 h-64 p-4 m-4 overflow-hidden rounded-xl'>
		<div className='absolute top-0 left-0 flex flex-col items-center justify-center w-full h-full text-3xl font-medium dark:bg-white bg-transparent  border-2 border-sky-800 dark:border-transparent shadow-md cursor-pointer bg-opacity-60 text-sky-800 backdrop-blur-xl backdrop-filter rounded-xl'>
			{image}
			{text}
		</div>
	</div>
);

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
				<EmptyPuzzleSetComponent
					/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
					image={<Image src={spinner} className='animate-spin' />}
					text={<p className='mt-4 animate-pulse'>Loading...</p>}
				/>
			) : null}
			{sets.map(set => (
				<PuzzleSetComponent key={set._id.toString()} set={set} />
			))}
			<Link href='/create'>
				<a>
					<EmptyPuzzleSetComponent
						/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
						image={<Image src={plus} />}
						text={<p className='mt-4'>Create a set</p>}
					/>
				</a>
			</Link>
		</div>
	);
};

export default PuzzleSetMap;
