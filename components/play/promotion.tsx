import {PieceType} from 'chess.js';
import {Color} from 'chessground/types';
import {useAtom} from 'jotai';
import Modal from 'react-pure-modal';
import {piecesAtom} from '@/lib/atoms';

type PieceProps = {
	color: Color;
	role: 'queen' | 'rook' | 'bishop' | 'knight';
	handleClick: () => void | Promise<void>;
};

const SelectPiece = ({color, handleClick, role}: PieceProps) => {
	const [pieces] = useAtom(piecesAtom);
	return (
		<div
			className='edit-square rounded border border-gray-300'
			onClick={handleClick}
		>
			<div className={`promotion-piece ${pieces} ${role} ${color}`} />
		</div>
	);
};

type Props = {
	isOpen: boolean;
	hide: () => void;
	onPromote: (piece: PieceType) => void | Promise<void>;
	color: Color;
};
const Promotion = ({isOpen, hide, onPromote, color = 'white'}: Props) => {
	const promoteTo = async (piece: PieceType) => {
		await onPromote(piece);
		hide();
	};

	return (
		<Modal closeButton='' isOpen={isOpen} onClose={hide}>
			<div className='promote flex justify-center gap-2 py-1.5'>
				<SelectPiece
					color={color}
					role='queen'
					handleClick={async () => {
						await promoteTo('q');
					}}
				/>
				<SelectPiece
					color={color}
					role='rook'
					handleClick={async () => {
						await promoteTo('r');
					}}
				/>
				<SelectPiece
					color={color}
					role='bishop'
					handleClick={async () => {
						await promoteTo('b');
					}}
				/>
				<SelectPiece
					color={color}
					role='knight'
					handleClick={async () => {
						await promoteTo('n');
					}}
				/>
			</div>
		</Modal>
	);
};

export default Promotion;
