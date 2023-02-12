import {useAtom} from 'jotai';
import {Button} from '../../button';
import {configµ} from '@/atoms/chessground';
import {playµ} from '@/atoms/play';

type Props = {
	changePuzzle: () => void;
	launchTimer: () => void;
};

const defaultClasses =
	'mx-auto md:mx-2 w-36 rounded-md bg-slate-800 dark:bg-gray-800  leading-8';
const disabledClasses = `block cursor-default self-center border border-none border-transparent dark:text-white dark:bg-opacity-70 px-2.5 py-2 text-center font-sans text-sm md:text-lg font-bold shadow-sm ${defaultClasses}`;

const MoveToNext = ({changePuzzle, launchTimer}: Props) => {
	const [hasAutoMove] = useAtom(configµ.autoMove);
	const [isComplete] = useAtom(playµ.isComplete);
	return (
		<div>
			{isComplete && !hasAutoMove && (
				<Button
					className={disabledClasses}
					onClick={() => {
						launchTimer();
						changePuzzle();
					}}
				>
					MOVE TO NEXT
				</Button>
			)}
		</div>
	);
};

export default MoveToNext;
