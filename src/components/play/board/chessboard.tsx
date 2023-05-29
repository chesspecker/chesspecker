/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import {Chessground as nativeChessground} from 'chessground';
import type {Api} from 'chessground/api';
import type {Config} from 'chessground/config';
import {useState, useRef, useEffect, useMemo} from 'react';

type Props = {
	config?: Partial<Config>;
};

const animation = '';
const board = 'green';
const pieces = 'neo';

export const NativeChessboard = ({config = {}}: Props) => {
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

	const mainStyle = useMemo(() => `next-chessground ${animation}`, [animation]);
	const themeStyle = useMemo(
		() => `chessground ${board} ${pieces}`,
		[board, pieces],
	);

	return (
		<div className='w-full'>
			<div className={mainStyle}>
				<div className={themeStyle}>
					<div ref={ref} className='table h-full w-full' />
				</div>
			</div>
		</div>
	);
};
