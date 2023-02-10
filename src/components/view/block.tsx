import {ArrowSmDownIcon, ArrowSmUpIcon} from '@heroicons/react/solid';
import type {ViewData} from '@/lib/view';
import {classNames} from '@/lib/utils';

const Block = ({
	title,
	stat,
	type,
	change,
	Icon,
	hasChange,
}: ViewData): JSX.Element => {
	const Element = ({changeElement}: {changeElement?: any}) => (
		<div className='m-3 flex min-h-[10rem] min-w-[20rem] flex-auto flex-col items-center overflow-hidden rounded-lg bg-sky-700 px-4 py-5 shadow dark:bg-white sm:px-6 sm:pt-6'>
			<h3 className='text-center text-sm font-medium text-white dark:text-gray-500'>
				{title}
			</h3>

			<div className='flex h-full w-full items-center justify-center'>
				{Icon && (
					<div className='mr-2 rounded-md bg-white p-3 dark:bg-sky-700'>
						<Icon
							className='h-6 w-6 text-sky-700 dark:text-white'
							aria-hidden='true'
						/>
					</div>
				)}
				<p className='justify-self-center text-2xl font-semibold text-white dark:text-gray-900'>
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
					className='h-5 w-5 shrink-0 self-center text-green-400 dark:text-green-500'
					aria-hidden='true'
				/>
			) : (
				<ArrowSmDownIcon
					className='h-5 w-5 shrink-0 self-center text-red-400 dark:text-red-500'
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

export default Block;
