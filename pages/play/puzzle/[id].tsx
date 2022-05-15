import {useState, useEffect, useCallback, ReactElement} from 'react';
import * as ChessJS from 'chess.js';
import {ChessInstance, Square, ShortMove} from 'chess.js';
import type {Config} from 'chessground/config';
import {useAtom} from 'jotai';
import {useRouter} from 'next/router';
import type {GetServerSidePropsContext, Redirect} from 'next';
import {NextSeo} from 'next-seo';
import Link from 'next/link';
import {PuzzleInterface} from '@/types/models';
import Layout from '@/layouts/main';
import audio from '@/lib/sound';
import {configµ, orientationµ, animationµ, playµ} from '@/lib/atoms';
import useModal from '@/hooks/use-modal';
import Timer from '@/components/play/timer';
import useKeyPress from '@/hooks/use-key-press';
import {Button} from '@/components/button';
import {withSessionSsr} from '@/lib/session';
import {get as get_} from '@/lib/play';
import Board from '@/components/play/board';
import BottomBar from '@/components/play/bottom-bar';
import Solution from '@/components/play/right-bar/solution';
import MoveToNext from '@/components/play/right-bar/move-to-next';
import ModalPuzzle from '@/components/modal-puzzle';
import type {Stat} from '@/components/modal-puzzle';

const Chess = typeof ChessJS === 'function' ? ChessJS : ChessJS.Chess;
const getColor = (string_: 'w' | 'b') => (string_ === 'w' ? 'white' : 'black');

const parseGrade: Record<number, string> = {
	0: 'F',
	1: 'E',
	2: 'D',
	3: 'C',
	4: 'B',
	5: 'A',
	6: 'A+',
};

Object.freeze(parseGrade);

/* eslint-disable-next-line no-promise-executor-return */
const sleep = async (ms: number) => new Promise(r => setTimeout(r, ms));

type Props = {puzzle: PuzzleInterface};
const PlayingPage = ({puzzle}: Props) => {
	const [hasAutoMove] = useAtom(configµ.autoMove);
	const [hasSound] = useAtom(configµ.sound);
	const [hasAnimation] = useAtom(configµ.animation);

	const [isSolutionClicked, setIsSolutionClicked] = useAtom(playµ.solution);
	const [initialPuzzleTimer, setInitialPuzzleTimer] = useAtom(playµ.timer);

	const [orientation, setOrientation] = useAtom(orientationµ);
	const [, setAnimation] = useAtom(animationµ);

	const [chess, setChess] = useState<ChessInstance>(new Chess());
	const [config, setConfig] = useState<Partial<Config>>();

	const [moveNumber, setMoveNumber] = useState(0);
	const [moveHistory, setMoveHistory] = useState<string[]>([]);
	const [lastMove, setLastMove] = useState<Square[]>([]);
	const [mistakes, setMistakes] = useState(0);
	const [isRunning, setIsRunning] = useState(true);
	const [pendingMove, setPendingMove] = useState<Square[]>([]);
	const {isOpen, show, hide} = useModal();
	const router = useRouter();

	const [showModal, setShowModal] = useState(false);
	const [stat, setStat] = useState<Stat>({
		mistakes: 0,
		time: 0,
		grade: '',
	});

	const cleanAnimation = useCallback(
		async () =>
			sleep(600)
				.then(() => {
					setAnimation(() => '');
				})
				.catch(console.error),
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
		[],
	);

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

	/**
	 * Allow only legal moves.
	 */
	const calcMovable = useCallback((): Partial<Config['movable']> => {
		const dests = new Map();
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

	const playFromComputer = useCallback(
		async (move: number) =>
			sleep(300)
				.then(async () => computerMove(move))
				.catch(console.error),
		[computerMove],
	);

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
	 * Called after each correct move.
	 */
	const checkPuzzleComplete = useCallback(
		async moveNumber => {
			const isComplete = moveNumber === moveHistory.length;
			if (hasAnimation) {
				const animation = isComplete
					? 'animate-finishMove'
					: 'animate-rightMove';
				setAnimation(() => animation);
				cleanAnimation().catch(console.error);
			}

			if (!isComplete) return playFromComputer(moveNumber);
			setIsRunning(() => false);

			await audio('GENERIC', hasSound, 0.3);

			const timeTaken = (Date.now() - initialPuzzleTimer) / 1000;
			const timeWithoutMistakes = Number.parseInt(timeTaken.toFixed(2), 10);
			const timeWithMistakes = timeTaken + 3 * mistakes;

			const newGrade = getGrade({
				didCheat: isSolutionClicked,
				mistakes,
				timeTaken: timeWithoutMistakes,
				streak: 0,
			});

			setStat(() => ({
				mistakes,
				time: timeWithMistakes,
				grade: parseGrade[newGrade],
			}));
			setShowModal(() => true);
		},
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
		[
			hasAutoMove,
			hasSound,
			cleanAnimation,
			playFromComputer,
			moveHistory.length,
			mistakes,
			initialPuzzleTimer,
			isSolutionClicked,
		],
	);

	/**
	 * When the board is setup, make the first move.
	 */
	useEffect(() => {
		if (!moveHistory) return;
		if (moveNumber !== 0) return;
		playFromComputer(0).catch(console.error);
	}, [moveHistory, computerMove, moveNumber, playFromComputer]);

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
			await checkPuzzleComplete(currentMoveNumber);
		},
		[chess, moveNumber, checkPuzzleComplete, calcMovable],
	);

	const onWrongMove = useCallback(async () => {
		chess.undo();
		setMistakes(previous => previous + 1);
		if (hasAnimation) {
			setAnimation(() => 'animate-wrongMove');
			cleanAnimation().catch(console.error);
		}

		await audio('ERROR', hasSound);
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [chess, hasSound, cleanAnimation]);

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

	const fn = useCallback(() => {
		router.reload();
	}, [router]);

	const launchTimer = useCallback(() => {
		setIsRunning(() => true);
	}, []);

	useKeyPress({targetKey: 'Q', fn: async () => router.push('/dashboard')});
	useKeyPress({targetKey: 'q', fn: async () => router.push('/dashboard')});
	useKeyPress({targetKey: 'Escape', fn: async () => router.push('/dashboard')});
	useKeyPress({targetKey: 's', fn});
	useKeyPress({targetKey: 'S', fn});
	useKeyPress({targetKey: 'n', fn});
	useKeyPress({targetKey: 'N', fn});

	return (
		<>
			<NextSeo title='⚔️ Play' />
			<ModalPuzzle
				stat={stat}
				puzzle={puzzle}
				showModal={showModal}
				setShowModal={setShowModal}
			/>
			<div className='flex flex-col justify-center w-screen min-h-screen pt-32 pb-24 m-0 text-slate-800'>
				<div className='flex flex-row justify-center gap-2'>
					<Timer value={0} mistakes={mistakes} isRunning={isRunning} />
					<Link href='/dashboard'>
						<a>
							<Button className='items-center my-2 leading-8 bg-gray-800 rounded-md w-36'>
								LEAVE 🧨
							</Button>
						</a>
					</Link>
				</div>
				<div className='flex flex-col items-center justify-center w-full md:flex-row'>
					<div className='hidden w-36 md:invisible md:block' />
					<div className='max-w-[33rem] w-11/12 md:w-full flex-auto'>
						<Board
							config={{...config, orientation, events: {move: onMove}}}
							isOpen={isOpen}
							hide={hide}
							color={getColor(chess.turn())}
							onPromote={promotion}
						/>
						<BottomBar puzzles={[]} />
					</div>

					<div className='flex flex-row justify-center w-5/6 md:w-fit md:flex-col'>
						<div className='mt-2'>
							<Solution
								answer={moveHistory[moveNumber]}
								fen={chess.fen()}
								puzzle={puzzle}
							/>
							<MoveToNext changePuzzle={fn} launchTimer={launchTimer} />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

PlayingPage.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
export default PlayingPage;

interface SSRProps extends GetServerSidePropsContext {
	params: {id: string | undefined};
}

export const getServerSideProps = withSessionSsr(
	async ({params, req}: SSRProps) => {
		if (!req?.session?.userID) {
			const redirect: Redirect = {statusCode: 303, destination: '/'};
			return {redirect};
		}

		const id: string = params.id;
		const protocol = (req.headers['x-forwarded-proto'] as string) || 'http';
		const baseUrl = req ? `${protocol}://${req.headers.host}` : '';
		const data = await get_.puzzle(id, baseUrl);

		if (!data.success) return {notFound: true};
		return {props: {puzzle: data.puzzle}};
	},
);
