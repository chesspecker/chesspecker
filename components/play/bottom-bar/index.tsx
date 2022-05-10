import Settings from '../settings';
import Flip from './flip';
import History from './history';
import type {PreviousPuzzle} from './history';

type Props = {puzzles: PreviousPuzzle[]};
const BottomBar = ({puzzles}: Props) => {
	return (
		<div className='flex flex-row-reverse items-start gap-2 py-1.5 text-gray-400'>
			<div className='flex items-start justify-start   h-full'>
				<Settings />
				<Flip />
			</div>
			<History puzzles={puzzles} />
		</div>
	);
};

export default BottomBar;
