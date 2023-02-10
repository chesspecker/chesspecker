type Props = {title: string; progress: number};
const ProgressBar = ({title, progress}: Props) => (
	<div className='flex w-full flex-col items-center'>
		<div className='mb-1 flex flex-col items-center justify-center'>
			<span className='text-base font-medium text-slate-800 dark:text-white'>
				{title}
			</span>
			<span className='text-sm font-medium text-slate-800 dark:text-white'>
				{progress}%
			</span>
		</div>
		<div className='h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700'>
			<div
				className='h-2.5 rounded-full bg-sky-600'
				style={{width: `${progress}%`}}
			/>
		</div>
	</div>
);

export default ProgressBar;
