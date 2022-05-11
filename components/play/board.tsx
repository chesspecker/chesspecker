import {memo} from 'react';
import {Config} from 'chessground/config';
import {ShortMove} from 'chess.js';
import {Color} from 'chessground/types';
import WithoutSsr from '../without-ssr';
import Chessboard from './chessboard';
import Promotion from './promotion';

type Props = {
	config?: Partial<Config>;
	isOpen: boolean;
	hide: () => void;
	onPromote: (piece: ShortMove['promotion']) => void | Promise<void>;
	color: Color;
};

const Board = ({config, isOpen, hide, color, onPromote}: Props) => {
	return (
		<>
			<WithoutSsr>
				<Chessboard config={config} />
			</WithoutSsr>

			<Promotion
				isOpen={isOpen}
				hide={hide}
				color={color}
				onPromote={onPromote}
			/>
		</>
	);
};

export default memo(Board);
