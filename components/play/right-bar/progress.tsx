import {useAtom} from 'jotai';
import {playµ} from '@/lib/atoms';

const Progress = () => {
	const [totalPuzzles] = useAtom(playµ.totalPuzzles);
	const [completedPuzzles] = useAtom(playµ.completed);
	const percentage = ((completedPuzzles / totalPuzzles) * 100).toFixed(2);

	return (
		<div className='text-md mx-auto block h-fit w-36 cursor-default rounded-md border border-transparent bg-slate-900 dark:bg-white bg-opacity-90 py-2 px-2.5 text-center font-sans font-bold leading-8 text-white dark:text-sky-700 shadow-sm backdrop-blur-lg backdrop-filter md:mx-2'>
			<div>{percentage}%</div>
			<div>
				{completedPuzzles} / {totalPuzzles}
			</div>
		</div>
	);
};

export default Progress;
