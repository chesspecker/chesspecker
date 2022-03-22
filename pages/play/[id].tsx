import {useState, useEffect, useCallback, ReactElement} from 'react';
import * as ChessJS from 'chess.js';
import {ChessInstance, Square, ShortMove} from 'chess.js';
import type {Config} from 'chessground/config';
import {useAtom} from 'jotai';
import {useRouter} from 'next/router';
import type {Data as PuzzleData, UpdateData} from '../api/puzzle/[id]';
import type {Data as SetData} from '../api/set/[id]';
import {
	PuzzleItemInterface,
	PuzzleSetInterface,
} from '@/models/puzzle-set-model';
import Layout from '@/layouts/main';
import {fetcher} from '@/lib/fetcher';
import Chessboard from '@/components/play/chessboard';
import {sortBy} from '@/lib/utils';
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
import useKeyPress from '@/hooks/use-key-press';
import WithoutSsr from '@/components/without-ssr';
import History from '@/components/play/history';
import {ButtonLink as Button} from '@/components/button';
import Progress from '@/components/play/progress';
import Solution from '@/components/play/solution';
import MoveToNext from '@/components/play/move-to-next';
import { checkForAchievement } from '@/lib/achievements';

const Chess = typeof ChessJS === 'function' ? ChessJS : ChessJS.Chess;
const getColor = (string_: 'w' | 'b') => (string_ === 'w' ? 'white' : 'black');

type HistoryProps = Array<{grade: number; PuzzleId: string}>;
type Props = {set: PuzzleSetInterface};
const PlayingPage = ({set}: Props) => {
	const [chess, setChess] = useState<ChessInstance>(new Chess());
	const [config, setConfig] = useState<Partial<Config>>();
	const [puzzleList, setPuzzleList] = useState<PuzzleItemInterface[]>([]);
	const [puzzleIndex, setPuzzleIndex] = useState<number>(0);
	const [puzzle, setPuzzle] = useState<PuzzleInterface>();
	const [moveNumber, setMoveNumber] = useState(0);
	const [moveHistory, setMoveHistory] = useState<string[]>([]);
	const [lastMove, setLastMove] = useState<Square[]>([]);
	const [previousPuzzle, setPreviousPuzzle] = useState<HistoryProps>([]);
	const [totalMistakes, setTotalMistakes] = useState(0);
	const [mistakes, setMistakes] = useState(0);
	const [hasAutoMove] = useAtom(autoMoveAtom);
	const [hasSound] = useAtom(soundAtom);
	const [isSolutionClicked, setIsSolutionClicked] = useState(false);
	const [initialSetTimer, setInitialSetTimer] = useState<number>(0);
	const [initialPuzzleTimer, setInitialPuzzleTimer] = useState<number>(
		Date.now(),
	);
	const [isComplete, setIsComplete] = useState(false);
	const [completedPuzzles, setCompletedPuzzles] = useState(0);
	const [pendingMove, setPendingMove] = useState<Square[]>([]);
	const {isOpen, show, hide} = useModal();
	const [, setAnimation] = useAtom(animationAtom);
	const [orientation, setOrientation] = useAtom(orientationAtom);
	const router = useRouter();

	// For achievement
	const [strikeMistakes, setStrikeMistakes] = useState(0);
	const [strikeTime, setStrikeTime] = useState(0);
	const [lastTime, setLastTime] = useState(0);

	/**
	 * Extract the list of puzzles.
	 */
	useEffect(() => {
		setInitialSetTimer(() => set.currentTime);
		setCompletedPuzzles(() => set.progression);
		const puzzleList = set.puzzles.filter(p => !p.played);
		setPuzzleList(() => sortBy(puzzleList, 'order'));
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [set.puzzles, set.currentTime]);

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
		setInitialPuzzleTimer(() => Date.now());
		setIsSolutionClicked(() => false);

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
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [puzzle]);

	type BodyData = {
		didCheat: boolean;
		mistakes: number;
		timeTaken: number;
		streak: number;
	};

	const getGrade = useCallback(
		({didCheat, mistakes, timeTaken, streak = 0}: BodyData) => {
			if (didCheat || mistakes >= 3) return 1;
			if (mistakes === 2 || (mistakes === 1 && timeTaken >= 20)) return 2;
			if (mistakes === 1 || timeTaken >= 20) return 3;
			if (timeTaken >= 6) return 4;
			if (streak < 2) return 5;
			return 6;
		},
		[],
	);

	/**
	 * Push the data of the current set when complete.
	 */
	const updateFinishedPuzzle = useCallback(async () => {
		const puzzle = puzzleList[puzzleIndex];
		let timeTaken = (Date.now() - initialPuzzleTimer) / 1000;
		timeTaken = Number.parseInt(timeTaken.toFixed(2), 10);
		await checkForAchievement(1,31,1);

		const newGrade = getGrade({
			didCheat: isSolutionClicked,
			mistakes,
			timeTaken,
			streak: puzzle.streak,
		});

		const update = {
			$inc: {
				'puzzles.$.count': 1,
				currentTime: timeTaken + 3 * mistakes,
				progression: 1,
			},
			$push: {
				'puzzles.$.mistakes': mistakes,
				'puzzles.$.timeTaken': timeTaken,
				'puzzles.$.grades': newGrade,
			},
			$set: {
				'puzzles.$.played': true,
				'puzzles.$.streak': puzzle.streak ? puzzle.streak + 1 : 0,
			},
		};

		try {
			const result = (await fetcher.put(
				`/api/puzzle/${puzzle._id.toString()}`,
				{_id: set._id, update},
			)) as UpdateData;
			if (result.success) {
				const grades = result.puzzle.grades;
				setPreviousPuzzle(previous => [
					...previous,
					{
						grade: grades[grades.length - 1],
						PuzzleId: result.puzzle._id.toString(),
					},
				]);
			}
		} catch (error: unknown) {
			console.log(error);
		}
	}, [
		puzzleIndex,
		mistakes,
		puzzleList,
		initialPuzzleTimer,
		set._id,
		isSolutionClicked,
		getGrade,
	]);

	/**
	 * Called when puzzle is completed, switch to the next one.
	 */
	const changePuzzle = useCallback(async () => {
		await updateFinishedPuzzle();
		setCompletedPuzzles(previous => previous + 1);
		if (mistakes === 0) {
			setStrikeMistakes(previous => previous + 1);
		} else {
			setStrikeMistakes(() => 0);
		}

		if (initialPuzzleTimer - Date.now() < 5) {
			setStrikeTime(previous => previous + 1);
		} else {
			setStrikeTime(() => 0);
		}

		setMistakes(() => 0);
		setInitialPuzzleTimer(() => Date.now());
		setIsSolutionClicked(() => false);
		setPuzzleIndex(previousPuzzle => previousPuzzle + 1);
	}, [updateFinishedPuzzle]);

	/**
	 * Push the data of the current set when complete.
	 */
	const updateFinishedSet = useCallback(async () => {
		let timeTaken = (Date.now() - initialSetTimer) / 1000;
		timeTaken += mistakes * 3; // Add 3sec malus for each mistake
		const update = {
			$inc: {
				cycles: 1,
			},
			$push: {
				times: timeTaken + 1,
			},
			$set: {
				'puzzles.$[].played': false,
				currentTime: 0,
				progression: 0,
			},
		};
		try {
			await fetcher.put(`/api/set/${set._id.toString()}`, update);
			await router.push(`/view/${set._id.toString()}`);
		} catch (error: unknown) {
			console.log(error);
		}
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [initialSetTimer, mistakes, set]);

	/**
	 * Called after each correct move.
	 */
	const checkSetComplete = useCallback(async () => {
		if (puzzleIndex + 1 === puzzleList.length) {
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
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
		[hasAutoMove, hasSound, changePuzzle, checkSetComplete, moveHistory.length],
	);

	/**
	 * Allow only legal moves.
	 */
	const calcMovable = useCallback((): Partial<Config['movable']> => {
		const dests = new Map();
		// FIXME: not working
		/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
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
	}, [chess]);

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
		[chess, moveHistory, calcMovable, hasSound],
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

	const onRightMove = useCallback(
		async (from: Square, to: Square) => {
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
		},
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
		[chess, moveNumber, checkPuzzleComplete, calcMovable, computerMove],
	);

	const onWrongMove = useCallback(async () => {
		chess.undo();
		setMistakes(previous => previous + 1);
		setTotalMistakes(previous => previous + 1);
		setAnimation('animate-wrongMove');
		setTimeout(() => {
			setAnimation(() => '');
		}, 600);
		await audio('ERROR', hasSound);
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [chess, hasSound]);

	/**
	 * Function called when the user plays.
	 */
	const onMove = useCallback(
		async (from: Square, to: Square) => {
			const moves = chess.moves({verbose: true});
			for (const move_ of moves) {
				if (
					move_.from === from &&
					move_.to === to &&
					move_.flags.includes('p')
				) {
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

			const isCorrectMove =
				`${move.from}${move.to}` === moveHistory[moveNumber];
			if (isCorrectMove || chess.in_checkmate()) {
				await onRightMove(from, to);
				return;
			}

			await onWrongMove();
		},
		[chess, moveHistory, moveNumber, onRightMove, onWrongMove, hasSound, show],
	);

	/**
	 * Handle promotions via chessground.
	 */
	const promotion = useCallback(
		async (piece: ShortMove['promotion']) => {
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
		},
		[
			pendingMove,
			moveHistory,
			moveNumber,
			chess,
			hasSound,
			onRightMove,
			onWrongMove,
		],
	);

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
		<div className='m-0 -mb-24 flex min-h-screen w-screen flex-col justify-center text-slate-800'>
			<div className='flex flex-row justify-center gap-2'>
				<Timer value={initialSetTimer} mistakes={totalMistakes} />
				<Button
					className='my-2 w-36 items-center rounded-md bg-gray-800 leading-8 text-white'
					href='/dashboard'
				>
					LEAVE 🧨
				</Button>
			</div>

			<div className='flex w-full flex-col items-center justify-center md:flex-row'>
				<div className='hidden w-36 md:invisible md:block' />
				<div className='w-5/6 max-w-2xl flex-auto'>
					<WithoutSsr>
						<Chessboard
							config={{...config, orientation, events: {move: onMove}}}
						/>
					</WithoutSsr>
					<Promotion
						isOpen={isOpen}
						hide={hide}
						color={getColor(chess.turn())}
						onPromote={promotion}
					/>
					<div className='flex flex-row-reverse items-end gap-2 py-1.5 text-gray-400'>
						<div className='flex h-full items-start justify-start'>
							<Settings />
							<Flip />
						</div>
						<History puzzles={previousPuzzle} />
					</div>
				</div>
				<div className='flex w-5/6 flex-row justify-center md:w-fit md:flex-col'>
					<div className='mt-2'>
						<Progress
							totalPuzzles={set.length}
							completedPuzzles={completedPuzzles}
						/>
					</div>
					<div className='mt-2'>
						<Solution
							time={initialPuzzleTimer}
							isSolutionClicked={isSolutionClicked}
							setSolution={setIsSolutionClicked}
							isComplete={isComplete}
							answer={moveHistory[moveNumber]}
						/>
						<MoveToNext isComplete={isComplete} changePuzzle={changePuzzle} />
					</div>
				</div>
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
