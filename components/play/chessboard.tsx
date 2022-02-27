import React, {useEffect, useRef, useState} from 'react';

import {Chessground as nativeChessground} from 'chessground';
import {Config} from 'chessground/config';
import {Api} from 'chessground/api';

import {useAtom} from 'jotai';
import {animationAtom, boardAtom, piecesAtom} from '@/lib/atoms';

interface Props {
	width?: number;
	height?: number;
	contained?: boolean;
	config?: Partial<Config>;
}

const Chessground = ({
	width = 800,
	height = 800,
	config = {},
	contained = false,
}: Props) => {
	const [board] = useAtom(boardAtom);
	const [pieces] = useAtom(piecesAtom);
	const [animation] = useAtom(animationAtom);

	const [api, setApi] = useState<Api | null>(null);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (ref?.current && !api) {
			const chessgroundApi = nativeChessground(ref.current, config);
			setApi(chessgroundApi);
		} else if (ref?.current && api) {
			api.set(config);
		}
	}, [ref]);

	useEffect(() => {
		api?.set(config);
	}, [api, config]);

	return (
		<div className={`next-chessground ${animation}`}>
			<div
				className={`chessground ${board} ${pieces}`}
				style={{
					height: contained ? '100%' : height,
					width: contained ? '100%' : width,
				}}
			>
				<div
					ref={ref}
					style={{height: '100%', width: '100%', display: 'table'}}
				/>
			</div>
		</div>
	);
};

export default Chessground;
