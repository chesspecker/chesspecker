import React, {useEffect, useRef, useState, memo, useMemo} from 'react';
import {Chessground as nativeChessground} from 'chessground';
import {Config} from 'chessground/config';
import {Api} from 'chessground/api';
import {useAtom} from 'jotai';
import {animationµ, Board, configµ, getStorage, Pieces} from '@/lib/atoms';

type Props = {
	config?: Partial<Config>;
};

const Chessground = ({config = {}}: Props) => {
	const [board, setBoard] = useAtom(configµ.board);
	const [pieces, setPieces] = useAtom(configµ.pieces);
	const [animation] = useAtom(animationµ);
	const [api, setApi] = useState<Api | undefined>();
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (ref?.current && !api) {
			const chessgroundApi = nativeChessground(ref.current, config);
			setApi(chessgroundApi);
		} else if (ref?.current && api) {
			api.set(config);
		}
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [ref]);

	useEffect(() => {
		api?.set(config);
	}, [api, config]);

	useEffect(() => {
		setBoard(() => getStorage<Board>('cp-board') ?? 'green');
		setPieces(() => getStorage<Pieces>('cp-pieces') ?? 'neo');
	}, [setBoard, setPieces]);

	const mainStyle = useMemo(() => `next-chessground ${animation}`, [animation]);
	const themeStyle = useMemo(
		() => `chessground ${board} ${pieces}`,
		[board, pieces],
	);

	return (
		<div className='w-full'>
			<div className={mainStyle}>
				<div className={themeStyle}>
					<div ref={ref} className='table w-full h-full' />
				</div>
			</div>
		</div>
	);
};

export default memo(Chessground);
