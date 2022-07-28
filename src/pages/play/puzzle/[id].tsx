import {useState, useEffect, useCallback, ReactElement} from 'react';
import * as ChessJS from 'chess.js';
import {ChessInstance, Square, ShortMove} from 'chess.js';
import type {Config} from 'chessground/config';
import {useAtom} from 'jotai';
import {useRouter} from 'next/router';
import type {GetServerSidePropsContext, Redirect} from 'next';
import {NextSeo} from 'next-seo';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {useSound} from 'use-sound';
import {Puzzle} from '@/models/puzzle';
import Layout from '@/layouts/main';
import {configµ, orientationµ, animationµ, playµ} from '@/lib/atoms';
import useModal from '@/hooks/use-modal';
import useKeyPress from '@/hooks/use-key-press';
import {Button} from '@/components/button';
import {withSessionSsr} from '@/lib/session';
import {get_} from '@/lib/api-helpers';
import {getGrade, parseGrade} from '@/lib/grades';
import {getColor, getMovable, getTime} from '@/lib/play';
import type {Stat} from '@/components/modal-puzzle';
import MoveToNext from '@/components/play/right-bar/move-to-next';
import {sleep} from '@/lib/utils';
import Board from '@/components/play/board';
import Solution from '@/components/play/right-bar/solution';
import useEffectAsync from '@/hooks/use-effect-async';
import GENERIC from '@/sounds/GenericNotify.mp3';
import ERROR from '@/sounds/Error.mp3';
import CAPTURE from '@/sounds/Capture.mp3';
import MOVE from '@/sounds/Move.mp3';
import {Animation} from '@/types/models';

const Timer = dynamic(async () => import('@/components/play/timer'));
const ModalPuzzle = dynamic(async () => import('@/components/modal-puzzle'));
const BottomBar = dynamic(async () => import('@/components/play/bottom-bar'));

const Chess = typeof ChessJS === 'function' ? ChessJS : ChessJS.Chess;

type Props = {puzzle: Puzzle};
const PlayingPage = ({puzzle}: Props) => {
	const [hasSound] = useAtom(configµ.sound);
	const [hasAnimation] = useAtom(configµ.animation);

	const [playMove] = useSound(MOVE);
	const [playCapture] = useSound(CAPTURE);
	const [playError] = useSound(ERROR);
	const [playGeneric] = useSound(GENERIC, {volume: 0.3});

	const [isSolutionClicked, setIsSolutionClicked] = useAtom(playµ.solution);
	const [initialPuzzleTimer, setInitialPuzzleTimer] = useAtom(playµ.timer);

	const [orientation, setOrientation] = useAtom(orientationµ.color);
	const [isReverted] = useAtom(orientationµ.reverted);
	const [, setAnimation] = useAtom(animationµ);

	const [chess, setChess] = useState<ChessInstance>(new Chess());
	const [config, setConfig] = useState<Partial<Config>>();

	const [moveNumber, setMoveNumber] = useState(0);
	const [moveHistory, setMoveHistory] = useState<string[]>([]);
	const [mistakes, setMistakes] = useState(0);
	const [isRunning, setIsRunning] = useState(true);
	const [pendingMove, setPendingMove] = useState<Square[]>([]);
	const router = useRouter();

	const {
		isOpen: isOpenPromotion,
		show: showPromotion,
		hide: hidePromotion,
	} = useModal();

	const [showCompletionModal, setShowCompletionModal] = useState(false);
	const [stat, setStat] = useState<Stat>({
		mistakes: 0,
		time: 0,
		grade: '',
	});

	const toggleAnimation = useCallback(
		async (animationString: Animation) => {
			setAnimation(() => animationString);
			await sleep(600);
			setAnimation(() => '');
		},
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
		[],
	);

	const [random, setRandom] = useState<Puzzle['PuzzleId']>();

	useEffect(() => {
		get_
			.randomePuzzle()
			.then(response => {
				if (response.success) setRandom(() => response.data.PuzzleId);
			})
			.catch(console.error);
	}, [router.asPath]);

	/**
	 * Setup the board.
	 */
	useEffect(() => {
		if (!puzzle?.Moves) return;
		const chess = new Chess(puzzle.FEN);
		setChess(() => chess);
		setMoveHistory(() => puzzle.Moves.split(' '));
		setMoveNumber(() => 0);
		setPendingMove(() => []);
		setInitialPuzzleTimer(() => Date.now());
		setIsSolutionClicked(() => false);
		setIsRunning(() => true);
		setOrientation(() => {
			if (isReverted) return chess.turn() === 'b' ? 'black' : 'white';
			return chess.turn() === 'b' ? 'white' : 'black';
		});

		const config: Partial<Config> = {
			fen: chess.fen(),
			check: chess.in_check(),
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
		};

		setConfig(previousConfig => ({...previousConfig, ...config}));
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [puzzle]);

	const updateBoard = useCallback(
		(from: Square, to: Square, chess: ChessJS.ChessInstance) => {
			setConfig(config => ({
				...config,
				fen: chess.fen(),
				check: chess.in_check(),
				movable: getMovable(chess),
				turnColor: getColor(chess.turn()),
				lastMove: [from, to],
			}));
		},
		[],
	);

	/**
	 * Function making the computer play the next move.
	 */
	const computerMove = useCallback(
		async (moveNumber: number) => {
			if (!chess) return;
			const move = chess.move(moveHistory[moveNumber]!, {sloppy: true});
			if (!move) return;
			await sleep(300);
			updateBoard(move.from, move.to, chess);
			setMoveNumber(previousMove => previousMove + 1);
			/* eslint-disable-next-line @typescript-eslint/no-unused-expressions */
			if (hasSound) move.captured ? playCapture() : playMove();
		},
		[chess, moveHistory, hasSound, playCapture, playMove, updateBoard],
	);

	const checkIsMoveCorrect = useCallback(
		(move: ChessJS.Move, chess: ChessJS.ChessInstance) =>
			`${move.from}${move.to}` === moveHistory[moveNumber] ||
			chess.in_checkmate(),
		[moveHistory, moveNumber],
	);

	/**
	 * Called after each correct move.
	 */
	const handleRightMove = useCallback(
		async (from: Square, to: Square, chess: ChessJS.ChessInstance) => {
			updateBoard(from, to, chess);
			const currentMoveNumber = moveNumber + 1;
			setMoveNumber(previousMove => previousMove + 1);
			const isPuzzleComplete = currentMoveNumber === moveHistory.length;
			if (hasAnimation) {
				const animation = isPuzzleComplete ? 'finishMove' : 'rightMove';
				toggleAnimation(`animate-${animation}`).catch(console.error);
			}

			if (!isPuzzleComplete) {
				await computerMove(currentMoveNumber);
				return;
			}

			const {maxTime, minTime} = getTime.interval(moveHistory.length);
			const {timeTaken, timeWithMistakes} = getTime.taken(initialPuzzleTimer);
			const currentGrade = getGrade({
				didCheat: isSolutionClicked,
				mistakes,
				timeTaken,
				maxTime,
				minTime,
				streak: 0,
			});

			if (hasSound) playGeneric();
			setStat(() => ({
				mistakes,
				time: timeWithMistakes,
				grade: parseGrade[currentGrade]!,
			}));
			setShowCompletionModal(() => true);
		},
		[
			computerMove,
			hasAnimation,
			hasSound,
			playGeneric,
			initialPuzzleTimer,
			isSolutionClicked,
			mistakes,
			moveHistory.length,
			moveNumber,
			toggleAnimation,
			updateBoard,
		],
	);

	const handleWrongMove = useCallback(
		(chess: ChessJS.ChessInstance) => {
			chess.undo();
			setMistakes(previous => previous + 1);
			if (hasAnimation)
				toggleAnimation('animate-wrongMove').catch(console.error);
			if (hasSound) playError();
		},
		[hasAnimation, hasSound, playError, toggleAnimation],
	);

	const checkIsPromotion = useCallback(
		(from: Square, to: Square, moves: ChessJS.Move[]): boolean => {
			for (const move of moves)
				if (move.from === from && move.to === to && move.flags.includes('p'))
					return true;

			return false;
		},
		[],
	);

	/**
	 * Function called when the user plays.
	 */
	const handleUserMove = useCallback(
		async (from: Square, to: Square) => {
			const moves = chess.moves({verbose: true});

			const isPromotion = checkIsPromotion(from, to, moves);
			if (isPromotion) {
				setPendingMove([from, to]);
				showPromotion();
				return;
			}

			const move = chess.move({from, to});
			if (move === null) return;

			/* eslint-disable-next-line @typescript-eslint/no-unused-expressions */
			if (hasSound) move.captured ? playCapture() : playMove();

			const isRightMove = checkIsMoveCorrect(move, chess);
			if (isRightMove) {
				await handleRightMove(from, to, chess);
				return;
			}

			handleWrongMove(chess);
		},
		[
			checkIsPromotion,
			handleRightMove,
			handleWrongMove,
			checkIsMoveCorrect,
			chess,
			showPromotion,
			hasSound,
			playCapture,
			playMove,
		],
	);

	/**
	 * Handle promotions via chessground.
	 */
	const handlePromotion = useCallback(
		async (piece: ShortMove['promotion']) => {
			const from = pendingMove[0]!;
			const to = pendingMove[1]!;
			const isRightMove =
				piece === moveHistory[moveNumber]!.slice(-1) || chess.in_checkmate();
			const move = chess.move({from, to, promotion: piece});
			if (move === null) return;

			/* eslint-disable-next-line @typescript-eslint/no-unused-expressions */
			if (hasSound) move.captured ? playCapture() : playMove();

			if (isRightMove) {
				await handleRightMove(from, to, chess);
				return;
			}

			handleWrongMove(chess);
		},
		[
			handleRightMove,
			handleWrongMove,
			pendingMove,
			moveHistory,
			moveNumber,
			chess,
			hasSound,
			playCapture,
			playMove,
		],
	);

	/**
	 * When the board is setup, make the first move.
	 */
	useEffectAsync(() => {
		if (!moveHistory || moveNumber !== 0) return;
		computerMove(0).catch(console.error);
	}, [moveHistory, moveNumber, computerMove]);

	const fn = useCallback(() => {
		router.reload();
	}, [router]);

	const returnDashboard = async () => router.push('/dashboard');

	const launchTimer = useCallback(() => {
		setIsRunning(() => true);
	}, []);
	useKeyPress({targetKey: 'Q', fn: returnDashboard});
	useKeyPress({targetKey: 'q', fn: returnDashboard});
	useKeyPress({targetKey: 'Escape', fn: returnDashboard});
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
				showModal={showCompletionModal}
				setShowModal={setShowCompletionModal}
				random={random}
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
							config={{
								...config,
								orientation,
								// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
								events: {move: handleUserMove as any},
							}}
							isOpen={isOpenPromotion}
							hide={hidePromotion}
							color={getColor(chess.turn())}
							onPromote={handlePromotion}
						/>
						<BottomBar puzzles={[]} />
					</div>

					<div className='flex flex-row justify-center w-5/6 md:w-fit md:flex-col'>
						<div className='mt-2'>
							<Solution
								answer={moveHistory[moveNumber]!}
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

export const getServerSideProps = withSessionSsr(
	async ({params, req, res}: GetServerSidePropsContext) => {
		const redirect: Redirect = {statusCode: 303, destination: '/'};
		if (!req?.session?.userID) return {redirect};
		const id = params?.id as string | undefined;
		if (!id) return {redirect};
		const protocol = (req.headers['x-forwarded-proto'] as string) || 'http';
		const baseUrl = req ? `${protocol}://${req.headers.host!}` : '';
		const result = await get_.puzzle(id, baseUrl);

		if (!result.success) return {notFound: true};
		res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
		return {props: {puzzle: result.data}};
	},
);
