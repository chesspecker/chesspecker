import type {MouseEvent} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {useRouter} from 'next/router';
import {useSound} from 'use-sound';
import {Button} from '@/components/button';
import type {PuzzleSet} from '@/models/puzzle-set';
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
		<div className='m-2 flex h-52 w-64 flex-col overflow-hidden rounded-xl border-4 border-sky-800 p-4 dark:border-white'>
			<div className='flex w-full flex-row justify-between'>
				{set.title && (
					<h3 className='mx-4 mt-0 mb-4 text-2xl font-medium'>
						{set.title.length > 10 ? set.title.slice(0, 9) + ' ...' : set.title}
					</h3>
				)}
				<RemoveModal onClick={removeSet} />
			</div>
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
	<div className='flex h-full w-full cursor-pointer flex-col items-center justify-center p-4 text-sky-800'>
		{image}
		{text}
	</div>
);

type Props = {
	puzzleSets: PuzzleSet[];
};

const PuzzleSetMap = ({puzzleSets}: Props) => (
	<div className='flex flex-wrap items-center justify-center'>
		{puzzleSets?.map(set => (
			<PuzzleSetComponent key={set._id.toString()} set={set} />
		))}
		<Link href='/create'>
			<a className='m-2 flex h-52 w-64 flex-col overflow-hidden rounded-xl border-4 border-sky-800 bg-white dark:border-white'>
				<EmptyPuzzleSetComponent
					image={<Image src={plus as string} />}
					text={<p className='mt-4'>Create a set</p>}
				/>
			</a>
		</Link>
	</div>
);

export default PuzzleSetMap;
