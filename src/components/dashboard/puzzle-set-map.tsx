import type {MouseEvent} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {useRouter} from 'next/router';
import {useSound} from 'use-sound';
import {Button} from '@/components/button';
import {PuzzleSet} from '@/models/puzzle-set';
import RemoveModal from '@/components/dashboard/remove-modal';
import plus from '@/public/images/plus.svg';
import GENERIC from '@/sounds/GenericNotify.mp3';

type PropsComponent = {
	set: PuzzleSet;
};

const PuzzleSetComponent = ({set}: PropsComponent) => {
	const [playGeneric] = useSound(GENERIC, {volume: 0.1});
	const router = useRouter();
	const removeSet = async () =>
		fetch(`/api/set/${set._id.toString()}`, {method: 'DELETE'})
			.then(() => {
				router.reload();
			})
			.catch(console.error);

	const onPlayClick = async (event: MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();
		playGeneric();
		await router.push(`/play/set/${set._id.toString()}`);
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
			<h3 className='mx-4 mt-0 mb-4 text-2xl font-medium'>
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
		<div className='absolute top-0 left-0 flex flex-col items-center justify-center w-full h-full text-3xl font-medium bg-transparent border-2 shadow-md cursor-pointer dark:bg-white border-sky-800 dark:border-transparent bg-opacity-60 text-sky-800 backdrop-blur-xl backdrop-filter rounded-xl'>
			{image}
			{text}
		</div>
	</div>
);

type Props = {
	puzzleSets: PuzzleSet[];
};

const PuzzleSetMap = ({puzzleSets}: Props) => {
	return (
		<div className='flex flex-wrap items-center justify-center'>
			{puzzleSets?.map(set => (
				<PuzzleSetComponent key={set._id.toString()} set={set} />
			))}
			<Link href='/create'>
				<a>
					<EmptyPuzzleSetComponent
						image={<Image src={plus as string} />}
						text={<p className='mt-4'>Create a set</p>}
					/>
				</a>
			</Link>
		</div>
	);
};

export default PuzzleSetMap;
