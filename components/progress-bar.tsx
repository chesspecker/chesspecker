type Props = {title: string; progress: number};
const ProgressBar = ({title, progress}: Props) => {
	return (
		<>
			<div className='flex justify-between mb-1'>
				<span className='text-base font-medium text-sky-700 dark:text-white'>
					{title}
				</span>
				<span className='text-sm font-medium text-sky-700 dark:text-white'>
					{progress}%
				</span>
			</div>
			<div className='w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700'>
				<div
					className='bg-sky-600 h-2.5 rounded-full'
					style={{width: `${progress}%`}}
				/>
			</div>
		</>
	);
};

export default ProgressBar;
