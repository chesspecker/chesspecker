'use client';

import ChessboardWrapper from '@/components/play/board/chessboard-wrapper';
import {getColor} from '@/lib/get-color';
import {getGrade} from '@/lib/get-grade';
import {getMovable} from '@/lib/get-movable';
import {getTime} from '@/lib/get-puzzle-time';
import {sleep} from '@/utils/sleep';
import {Puzzle} from '@prisma/client';
import {Chess, Move, Square} from 'chess.js';
import {Config} from 'chessground/config';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';

type Props = {
	puzzle: Puzzle;
	nextPuzzleItem: {
		puzzleSetId: string;
		id: string;
	} | null;
};

export const Chessboard = ({puzzle, nextPuzzleItem}: Props) => {
	const router = useRouter();
	const chess = useMemo<Chess>(() => new Chess(puzzle.fen), [puzzle.fen]);
	const mistakes = useRef(0);
	const moveNumber = useRef(0);
	const initialPuzzleTimer = useRef(Date.now());
	const [config, setConfig] = useState<Partial<Config>>({
		fen: chess.fen(),
		check: chess.isCheck(),
		animation: {enabled: true, duration: 50},
		turnColor: getColor(chess.turn()),
		lastMove: [],
		highlight: {
			lastMove: true,
			check: true,
		},
		premovable: {enabled: false},
		movable: getMovable(chess),
		coordinates: true,
		orientation: chess.turn() === 'b' ? 'white' : 'black',
	});

	console.log({
		moveNumber: moveNumber.current,
		solution: puzzle.moves[moveNumber.current],
	});

	const updateBoard = useCallback((from: Square, to: Square, chess: Chess) => {
		setConfig(config => ({
			...config,
			fen: chess.fen(),
			check: chess.inCheck(),
			movable: getMovable(chess),
			turnColor: getColor(chess.turn()),
			lastMove: [from, to],
		}));
	}, []);

	const computerMove = useCallback(
		async (prevMoveNumber: number) => {
			if (!chess) return;
			const move = chess.move(puzzle.moves[prevMoveNumber]);
			if (!move) return;
			await sleep(350);
			updateBoard(move.from, move.to, chess);
			moveNumber.current++;
		},
		[chess, puzzle.moves, updateBoard],
	);

	useEffect(() => {
		(async () => await computerMove(0))();
	}, [computerMove]);

	const checkIsMoveCorrect = useCallback(
		(move: Move, chess: Chess) =>
			`${move.from}${move.to}` === puzzle.moves[moveNumber.current] ||
			chess.isCheckmate(),
		[puzzle.moves, moveNumber],
	);

	const handleUserMove = (from: Square, to: Square) => {
		const moves = chess.moves({verbose: true});
		const move = chess.move({from, to});
		if (move === null) return;

		checkIsMoveCorrect(move, chess)
			? onRightMove(from, to, chess)
			: onWrongMove(from, to, chess);
	};

	const onWrongMove = useCallback(
		async (from: Square, to: Square, chess: Chess) => {
			mistakes.current++;
			await sleep(150);
			chess.undo();
			updateBoard(to, from, chess);
		},
		[updateBoard],
	);

	const changePuzzle = useCallback(() => {
		router.push(`/play/${nextPuzzleItem?.puzzleSetId}/${nextPuzzleItem?.id}`);
	}, [nextPuzzleItem?.id, nextPuzzleItem?.puzzleSetId, router]);

	const onPuzzleComplete = useCallback(() => {
		changePuzzle();
	}, [changePuzzle]);

	const onRightMove = useCallback(
		async (from: Square, to: Square, chess: Chess) => {
			console.log('right move');
			updateBoard(from, to, chess);
			const currentMoveNumber = (moveNumber.current++, moveNumber.current);
			const isPuzzleComplete = currentMoveNumber === puzzle.moves.length;

			if (!isPuzzleComplete) return computerMove(currentMoveNumber);

			console.log('puzzle complete');
			const {maxTime, minTime} = getTime.interval(puzzle.moves.length);
			const {timeTaken, timeWithMistakes} = getTime.taken(
				initialPuzzleTimer.current,
				mistakes.current,
			);

			const grade = getGrade({
				didCheat: false,
				mistakes: mistakes.current,
				timeTaken,
				minTime,
				maxTime,
				streak: 0,
			});

			console.log({grade, timeTaken, timeWithMistakes});

			onPuzzleComplete();
		},
		[updateBoard, puzzle.moves.length, computerMove, onPuzzleComplete],
	);

	return (
		<div className='flex w-full flex-col items-center justify-center md:flex-row'>
			<div className='w-11/12 max-w-[33rem] flex-auto md:w-full'>
				<ChessboardWrapper
					config={{
						...config,
						events: {move: handleUserMove as any},
					}}
					isOpen={false}
					hide={() => void 0}
					color={getColor(chess.turn())}
					onPromote={() => void 0}
				/>
			</div>
		</div>
	);
};
