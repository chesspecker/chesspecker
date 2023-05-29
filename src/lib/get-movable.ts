import {Chess, SQUARES} from 'chess.js';
import type {Config} from 'chessground/config';

export const getMovable = (chess: Chess): Partial<Config['movable']> => {
	const dests = new Map();
	for (const square of SQUARES) {
		const ms = chess.moves({square, verbose: true});
		if (ms.length > 0)
			dests.set(
				square,
				ms.map(m => m.to),
			);
	}

	return {
		free: false,
		dests,
		showDests: true,
		color: 'both',
	};
};
