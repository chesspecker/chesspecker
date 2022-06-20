/* eslint-disable unicorn/no-array-reduce */
/* eslint-disable unicorn/no-array-callback-reference */
import {GetServerSideProps} from 'next';
import {ReactElement, useCallback, useState} from 'react';
import {ArrowSmDownIcon, ArrowSmUpIcon} from '@heroicons/react/solid';
import {useRouter} from 'next/router';
import Link from 'next/link';
import {NextSeo} from 'next-seo';
import dynamic from 'next/dynamic';
import type {SetData} from '@/api/set/[id]';
import Layout from '@/layouts/main';
import {
	getCurrentRunStats,
	getOverviewStats,
	getProgressStats,
	ViewData,
} from '@/lib/view';
import useModal from '@/hooks/use-modal';
import {
	activateSpacedRepetion,
	turnOffSpacedRepetition,
} from '@/lib/spaced-repetition';
import {PuzzleItem} from '@/models/puzzle-item';
import {PuzzleSet} from '@/models/puzzle-set';
import {classNames, fetcher, reducer} from '@/lib/utils';

const ModalSpacedOn = dynamic(
	async () => import('@/components/play/modal-spaced-on'),
);
const ModalSpacedOff = dynamic(
	async () => import('@/components/play/modal-spaced-off'),
);
const EditModal = dynamic(async () => import('@/components/view/edit-modal'));

const Block = ({
	title,
	stat,
	type,
	change,
	Icon,
	hasChange,
}: ViewData): JSX.Element => {
	const Element = ({changeElement}: {changeElement?: any}) => (
		<div className='m-3 flex min-h-[10rem] min-w-[20rem] flex-auto flex-col items-center px-4 py-5 overflow-hidden bg-sky-700 dark:bg-white rounded-lg shadow sm:pt-6 sm:px-6'>
			<h3 className='text-sm font-medium text-center text-white dark:text-gray-500'>
				{title}
			</h3>

			<div className='flex items-center justify-center w-full h-full'>
				{Icon && (
					<div className='p-3 mr-2 bg-white rounded-md dark:bg-sky-700'>
						<Icon
							className='w-6 h-6 text-sky-700 dark:text-white'
							aria-hidden='true'
						/>
					</div>
				)}
				<p className='text-2xl font-semibold text-white dark:text-gray-900 justify-self-center'>
					{stat}
				</p>
				{changeElement}
			</div>
		</div>
	);

	if (!hasChange) return <Element />;

	const changeElement = (
		<p
			className={classNames(
				type === 'up'
					? 'text-green-400 dark:text-green-600'
					: 'text-red-400 dark:text-red-500',
				'ml-2 flex items-baseline text-sm font-semibold',
			)}
		>
			{type === 'up' ? (
				<ArrowSmUpIcon
					className='self-center flex-shrink-0 w-5 h-5 text-green-400 dark:text-green-500'
					aria-hidden='true'
				/>
			) : (
				<ArrowSmDownIcon
					className='self-center flex-shrink-0 w-5 h-5 text-red-400 dark:text-red-500'
					aria-hidden='true'
				/>
			)}
			<span className='sr-only'>
				{type === 'up' ? 'Increased' : 'Decreased'} by
			</span>
			{change}
		</p>
	);
	return <Element changeElement={changeElement} />;
};

const getClasses = (grade: number) => {
	const base = 'h-5 w-10 cursor-pointer rounded-sm mb-1';
	if (grade < 3) return `${base} bg-red-500`;
	if (grade < 5) return `${base} bg-orange-500`;
	if (grade < 7) return `${base} bg-green-500`;
};

const getAverage = (array: number[]): number =>
	array.reduce(reducer, 0) / array.length;

const PuzzleComponent = (puzzle: PuzzleItem): JSX.Element => (
	<Link key={puzzle.PuzzleId} href={`/play/puzzle/${puzzle.PuzzleId}`}>
		<a className={getClasses(getAverage(puzzle.grades))} />
	</Link>
);

type Props = {set: PuzzleSet};
const ViewingPage = ({set}: Props) => {
	const [setTitle, setSetTitle] = useState<string>(set.title);
	const router = useRouter();
	const {isOpen, hide, toggle} = useModal(false);

	const onChangeName = useCallback(async () => {
		const body = {$set: {title: setTitle}};
		await fetch(`/api/set/${set._id.toString()}`, {
			method: 'PUT',
			body: JSON.stringify(body),
		}).catch(console.error);
		router.reload();
	}, [setTitle, router, set]);

	if (!set || !set.puzzles) return null;
	return (
		<>
			<NextSeo title='📊 View' />
			<div className='flex flex-col w-screen min-h-screen px-2 pt-32 pb-24 m-0 sm:px-12'>
				<div>
					<div className='flex items-center '>
						<h1 className='py-5 mt-8 mr-4 font-sans text-3xl font-bold md:text-5xl'>
							{set.title}
						</h1>
						<EditModal
							setTitle={setTitle}
							setSetTitle={setSetTitle}
							onValidate={onChangeName}
						/>
					</div>
					{set.spacedRepetition ? (
						<ModalSpacedOff
							isOpen={isOpen}
							hide={hide}
							onClick={async () => {
								await turnOffSpacedRepetition(set);
								hide();
								router.reload();
							}}
						/>
					) : (
						<ModalSpacedOn
							isOpen={isOpen}
							hide={hide}
							onClick={async () => {
								await activateSpacedRepetion(set);
								hide();
								router.reload();
							}}
						/>
					)}

					<button
						className='p-4 mb-6 text-gray-100 rounded-lg cursor-pointer no-wrap w-fit disabled:cursor-not-allowed disabled:bg-slate-400 disabled:dark:bg-slate-500 disabled:text-slate-200 dark:disabled:text-slate-200 hover:disabled:dark:text-slate-200 dark:text-sky-600 hover:bg-sky-600 hover:dark:text-sky-800 disabled:hover:dark:text-slate-200 bg-sky-700 dark:bg-gray-100 dark:hover:bg-gray-200'
						disabled={set.cycles < 1 && !set.spacedRepetition}
						type='button'
						onClick={toggle}
					>
						<p>
							Spaced-repetition:
							<span
								className={`${
									set.cycles < 1 && !set.spacedRepetition
										? 'bg-slate-600'
										: set.spacedRepetition
										? 'bg-green-500'
										: 'bg-red-500'
								} text-white py-2 px-4 rounded-full ml-3`}
							>
								{set.spacedRepetition ? 'on' : 'off'}
							</span>
						</p>
					</button>
				</div>

				{set?.cycles >= 1 && (
					<div className='w-full mt-4'>
						<h2 className='h2'>Set overview</h2>
						<div className='flex flex-wrap w-full mt-4'>
							{getOverviewStats(set).map(stat => (
								<Block key={stat.title} {...stat} />
							))}
						</div>
					</div>
				)}

				{set?.cycles < 2 && set?.currentTime === 0 && (
					<div className='w-full'>
						<p className='p-5 mt-8 mb-6 font-sans text-xl font-bold md:text-3xl'>
							No data yet, start playing!
						</p>
					</div>
				)}

				{set?.cycles >= 2 && (
					<div className='w-full mt-4'>
						<h2 className='h2'>Global progress</h2>
						<div className='flex flex-wrap w-full mt-4'>
							{getProgressStats(set).map(stat => (
								<Block key={stat.title} {...stat} />
							))}
						</div>
					</div>
				)}

				{set?.currentTime > 0 && (
					<div className='flex-wrap w-full mt-4'>
						<h2 className='h2'>Current run</h2>
						<div className='flex flex-wrap justify-around w-full mt-4'>
							{getCurrentRunStats(set).map(stat => (
								<Block key={stat.title} {...stat} />
							))}
						</div>
					</div>
				)}

				{set?.currentTime > 0 && (
					<div className='flex-wrap w-full mt-4'>
						<h2 className='mb-4 h2'>All puzzles</h2>
						<div className='flex flex-row flex-wrap w-full gap-2 mb-4'>
							{set.puzzles.map(puzzle => (
								<PuzzleComponent key={puzzle.PuzzleId} {...puzzle} />
							))}
						</div>
					</div>
				)}
			</div>
		</>
	);
};

ViewingPage.getLayout = (page: ReactElement): JSX.Element => (
	<Layout>{page}</Layout>
);
export default ViewingPage;

export const getServerSideProps: GetServerSideProps = async ({req, params}) => {
	const id: string = params?.id as string;
	if (!id) return {notFound: true};
	const protocol = (req.headers['x-forwarded-proto'] as string) || 'http';
	const baseUrl = req ? `${protocol}://${req.headers.host!}` : '';
	const response = await fetcher<SetData>(`${baseUrl}/api/set/${id}`);
	if (!response?.success) return {notFound: true};
	return {props: {set: response.data}};
};
