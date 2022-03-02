import {useAtom} from 'jotai';
import {Button} from '../button';
import {autoMoveAtom} from '@/lib/atoms';

type Props = {isComplete: boolean; changePuzzle: () => void};

const MoveToNext = ({isComplete, changePuzzle}: Props) => {
	const [hasAutoMove] = useAtom(autoMoveAtom);
	return (
		<div>
			{isComplete && !hasAutoMove && (
				<Button
					className='block w-36 cursor-pointer self-center rounded-md border-none bg-gray-500 py-2 text-center font-merriweather text-lg font-bold leading-8 text-white'
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
