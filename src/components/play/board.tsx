import {memo} from 'react';
import type {Config} from 'chessground/config';
import type {Move} from 'chess.js';
import type {Color} from 'chessground/types';
import dynamic from 'next/dynamic';
import Promotion from './promotion';

const Chessboard = dynamic(async () => import('./chessboard'), {
	ssr: false,
});

type Props = {
	config?: Partial<Config>;
	isOpen: boolean;
	hide: () => void;
	onPromote: (piece: Move['promotion']) => void | Promise<void>;
	color: Color;
};

const Board = ({config, isOpen, hide, color, onPromote}: Props) => {
	if (typeof window === 'undefined') return null;

	return (
		<>
			<Chessboard config={config} />

			<Promotion
				isOpen={isOpen}
				hide={hide}
				color={color}
				onPromote={onPromote}
			/>
		</>
	);
};

// eslint-disable-next-line import/no-default-export
export default memo(Board);
