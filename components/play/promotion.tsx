import {ShortMove} from 'chess.js';
import {Color} from 'chessground/types';
import {useAtom} from 'jotai';
import {memo, Fragment} from 'react';
import {Dialog, Transition} from '@headlessui/react';
import {configµ} from '@/lib/atoms';

type PieceProps = {
	color: Color;
	role: 'queen' | 'rook' | 'bishop' | 'knight';
	handleClick: () => void | Promise<void>;
};

const SelectPiece = ({color, handleClick, role}: PieceProps) => {
	const [pieces] = useAtom(configµ.pieces);
	return (
		<div
			className='border border-gray-300 rounded edit-square'
			onClick={handleClick}
		>
			<div className={`promotion-piece ${pieces} ${role} ${color}`} />
		</div>
	);
};

type Props = {
	isOpen: boolean;
	hide: () => void;
	onPromote: (piece: ShortMove['promotion']) => void | Promise<void>;
	color: Color;
};
const Promotion = ({isOpen, hide, onPromote, color = 'white'}: Props) => {
	const promoteTo = async (piece: ShortMove['promotion']) => {
		await onPromote(piece);
		hide();
	};

	return (
		<Transition appear show={isOpen} as={Fragment}>
			<Dialog as='div' className='relative z-10' onClose={hide}>
				<Transition.Child
					as={Fragment}
					enter='ease-out duration-300'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leave='ease-in duration-200'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'
				>
					<div className='fixed inset-0 bg-black bg-opacity-25' />
				</Transition.Child>

				<div className='fixed inset-0 overflow-y-auto'>
					<div className='flex items-center justify-center min-h-full p-4 text-center'>
						<Transition.Child
							as={Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0 scale-95'
							enterTo='opacity-100 scale-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100 scale-100'
							leaveTo='opacity-0 scale-95'
						>
							<Dialog.Panel className='w-full max-w-md p-2 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl promote rounded-2xl flex justify-center gap-2 py-1.5'>
								<SelectPiece
									color={color}
									role='queen'
									handleClick={async () => {
										hide();
										await promoteTo('q');
									}}
								/>
								<SelectPiece
									color={color}
									role='rook'
									handleClick={async () => {
										hide();
										await promoteTo('r');
									}}
								/>
								<SelectPiece
									color={color}
									role='bishop'
									handleClick={async () => {
										hide();
										await promoteTo('b');
									}}
								/>
								<SelectPiece
									color={color}
									role='knight'
									handleClick={async () => {
										hide();
										await promoteTo('n');
									}}
								/>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
};

export default memo(Promotion);
