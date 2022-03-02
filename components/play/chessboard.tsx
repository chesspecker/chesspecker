import React, {useEffect, useRef, useState, memo, useMemo} from 'react';
import {Chessground as nativeChessground} from 'chessground';
import {Config} from 'chessground/config';
import {Api} from 'chessground/api';
import {useAtom} from 'jotai';
import {animationAtom, boardAtom, piecesAtom, get_} from '@/lib/atoms';

interface Props {
	config?: Partial<Config>;
}

const Chessground = ({config = {}}: Props) => {
	const [board, setBoard] = useAtom(boardAtom);
	const [pieces, setPieces] = useAtom(piecesAtom);
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

	useEffect(() => {
		setBoard(get_('cp-board') ?? 'green');
		setPieces(get_('cp-pieces') ?? 'neo');
	}, []);

	const mainStyle = useMemo(() => `next-chessground ${animation}`, [animation]);
	const themeStyle = useMemo(
		() => `chessground ${board} ${pieces}`,
		[board, pieces],
	);

	return (
		<div className='mx-auto aspect-square w-2/5'>
			<div className={mainStyle}>
				<div className={themeStyle}>
					<div ref={ref} className='table h-full w-full' />
				</div>
			</div>
		</div>
	);
};

export default memo(Chessground);
