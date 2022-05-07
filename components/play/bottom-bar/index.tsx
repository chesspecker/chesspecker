import Settings from '../settings';
import Flip from './flip';
import History from './history';
import type {PreviousPuzzle} from './history';

type Props = {puzzles: PreviousPuzzle[]};
const BottomBar = ({puzzles}: Props) => {
	return (
		<div className='flex flex-row-reverse items-end gap-2 py-1.5 text-gray-400'>
			<div className='flex h-full items-start justify-start'>
				<Settings />
				<Flip />
			</div>
			<History puzzles={puzzles} />
		</div>
	);
};

export default BottomBar;
