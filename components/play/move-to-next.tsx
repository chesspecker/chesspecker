import {useAtom} from 'jotai';
import {Button} from '../button';
import {autoMoveAtom} from '@/lib/atoms';

type Props = {isComplete: boolean; changePuzzle: () => void};

const defaultClasses =
	'mx-auto md:mx-2 w-36 rounded-md bg-gray-800 text-white leading-8';
const disabledClasses = `block cursor-default self-center border border-none border-transparent bg-opacity-70 px-2.5 py-2 text-center font-merriweather text-sm md:text-lg font-bold shadow-sm ${defaultClasses}`;

const MoveToNext = ({isComplete, changePuzzle}: Props) => {
	const [hasAutoMove] = useAtom(autoMoveAtom);
	return (
		<div>
			{isComplete && !hasAutoMove && (
				<Button
					className={disabledClasses}
					onClick={() => {
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
