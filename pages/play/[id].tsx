/* eslint-disable @typescript-eslint/no-unused-vars */
import {useState, useEffect, useCallback, ReactElement} from 'react';
import * as ChessJS from 'chess.js';
import {ChessInstance, Square, ShortMove} from 'chess.js';
import type {Config} from 'chessground/config';
import {useAtom} from 'jotai';
import {useRouter} from 'next/router';
import type {Data as PuzzleData} from '../api/puzzle/[id]';
import type {Data as SetData} from '../api/set/[id]';
import {
	PuzzleItemInterface,
	PuzzleSetInterface,
} from '@/models/puzzle-set-model';
import Layout from '@/layouts/main';
import {fetcher} from '@/lib/fetcher';
import Chessboard from '@/components/play/chessboard';
import {sortBy} from '@/lib/help-array';
import useEffectAsync from '@/hooks/use-effect-async';
import {PuzzleInterface} from '@/models/puzzle-model';
import audio from '@/lib/sound';
import {
	soundAtom,
	orientationAtom,
	animationAtom,
	autoMoveAtom,
} from '@/lib/atoms';
import useModal from '@/hooks/use-modal';
import Flip from '@/components/play/flip';
import Settings from '@/components/play/settings';
import Promotion from '@/components/play/promotion';
import Timer from '@/components/play/timer';
import useTimer from '@/hooks/use-timer';
import useKeyPress from '@/hooks/use-key-press';

const Chess = typeof ChessJS === 'function' ? ChessJS : ChessJS.Chess;
const getColor = (string_: 'w' | 'b') => (string_ === 'w' ? 'white' : 'black');

type Props = {set: PuzzleSetInterface};
const PlayingPage = ({set}: Props) => {
	console.log('PlayingPage');
	const [chess, setChess] = useState<ChessInstance>(new Chess());
	const [config, setConfig] = useState<Partial<Config>>();
	const [puzzleList, setPuzzleList] = useState<PuzzleItemInterface[]>([]);
	const [puzzleIndex, setPuzzleIndex] = useState<number>(0);
	const [puzzle, setPuzzle] = useState<PuzzleInterface>();
	const [moveNumber, setMoveNumber] = useState(0);
	const [moveHistory, setMoveHistory] = useState<string[]>([]);
	const [lastMove, setLastMove] = useState<Square[]>([]);
	const [malus, setMalus] = useState(0);
	const [mistakes, setMistakes] = useState(0);
	const [hasAutoMove] = useAtom(autoMoveAtom);
	const [hasSound] = useAtom(soundAtom);
	const [solution, setSolution] = useState({clicked: false, clickable: false});
	const {timer, updateTimer, isTimerOn, toggleTimer} = useTimer(0);
	const [initialTimer, setInitialTimer] = useState(0);
	const [isComplete, setIsComplete] = useState(false);
	const [completedPuzzles, setCompletedPuzzles] = useState(0);
	const [pendingMove, setPendingMove] = useState<Square[]>([]);
	const {isOpen, show, hide} = useModal();
	const [, setAnimation] = useAtom(animationAtom);
	const [orientation, setOrientation] = useAtom(orientationAtom);
	const router = useRouter();

	/**
	 * Extract the list of puzzles.
	 */
	useEffect(() => {
		updateTimer(set.currentTime);
		setInitialTimer(set.currentTime);
		const puzzleList = set.puzzles.filter(p => !p.played);
		setPuzzleList(() => sortBy(puzzleList, 'order'));
	}, [set.puzzles, set.currentTime]);

	/**
	 * Wait to show solution button.
	 */
	useEffect(() => {
		const past = timer - initialTimer;
		if (past < 6) setSolution(solution => ({...solution, clickable: false}));
		if (past > 6) setSolution(solution => ({...solution, clickable: true}));
	}, [timer, initialTimer]);

	/**
	 * Retrieve current puzzle.
	 */
	useEffectAsync(async () => {
		if (!puzzleList[puzzleIndex] || puzzleList.length === 0) return;
		const nextPuzzle = puzzleList[puzzleIndex];
		const data = (await fetcher.get(
			`/api/puzzle/${nextPuzzle._id.toString()}`,
		)) as PuzzleData;
		if (data.success) {
			setPuzzle(() => data.puzzle);
			// TODO: setGameLink(`https://lichess.org/training/${data.puzzle.PuzzleId}`);
		}
	}, [puzzleList, puzzleIndex]);

	/**
	 * Setup the board.
	 */
	useEffect(() => {
		if (!puzzle?.Moves) return;
		const chess = new Chess(puzzle.FEN);
		setChess(() => chess);
		setMoveHistory(() => puzzle.Moves.split(' '));
		setMoveNumber(() => 0);
		setLastMove(() => []);
		setIsComplete(() => false);
		setPendingMove(() => undefined);
		setOrientation(() => (chess.turn() === 'b' ? 'white' : 'black'));

		const config: Partial<Config> = {
			fen: chess.fen(),
			check: chess.in_check(),
			animation: {enabled: true, duration: 50},
			turnColor: getColor(chess.turn()),
			highlight: {
				lastMove: true,
				check: true,
			},
			premovable: {enabled: false},
			movable: calcMovable(),
			coordinates: true,
		};

		setConfig(previousConfig => ({...previousConfig, ...config}));
	}, [puzzle]);

	type BodyData = {
		_id: PuzzleSetInterface['id'];
		didCheat: boolean;
		mistakes: number;
		timeTaken: number;
		perfect: number;
	};

	/**
	 * Push the data of the current set when complete.
	 */
	const updateFinishedPuzzle = useCallback(async () => {
		const puzzle = puzzleList[puzzleIndex];
		const timeTaken = timer - initialTimer;
		const body: BodyData = {
			_id: set._id,
			didCheat: false,
			mistakes,
			timeTaken,
			perfect: 0,
		};

		try {
			await fetcher.put(`/api/puzzle/${puzzle._id.toString()}`, body);
		} catch (error: unknown) {
			console.log(error);
		}
	}, [puzzleIndex, mistakes, puzzleList, initialTimer, set._id, timer]);

	/**
	 * Called when puzzle is completed, switch to the next one.
	 */
	const changePuzzle = useCallback(async () => {
		await updateFinishedPuzzle();
		setCompletedPuzzles(previous => previous + 1);
		setMistakes(() => 0);
		setSolution(solution => ({...solution, clickable: false}));
		setInitialTimer(() => timer);
		setPuzzleIndex(previousPuzzle => previousPuzzle + 1);
	}, [timer, updateFinishedPuzzle]);

	/**
	 * Push the data of the current set when complete.
	 */
	const updateFinishedSet = useCallback(async () => {
		try {
			await fetcher.put(`/api/set/${set._id.toString()}`, {
				cycles: true,
				bestTime: timer + 1,
			});
		} catch (error: unknown) {
			console.log(error);
		}
	}, [timer, set]);

	/**
	 * Called after each correct move.
	 */
	const checkSetComplete = useCallback(async () => {
		if (puzzleIndex + 1 === puzzleList.length) {
			toggleTimer(false);
			await audio('VICTORY', hasSound);
			await updateFinishedSet();
			return true;
		}

		return false;
	}, [puzzleIndex, hasSound, puzzleList.length, updateFinishedSet]);

	/**
	 * Called after each correct move.
	 */
	const checkPuzzleComplete = useCallback(
		async moveNumber => {
			if (moveNumber === moveHistory.length) {
				setAnimation(() => 'animate-finishMove');
				setTimeout(() => {
					setAnimation(() => '');
				}, 600);
				const isSetComplete = await checkSetComplete();
				if (isSetComplete) return true;
				setIsComplete(() => true);
				await audio('GENERIC', hasSound, 0.3);
				if (hasAutoMove) await changePuzzle();
				return true;
			}

			return false;
		},
		[hasAutoMove, hasSound, changePuzzle, checkSetComplete, moveHistory.length],
	);

	/**
	 * Function making the computer play the next move.
	 */
	const computerMove = useCallback(
		async (index: number) => {
			if (!chess) return;
			const move = chess.move(moveHistory[index], {sloppy: true});
			if (!move) return;
			setConfig(config => ({
				...config,
				fen: chess.fen(),
				check: chess.in_check(),
				movable: calcMovable(),
				turnColor: getColor(chess.turn()),
				lastMove: [move.from, move.to],
			}));
			setMoveNumber(previousMove => previousMove + 1);
			await (move.captured
				? audio('CAPTURE', hasSound)
				: audio('MOVE', hasSound));
		},
		[chess, moveHistory],
	);

	/**
	 * When the board is setup, make the first move.
	 */
	useEffect(() => {
		if (!moveHistory) return;
		if (moveNumber !== 0) return;
		setTimeout(async () => {
			await computerMove(0);
		}, 300);
	}, [moveHistory, computerMove, moveNumber]);

	useEffect(() => {
		setConfig(config => ({...config, lastMove}));
	}, [lastMove]);

	/**
	 * Allow only legal moves.
	 */
	const calcMovable = (): Partial<Config['movable']> => {
		const dests = new Map();
		// FIXME: not working
		const color = getColor(chess.turn());
		for (const s of chess.SQUARES) {
			const ms = chess.moves({square: s, verbose: true});
			if (ms.length > 0)
				dests.set(
					s,
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

	const onRightMove = async (from: Square, to: Square) => {
		setConfig(config => ({
			...config,
			fen: chess.fen(),
			check: chess.in_check(),
			turnColor: getColor(chess.turn()),
			movable: calcMovable(),
			lastMove: [from, to],
		}));
		const currentMoveNumber = moveNumber + 1;
		setMoveNumber(previousMove => previousMove + 1);
		const isPuzzleComplete = await checkPuzzleComplete(currentMoveNumber);
		if (isPuzzleComplete) return;
		setAnimation(() => 'animate-rightMove');
		setTimeout(() => {
			setAnimation(() => '');
		}, 600);
		setTimeout(async () => {
			await computerMove(moveNumber + 1);
		}, 300);
	};

	const onWrongMove = async () => {
		chess.undo();
		setMistakes(previous => previous + 1);
		setMalus(previous => previous + 3);
		setAnimation('animate-wrongMove');
		setTimeout(() => {
			setAnimation(() => '');
		}, 600);
		await audio('ERROR', hasSound);
	};

	/**
	 * Function called when the user plays.
	 */
	const onMove = async (from: Square, to: Square) => {
		const moves = chess.moves({verbose: true});
		for (const move_ of moves) {
			if (move_.from === from && move_.to === to && move_.flags.includes('p')) {
				setPendingMove([from, to]);
				show();
				return;
			}
		}

		const move = chess.move({from, to});
		if (move === null) return;

		await (move.captured
			? audio('CAPTURE', hasSound)
			: audio('MOVE', hasSound));

		const isCorrectMove = `${move.from}${move.to}` === moveHistory[moveNumber];
		if (isCorrectMove || chess.in_checkmate()) {
			await onRightMove(from, to);
			return;
		}

		await onWrongMove();
	};

	/**
	 * Handle promotions via chessground.
	 */
	const promotion = async (piece: ShortMove['promotion']) => {
		const from = pendingMove[0];
		const to = pendingMove[1];
		const isCorrectMove = piece === moveHistory[moveNumber].slice(-1);
		const move = chess.move({from, to, promotion: piece});
		if (move === null) return;

		await (move.captured
			? audio('CAPTURE', hasSound)
			: audio('MOVE', hasSound));

		if (isCorrectMove || chess.in_checkmate()) {
			await onRightMove(from, to);
			return;
		}

		await onWrongMove();
	};

	const fn = useCallback(async () => {
		if (!isComplete) return;
		await changePuzzle();
	}, [isComplete, changePuzzle]);

	useKeyPress({targetKey: 'Q', fn: async () => router.push('/dashboard')});
	useKeyPress({targetKey: 'q', fn: async () => router.push('/dashboard')});
	useKeyPress({targetKey: 'Escape', fn: async () => router.push('/dashboard')});
	useKeyPress({targetKey: 's', fn});
	useKeyPress({targetKey: 'S', fn});
	useKeyPress({targetKey: 'n', fn});
	useKeyPress({targetKey: 'N', fn});

	return (
		<div>
			<Timer value={timer} />
			<Chessboard config={{...config, orientation, events: {move: onMove}}} />
			<Promotion
				isOpen={isOpen}
				hide={hide}
				color={getColor(chess.turn())}
				onPromote={promotion}
			/>
			<div className='flex flex-row-reverse gap-2 py-1.5 text-gray-400'>
				<Settings />
				<Flip />
			</div>
		</div>
	);
};

PlayingPage.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
export default PlayingPage;

interface SSRProps {
	params: {id: string | undefined};
}

export const getServerSideProps = async ({params}: SSRProps) => {
	const id: string = params.id;
	const data = (await fetcher.get(`/api/set/${id}`)) as SetData;
	if (!data.success) return {notFound: true};
	return {props: {set: data.set}};
};
