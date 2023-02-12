import type {MouseEvent} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {useRouter} from 'next/router';
import {useSound} from 'use-sound';
import type {PuzzleSet} from '@prisma/client';
import {Button} from '@/components/button';
import RemoveModal from '@/components/dashboard/remove-modal';
import GENERIC from '@/sounds/GenericNotify.mp3';

type PropsComponent = {
	set: PuzzleSet;
};

const PuzzleSetComponent = ({set}: PropsComponent) => {
	const [playGeneric] = useSound(GENERIC, {volume: 0.1});
	const router = useRouter();
	const removeSet = async () =>
		fetch(`/api/set/${set.id}`, {method: 'DELETE'})
			.then(() => {
				router.reload();
			})
			.catch(console.error);

	const onPlayClick = async (event: MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();
		playGeneric();
		await router.push(`/play/set/${set.id}`);
	};

	const onViewClick = async (event: MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();
		await router.push(`/view/${set.id}`);
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
		<div className='relative h-20 w-20'>{image}</div>
		{text}
	</div>
);

type Props = {
	puzzleSets: PuzzleSet[];
};

export const PuzzleSetMap = ({puzzleSets}: Props) => (
	<div className='flex flex-wrap items-center justify-center'>
		{puzzleSets?.map(set => (
			<PuzzleSetComponent key={set.id} set={set} />
		))}
		<Link href='/create'>
			<div className='m-2 flex h-52 w-64 flex-col overflow-hidden rounded-xl border-4 border-sky-800 bg-white dark:border-white'>
				<EmptyPuzzleSetComponent
					image={
						<Image
							fill
							src='/images/plus.svg'
							className='object-contain'
							alt='create'
						/>
					}
					text={<p className='mt-4'>Create a set</p>}
				/>
			</div>
		</Link>
	</div>
);
