import {memo, useEffect, useState} from 'react';
import {useAtom} from 'jotai';
import * as ChessJS from 'chess.js';
import {Button, ButtonLink} from '../../button';
import {configµ, playµ} from '@/lib/atoms';
import type {Puzzle} from '@/models/puzzle';

const Chess = typeof ChessJS === 'function' ? ChessJS : ChessJS.Chess;
type Props = {answer: string; fen: string; puzzle: Puzzle};

const defaultClasses =
	'mx-auto md:mx-2 w-36 rounded-md bg-slate-800 dark:bg-white leading-8 mt-0 ml-2 font-bold font-sans text-sm md:text-lg px-2.5 py-2';
const disabledClasses = `block cursor-default text-white dark:text-sky-800 self-center border border-none border-transparent text-center shadow-sm ${defaultClasses}`;

const Solution = ({answer, fen, puzzle}: Props) => {
	const [isSolutionClicked, setIsSolutionClicked] = useAtom(playµ.solution);
	const [hasAutoMove] = useAtom(configµ.autoMove);
	const [isComplete] = useAtom(playµ.isComplete);
	const [solution, setSolution] = useState('');

	useEffect(() => {
		if (!fen) return;
		setSolution(() => {
			const chess = new Chess(fen);
			const move = chess.move(answer, {sloppy: true});
			if (move) return move.san;
			return '';
		});
	}, [answer, fen]);

	if (isComplete && !hasAutoMove)
		return (
			<ButtonLink
				className={disabledClasses}
				href={`https://lichess.org/training/${puzzle.PuzzleId}`}
			>
				SEE IN LICHESS
			</ButtonLink>
		);

	if (isSolutionClicked)
		return <span className={disabledClasses}>{solution || answer}</span>;

	return (
		<Button
			className={defaultClasses}
			onClick={() => {
				setIsSolutionClicked(() => true);
			}}
		>
			VIEW SOLUTION
		</Button>
	);
};

export default memo(Solution);
