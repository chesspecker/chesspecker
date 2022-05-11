import {useAtom} from 'jotai';
import {playµ} from '@/lib/atoms';

type Props = {hasSpacedRepetition: boolean};
const Progress = ({hasSpacedRepetition}: Props) => {
	const [totalPuzzles] = useAtom(playµ.totalPuzzles);
	const [completedPuzzles] = useAtom(playµ.completed);

	const total_ = hasSpacedRepetition ? 20 : totalPuzzles;
	const percentage = ((completedPuzzles / total_) * 100).toFixed(2);

	return (
		<div className='text-md mx-auto block h-fit w-36 cursor-default rounded-md border border-transparent bg-slate-800 dark:bg-white  py-2 px-2.5 text-center font-sans font-bold leading-8 text-white dark:text-sky-800 shadow-sm backdrop-blur-lg backdrop-filter md:mx-2'>
			<div>{percentage}%</div>
			<div>
				{completedPuzzles} / {total_}
			</div>
		</div>
	);
};

export default Progress;
