import {useAtom} from 'jotai';
import {configµ} from '@/atoms/chessground';
import type {Pieces} from '@/types/chessground';

export const PiecesSettings = () => {
	const [pieces, setPieces] = useAtom(configµ.pieces);
	return (
		<>
			<div>Pieces</div>
			<select
				name='board'
				className='w-full rounded border border-gray-300 bg-white px-2 py-1.5 text-gray-800'
				defaultValue={pieces}
				onChange={event => {
					setPieces(() => event.target.value as Pieces);
				}}
			>
				<option value='cburnett'>Cburnett</option>
				<option value='neo'>Neo</option>
				<option value='alpha'>Alpha</option>
				<option value='bases'>Bases</option>
				<option value='classic'>Classic</option>
			</select>
		</>
	);
};
