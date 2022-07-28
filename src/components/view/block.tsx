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

export default Block;
