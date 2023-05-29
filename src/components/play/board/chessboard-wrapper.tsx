/* eslint-disable react-hooks/exhaustive-deps */
import {memo} from 'react';
import type {Config} from 'chessground/config';
import type {Move} from 'chess.js';
import type {Color} from 'chessground/types';
import Promotion from './promotion';
import {NativeChessboard} from '@/components/play/board/chessboard';

type Props = {
	config?: Partial<Config>;
	isOpen: boolean;
	hide: () => void;
	onPromote: (piece: Move['promotion']) => void | Promise<void>;
	color: Color;
};

const ChessboardWrapper = ({config, isOpen, hide, color, onPromote}: Props) => {
	return (
		<>
			<NativeChessboard config={config} />

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
export default memo(ChessboardWrapper);
