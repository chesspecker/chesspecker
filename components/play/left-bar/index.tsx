import {ArrowSmDownIcon, ArrowSmUpIcon} from '@heroicons/react/solid';
import {parseGrade} from '@/lib/view';

const classNames = (...classes: string[]) => classes.filter(Boolean).join(' ');

export type Stat = {
	gradeCurrent: number;
	timeCurrent: number;
	gradeLast?: number;
	timeLast?: number;
};

type Props = {
	stat: Stat;
};

const LeftBar = ({stat}: Props) => {
	if (!stat)
		return <div className='hidden w-36 px-2.5 md:mx-2 md:invisible md:block' />;
	const {gradeCurrent, timeCurrent, gradeLast, timeLast} = stat;
	const gradeDiff = gradeLast ? gradeCurrent - gradeLast : 0;
	const timeDiff = timeLast ? timeCurrent - timeLast : 0;

	let letterClassname = 'text-red-500';
	if (parseGrade[gradeCurrent] === 'A') letterClassname = 'text-green-500';
	if (parseGrade[gradeCurrent] === 'B' || parseGrade[gradeCurrent] === 'C')
		letterClassname = 'text-orange-500';

	return (
		<div className='text-md mx-auto hidden md:block h-fit w-36 cursor-default rounded-md border border-transparent bg-slate-800 dark:bg-white py-2 px-2.5 text-center font-sans font-bold leading-8 text-white dark:text-sky-800 shadow-sm backdrop-blur-lg backdrop-filter md:mx-2'>
			<span>Last puzzle: </span>
			<span>
				grade:{' '}
				<span className={letterClassname}> {parseGrade[gradeCurrent]}</span>
			</span>

			{gradeDiff !== 0 && (
				<p
					className={classNames(
						gradeDiff > 0
							? 'text-green-400 dark:text-green-600'
							: 'text-red-400 dark:text-red-500',
						'ml-2 flex items-baseline justify-center text-sm font-semibold',
					)}
				>
					{gradeDiff > 0 ? (
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
						{gradeDiff > 0 ? 'Increased' : 'Decreased'} by
					</span>
					{gradeDiff}
				</p>
			)}

			<br />
			<span>time: {timeCurrent}s</span>

			{timeDiff !== 0 && (
				<p
					className={classNames(
						timeDiff < 0
							? 'text-green-400 dark:text-green-600'
							: 'text-red-400 dark:text-red-500',
						'ml-2 flex items-baseline justify-center text-sm font-semibold',
					)}
				>
					{timeDiff < 0 ? (
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
						{timeDiff < 0 ? 'Increased' : 'Decreased'} by
					</span>
					{timeDiff}s
				</p>
			)}
		</div>
	);
};

export default LeftBar;
