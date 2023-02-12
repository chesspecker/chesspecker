import {useAtom} from 'jotai';
import {configµ} from '@/atoms/chessground';
import type {Board} from '@/types/chessground';

export const BoardSettings = () => {
	const [board, setBoard] = useAtom(configµ.board);
	return (
		<>
			<div>Board</div>
			<select
				name='board'
				className='w-full rounded border border-gray-300 bg-white px-2 py-1.5 text-gray-800'
				defaultValue={board}
				onChange={event => {
					setBoard(() => event.target.value as Board);
				}}
			>
				<option value='green'>Green</option>
				<option value='brown'>Brown</option>
				<option value='ruby'>Ruby</option>
				<option value='purple'>Purple</option>
				<option value='teal'>Teal</option>
			</select>
		</>
	);
};
